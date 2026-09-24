import Papa from 'papaparse'

export type ParsedCsv = {
  data: Record<string, string>[]
  rows: number
  columns: number
}

export function parseCsv(file: File): Promise<ParsedCsv> {
  return new Promise((resolve, reject) => {
    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,

      complete: (results) => {
        if (results.errors.length > 0) {
          reject(new Error('Failed to parse CSV file.'))
          return
        }

        const data = results.data

        const columns =
          data.length > 0 ? Object.keys(data[0]).length : (results.meta.fields?.length ?? 0)

        resolve({
          data,
          rows: data.length,
          columns,
        })
      },

      error: () => {
        reject(new Error('Failed to read CSV file.'))
      },
    })
  })
}
