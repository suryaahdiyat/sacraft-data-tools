export type CsvStats = {
  rows: number
  columns: number
  duplicateRows: number
  emptyCells: number
}

export function analyzeCsv(data: Record<string, string>[]): CsvStats {
  const rows = data.length

  const columns = data.length > 0 ? Object.keys(data[0]).length : 0

  let emptyCells = 0

  for (const row of data) {
    for (const value of Object.values(row)) {
      if (value.trim() === '') {
        emptyCells++
      }
    }
  }

  const rowKeys = data.map((row) => JSON.stringify(row))

  const uniqueRows = new Set(rowKeys)

  const duplicateRows = data.length - uniqueRows.size

  return {
    rows,
    columns,
    duplicateRows,
    emptyCells,
  }
}
