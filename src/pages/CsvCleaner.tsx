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

type CleaningStats = {
  trimmedCells: number
  removedEmptyRows: number
  removedDuplicateRows: number
}

type DataQuality = {
  score: number
  duplicatePercentage: number
  emptyCellPercentage: number
  emptyRowPercentage: number
}

function CsvCleaner() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const [csvData, setCsvData] = useState<Record<string, string>[]>([])

  const [csvStats, setCsvStats] = useState<CsvStats | null>(null)

  const [trimWhitespace, setTrimWhitespace] = useState(true)
  const [removeDuplicates, setRemoveDuplicates] = useState(true)
  const [removeEmptyRows, setRemoveEmptyRows] = useState(true)

  const [cleanedData, setCleanedData] = useState<Record<string, string>[]>([])
  const [isCleaning, setIsCleaning] = useState(false)

  const [isParsing, setIsParsing] = useState(false)

  const [parseError, setParseError] = useState<string | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Cleaning statistics
  const [cleaningStats, setCleaningStats] = useState<CleaningStats | null>(null)

  // Data quality metrics
  const [dataQuality, setDataQuality] = useState<DataQuality | null>(null)

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
        setDataQuality(calculateDataQuality(data))
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
    setDataQuality(null)

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  function cleanCsvData() {
    if (csvData.length === 0) {
      return
    }

    setIsCleaning(true)

    let result = [...csvData]

    let trimmedCells = 0
    let removedEmptyRows = 0
    let removedDuplicateRows = 0

    // 1. Trim whitespace
    if (trimWhitespace) {
      result = result.map((row) => {
        const cleanedRow: Record<string, string> = {}

        for (const [key, value] of Object.entries(row)) {
          const trimmedValue = value.trim()

          if (trimmedValue !== value) {
            trimmedCells++
          }

          cleanedRow[key] = trimmedValue
        }

        return cleanedRow
      })
    }

    // 2. Remove empty rows
    if (removeEmptyRows) {
      const beforeCount = result.length

      result = result.filter((row) => {
        return Object.values(row).some(
          (value) => value.trim() !== '',
        )
      })

      removedEmptyRows =
        beforeCount - result.length
    }

    // 3. Remove duplicate rows
    if (removeDuplicates) {
      const seen = new Set<string>()

      const beforeCount = result.length

      result = result.filter((row) => {
        const rowKey = JSON.stringify(row)

        if (seen.has(rowKey)) {
          return false
        }

        seen.add(rowKey)

        return true
      })

      removedDuplicateRows =
        beforeCount - result.length
    }

    setCleanedData(result)

    setCleaningStats({
      trimmedCells,
      removedEmptyRows,
      removedDuplicateRows,
    })

    setIsCleaning(false)
  }

  function downloadCleanedCsv() {
    if (cleanedData.length === 0) {
      return
    }

    const csv = Papa.unparse(cleanedData)

    const blob = new Blob([csv], {
      type: 'text/csv;charset=utf-8;',
    })

    const url = URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = url
    link.download = 'cleaned-data.csv'

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    URL.revokeObjectURL(url)
  }

  function calculateDataQuality(
    data: Record<string, string>[],
  ): DataQuality {
    if (data.length === 0) {
      return {
        score: 0,
        duplicatePercentage: 0,
        emptyCellPercentage: 0,
        emptyRowPercentage: 0,
      }
    }

    const rows = data.length
    const columns = Object.keys(data[0]).length
    const totalCells = rows * columns

    // Duplicate rows
    const rowKeys = data.map((row) =>
      JSON.stringify(row),
    )

    const uniqueRows = new Set(rowKeys)

    const duplicateRows =
      rows - uniqueRows.size

    // Empty cells
    let emptyCells = 0

    // Empty rows
    let emptyRows = 0

    for (const row of data) {
      let rowIsEmpty = true

      for (const value of Object.values(row)) {
        if (value.trim() === '') {
          emptyCells++
        } else {
          rowIsEmpty = false
        }
      }

      if (rowIsEmpty) {
        emptyRows++
      }
    }

    const duplicatePercentage =
      (duplicateRows / rows) * 100

    const emptyCellPercentage =
      totalCells > 0
        ? (emptyCells / totalCells) * 100
        : 0

    const emptyRowPercentage =
      (emptyRows / rows) * 100

    const duplicatePenalty =
      Math.min(
        duplicatePercentage * 0.3,
        30,
      )

    const emptyCellPenalty =
      Math.min(
        emptyCellPercentage * 0.4,
        40,
      )

    const emptyRowPenalty =
      Math.min(
        emptyRowPercentage * 0.3,
        30,
      )

    const score = Math.max(
      0,
      Math.round(
        100 -
          duplicatePenalty -
          emptyCellPenalty -
          emptyRowPenalty,
      ),
    )

    return {
      score,
      duplicatePercentage,
      emptyCellPercentage,
      emptyRowPercentage,
    }
  }

  function getQualityLabel(score: number) {
    if (score >= 90) {
      return 'Excellent'
    }

    if (score >= 75) {
      return 'Good'
    }

    if (score >= 50) {
      return 'Needs attention'
    }

    return 'Poor'
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
                {/* Data Quality */}
                {dataQuality && (
                  <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h2 className="text-lg font-semibold text-slate-950">
                          Data quality
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                          An overview of potential data quality issues.
                        </p>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="flex h-20 w-20 items-center justify-center rounded-full border-8 border-slate-100">
                          <span className="text-2xl font-bold text-slate-950">
                            {dataQuality.score}
                          </span>
                        </div>

                        <div>
                          <p className="text-sm font-semibold text-slate-900">
                            {getQualityLabel(dataQuality.score)}
                          </p>

                          <p className="text-xs text-slate-500">
                            out of 100
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 grid gap-3 sm:grid-cols-3">
                      <div className="rounded-2xl bg-slate-50 p-4">
                        <p className="text-sm text-slate-500">
                          Duplicate rows
                        </p>

                        <p className="mt-1 font-semibold text-slate-950">
                          {dataQuality.duplicatePercentage.toFixed(1)}%
                        </p>
                      </div>

                      <div className="rounded-2xl bg-slate-50 p-4">
                        <p className="text-sm text-slate-500">
                          Empty cells
                        </p>

                        <p className="mt-1 font-semibold text-slate-950">
                          {dataQuality.emptyCellPercentage.toFixed(1)}%
                        </p>
                      </div>

                      <div className="rounded-2xl bg-slate-50 p-4">
                        <p className="text-sm text-slate-500">
                          Empty rows
                        </p>

                        <p className="mt-1 font-semibold text-slate-950">
                          {dataQuality.emptyRowPercentage.toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                {/* Cleaning options */}
                {csvData.length > 0 && (
                  <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div>
                      <h2 className="text-lg font-semibold text-slate-950">
                        Cleaning options
                      </h2>

                      <p className="mt-1 text-sm text-slate-500">
                        Choose how you want to clean your CSV data.
                      </p>
                    </div>

                    <div className="mt-5 space-y-3">
                      <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 p-4 transition hover:border-slate-300 hover:bg-slate-50">
                        <input
                          type="checkbox"
                          checked={trimWhitespace}
                          onChange={(event) => {
                            setTrimWhitespace(event.target.checked)
                            setCleanedData([])
                            setCleaningStats(null)
                          }}
                          className="mt-0.5 h-4 w-4 accent-blue-600"
                        />

                        <div>
                          <p className="text-sm font-medium text-slate-900">
                            Trim whitespace
                          </p>

                          <p className="mt-1 text-sm text-slate-500">
                            Remove unnecessary spaces before and after cell values.
                          </p>
                        </div>
                      </label>

                      <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 p-4 transition hover:border-slate-300 hover:bg-slate-50">
                        <input
                          type="checkbox"
                          checked={removeDuplicates}
                          onChange={(event) => {
                            setRemoveDuplicates(event.target.checked)
                            setCleanedData([])
                            setCleaningStats(null)
                          }}  
                          className="mt-0.5 h-4 w-4 accent-blue-600"
                        />

                        <div>
                          <p className="text-sm font-medium text-slate-900">
                            Remove duplicate rows
                          </p>

                          <p className="mt-1 text-sm text-slate-500">
                            Keep only the first occurrence of identical rows.
                          </p>
                        </div>
                      </label>

                      <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 p-4 transition hover:border-slate-300 hover:bg-slate-50">
                        <input
                          type="checkbox"
                          checked={removeEmptyRows}
                          onChange={(event) => {
                            setRemoveEmptyRows(event.target.checked)
                            setCleanedData([])
                            setCleaningStats(null)
                          }}
                          className="mt-0.5 h-4 w-4 accent-blue-600"
                        />

                        <div>
                          <p className="text-sm font-medium text-slate-900">
                            Remove empty rows
                          </p>

                          <p className="mt-1 text-sm text-slate-500">
                            Remove rows where all cells are empty.
                          </p>
                        </div>
                      </label>
                    </div>

                    <button
                      type="button"
                      onClick={cleanCsvData}
                      disabled={isCleaning}
                      className="mt-5 inline-flex items-center justify-center rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isCleaning ? 'Cleaning...' : 'Apply cleaning'}
                    </button>
                  </div>
                )}
                {/* Preview */}
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
                {/* Cleaning result */}
                {cleanedData.length > 0 && (
                  <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div>
                      <h2 className="text-lg font-semibold text-slate-950">
                        Cleaning result
                      </h2>

                      <p className="mt-1 text-sm text-slate-500">
                        Your cleaned data is ready for preview.
                      </p>
                    </div>

                    <div className="mt-5 grid gap-4 sm:grid-cols-2">
                      <div className="rounded-2xl bg-slate-50 p-4">
                        <p className="text-sm text-slate-500">
                          Original rows
                        </p>

                        <p className="mt-1 text-2xl font-semibold text-slate-950">
                          {csvData.length.toLocaleString()}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-green-50 p-4">
                        <p className="text-sm text-green-700">
                          Cleaned rows
                        </p>

                        <p className="mt-1 text-2xl font-semibold text-green-700">
                          {cleanedData.length.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 rounded-2xl border border-slate-200 p-4">
                      <p className="text-sm text-slate-500">
                        Rows removed
                      </p>

                      <p className="mt-1 text-lg font-semibold text-slate-950">
                        {(csvData.length - cleanedData.length).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}
                {/* cleaning summary */}
                {cleaningStats && (
                  <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div>
                      <h2 className="text-lg font-semibold text-slate-950">
                        Cleaning summary
                      </h2>

                      <p className="mt-1 text-sm text-slate-500">
                        Here's what SA Craft changed in your data.
                      </p>
                    </div>

                    <div className="mt-5 grid gap-4 sm:grid-cols-3">
                      <div className="rounded-2xl border border-slate-200 p-4">
                        <p className="text-sm text-slate-500">
                          Values trimmed
                        </p>

                        <p className="mt-1 text-2xl font-semibold text-slate-950">
                          {cleaningStats.trimmedCells.toLocaleString()}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-slate-200 p-4">
                        <p className="text-sm text-slate-500">
                          Duplicate rows removed
                        </p>

                        <p className="mt-1 text-2xl font-semibold text-slate-950">
                          {cleaningStats.removedDuplicateRows.toLocaleString()}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-slate-200 p-4">
                        <p className="text-sm text-slate-500">
                          Empty rows removed
                        </p>

                        <p className="mt-1 text-2xl font-semibold text-slate-950">
                          {cleaningStats.removedEmptyRows.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2 rounded-2xl bg-green-50 px-4 py-3 text-sm text-green-700">
                      <span className="font-semibold">
                        Cleaning completed
                      </span>

                      <span>
                        Your cleaned data is ready to download.
                      </span>
                    </div>
                  </div>
                )}
                {/* Cleaned data preview */}
                {cleanedData.length > 0 && (
                  <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-200 px-6 py-5">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <h2 className="text-lg font-semibold text-slate-950">
                            Cleaned data preview
                          </h2>

                          <p className="mt-1 text-sm text-slate-500">
                            Preview the cleaned data before downloading it.
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={downloadCleanedCsv}
                          className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                        >
                          Download Clean CSV
                        </button>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="min-w-full text-left text-sm">
                        <thead className="border-b border-slate-200 bg-slate-50">
                          <tr>
                            <th className="w-12 px-5 py-3 font-medium text-slate-400">
                              #
                            </th>

                            {Object.keys(cleanedData[0]).map((column) => (
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
                          {cleanedData.slice(0, 10).map((row, rowIndex) => (
                            <tr
                              key={rowIndex}
                              className="transition hover:bg-slate-50"
                            >
                              <td className="px-5 py-3 text-slate-400">
                                {rowIndex + 1}
                              </td>

                              {Object.keys(cleanedData[0]).map((column) => (
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

                    {cleanedData.length > 10 && (
                      <div className="border-t border-slate-200 px-6 py-4 text-sm text-slate-400">
                        Showing the first 10 rows of {cleanedData.length.toLocaleString()} rows.
                      </div>
                    )}
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