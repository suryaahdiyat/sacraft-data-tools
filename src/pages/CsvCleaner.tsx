import { useRef, useState } from 'react'
import Papa from 'papaparse'
import {
  FileSpreadsheet,
  Upload,
  X,
} from 'lucide-react'

type CsvStats = {
  rows: number
  columns: number
  duplicateRows: number
  emptyCells: number
}

function CsvCleaner() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const [csvData, setCsvData] = useState<Record<string, string>[]>([])

  const [csvStats, setCsvStats] = useState<CsvStats | null>(null)

  const [isParsing, setIsParsing] = useState(false)

  const [parseError, setParseError] = useState<string | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)

  function analyzeCsv(data: Record<string, string>[]) {
    const rows = data.length

    const columns =
      data.length > 0
        ? Object.keys(data[0]).length
        : 0

    let emptyCells = 0

    for (const row of data) {
      for (const value of Object.values(row)) {
        if (value.trim() === '') {
          emptyCells++
        }
      }
    }

    const rowKeys = data.map((row) =>
      JSON.stringify(row),
    )

    const uniqueRows = new Set(rowKeys)

    const duplicateRows =
      data.length - uniqueRows.size

    return {
      rows,
      columns,
      duplicateRows,
      emptyCells,
    }
  }

  function handleFile(file: File | undefined) {
    if (!file) return

    if (!file.name.toLowerCase().endsWith('.csv')) {
      alert('Please select a CSV file.')
      return
    }

    setSelectedFile(file)
    setCsvData([])
    setCsvStats(null)
    setParseError(null)
    setIsParsing(true)

    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,

      complete: (results) => {
        if (results.errors.length > 0) {
          setParseError(
            `${results.errors.length} parsing issue(s) found.`,
          )
        }

        const data = results.data

        setCsvData(data)
        setCsvStats(analyzeCsv(data))
        setIsParsing(false)
      },

      error: (error) => {
        setParseError(error.message)
        setIsParsing(false)
      },
    })
  }

  function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0]

    handleFile(file)
  }

  function handleBrowse() {
    fileInputRef.current?.click()
  }

  function handleRemoveFile() {
    setSelectedFile(null)
    setCsvData([])
    setCsvStats(null)
    setParseError(null)
    setIsParsing(false)

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <main className="min-h-[calc(100vh-8rem)] bg-slate-50">
      <div className="mx-auto max-w-4xl px-6 py-16 sm:py-20">

        {/* Header */}
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-sm">
            <FileSpreadsheet size={26} />
          </div>

          <p className="mt-6 text-sm font-semibold text-blue-600">
            SA Craft Tool
          </p>

          <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
            CSV Cleaner
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-lg leading-8 text-slate-600">
            Clean and inspect your CSV files directly in your browser.
          </p>
        </div>

        {/* Upload */}
        <div className="mt-12">
          {!selectedFile ? (
            <div
              onClick={handleBrowse}
              className="cursor-pointer rounded-3xl border-2 border-dashed border-slate-300 bg-white px-6 py-16 text-center transition hover:border-blue-400 hover:bg-blue-50/30"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-600">
                <Upload size={24} />
              </div>

              <h2 className="mt-5 text-lg font-semibold text-slate-900">
                Drop your CSV file here
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                or click to browse from your computer
              </p>

              <p className="mt-5 text-xs text-slate-400">
                CSV files only
              </p>

              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,text/csv"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          ) : (
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4">

                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <FileSpreadsheet size={22} />
                  </div>

                  <div>
                    <p className="font-semibold text-slate-900">
                      {selectedFile.name}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      {(selectedFile.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                  aria-label="Remove selected file"
                >
                  <X size={18} />
                </button>

              </div>
            </div>
          )}
        </div>
        {selectedFile && (
          <div className="mt-6">
            {isParsing ? (
              <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center">
                <p className="font-medium text-slate-900">
                  Analyzing your CSV...
                </p>

                <p className="mt-2 text-sm text-slate-500">
                  Reading rows and checking data quality.
                </p>
              </div>
            ) : csvStats ? (
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-950">
                      Data overview
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Basic information about your CSV.
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                  <div className="rounded-2xl bg-slate-50 p-5">
                    <p className="text-sm text-slate-500">
                      Rows
                    </p>

                    <p className="mt-2 text-2xl font-bold text-slate-950">
                      {csvStats.rows.toLocaleString()}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-5">
                    <p className="text-sm text-slate-500">
                      Columns
                    </p>

                    <p className="mt-2 text-2xl font-bold text-slate-950">
                      {csvStats.columns.toLocaleString()}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-5">
                    <p className="text-sm text-slate-500">
                      Duplicate rows
                    </p>

                    <p className="mt-2 text-2xl font-bold text-slate-950">
                      {csvStats.duplicateRows.toLocaleString()}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-5">
                    <p className="text-sm text-slate-500">
                      Empty cells
                    </p>

                    <p className="mt-2 text-2xl font-bold text-slate-950">
                      {csvStats.emptyCells.toLocaleString()}
                    </p>
                  </div>


                </div>
                {csvData.length > 0 && (
                  <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-200 px-6 py-5">
                      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <h2 className="text-lg font-semibold text-slate-950">
                            Data preview
                          </h2>

                          <p className="mt-1 text-sm text-slate-500">
                            Showing the first 10 rows of your CSV.
                          </p>
                        </div>

                        <span className="text-sm text-slate-400">
                          {csvData.length.toLocaleString()} rows
                        </span>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="min-w-full text-left text-sm">
                        <thead className="border-b border-slate-200 bg-slate-50">
                          <tr>
                            <th className="w-12 px-5 py-3 font-medium text-slate-400">
                              #
                            </th>

                            {Object.keys(csvData[0]).map((column) => (
                              <th
                                key={column}
                                className="whitespace-nowrap px-5 py-3 font-semibold text-slate-700"
                              >
                                {column}
                              </th>
                            ))}
                          </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-100">
                          {csvData.slice(0, 10).map((row, rowIndex) => (
                            <tr
                              key={rowIndex}
                              className="transition hover:bg-slate-50"
                            >
                              <td className="px-5 py-3 text-slate-400">
                                {rowIndex + 1}
                              </td>

                              {Object.keys(csvData[0]).map((column) => (
                                <td
                                  key={column}
                                  className="max-w-xs whitespace-nowrap px-5 py-3 text-slate-600"
                                >
                                  <div className="max-w-[240px] truncate">
                                    {row[column] || (
                                      <span className="text-slate-300">
                                        empty
                                      </span>
                                    )}
                                  </div>
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {parseError && (
                  <div className="mt-5 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-700">
                    {parseError}
                  </div>
                )}

              </div>
            ) : null}
          </div>
        )}

        {/* Privacy note */}
        <div className="mt-6 text-center">
          <p className="text-sm text-slate-500">
            🔒 Your file stays in your browser.
          </p>
        </div>

      </div>
    </main>
  )
}

export default CsvCleaner