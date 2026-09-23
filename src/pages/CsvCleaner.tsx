import { useState } from 'react'
import Papa from 'papaparse'
import { FileSpreadsheet } from 'lucide-react'

import CsvUpload from '../components/csv-cleaner/CsvUpload'
import DataOverview from '../components/csv-cleaner/DataOverview'
import DataQualityCard from '../components/csv-cleaner/DataQualityCard'
import CleaningOptions from '../components/csv-cleaner/CleaningOptions'
import DataPreview from '../components/csv-cleaner/DataPreview'
import CleaningResult from '../components/csv-cleaner/CleaningResult'
import CleaningSummary from '../components/csv-cleaner/CleaningSummary'

import { analyzeCsv, type CsvStats } from '../utils/csv/analyzeCsv'
import { cleanCsvData, type CleaningStats } from '../utils/csv/cleanCsv'
import { calculateDataQuality, type DataQuality } from '../utils/csv/calculateDataQuality'

function CsvCleaner() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [csvData, setCsvData] = useState<Record<string, string>[]>([])
  const [csvStats, setCsvStats] = useState<CsvStats | null>(null)

  const [trimWhitespace, setTrimWhitespace] = useState(true)
  const [removeDuplicates, setRemoveDuplicates] = useState(true)
  const [removeEmptyRows, setRemoveEmptyRows] = useState(true)

  const [cleanedData, setCleanedData] = useState<Record<string, string>[]>([])
  // const [isCleaning, setIsCleaning] = useState(false)
  const [isParsing, setIsParsing] = useState(false)
  const [parseError, setParseError] = useState<string | null>(null)

  const [cleaningStats, setCleaningStats] = useState<CleaningStats | null>(null)

  const [dataQuality, setDataQuality] = useState<DataQuality | null>(null)

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
          setParseError(`${results.errors.length} parsing issue(s) found.`)
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

  function handleRemoveFile() {
    setSelectedFile(null)
    setCsvData([])
    setCsvStats(null)
    setParseError(null)
    setIsParsing(false)
    setDataQuality(null)
    setCleanedData([])
    setCleaningStats(null)
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

  function handleCleanCsv() {
    if (csvData.length === 0) {
      return
    }

    // setIsCleaning(true)

    const result = cleanCsvData(csvData, {
      trimWhitespace,
      removeEmptyRows,
      removeDuplicates,
    })

    setCleanedData(result.cleanedData)
    setCleaningStats(result.cleaningStats)

    // setIsCleaning(false)
  }

  function handleCleaningOptionChange(setter: (value: boolean) => void, value: boolean) {
    setter(value)
    setCleanedData([])
    setCleaningStats(null)
  }

  return (
    <main className="min-h-[calc(100vh-8rem)] bg-slate-50">
      <div className="mx-auto max-w-4xl px-6 py-16 sm:py-20">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-sm">
            <FileSpreadsheet size={26} />
          </div>

          <p className="mt-6 text-sm font-semibold text-blue-600">SA Craft Tool</p>

          <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
            CSV Cleaner
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-lg leading-8 text-slate-600">
            Clean and inspect your CSV files directly in your browser.
          </p>
        </div>

        {/* Upload */}
        <div className="mt-12">
          <CsvUpload
            selectedFile={selectedFile}
            onFileSelected={handleFile}
            onRemoveFile={handleRemoveFile}
          />
        </div>

        {selectedFile && (
          <div className="mt-6">
            {isParsing ? (
              <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center">
                <p className="font-medium text-slate-900">Analyzing your CSV...</p>

                <p className="mt-2 text-sm text-slate-500">
                  Reading rows and checking data quality.
                </p>
              </div>
            ) : csvStats ? (
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <DataOverview
                  rows={csvStats.rows}
                  columns={csvStats.columns}
                  duplicateRows={csvStats.duplicateRows}
                  emptyCells={csvStats.emptyCells}
                />

                {/* Data Quality */}
                {dataQuality && (
                  <div className="mt-6">
                    <DataQualityCard
                      score={dataQuality.score}
                      label={getQualityLabel(dataQuality.score)}
                      duplicateRowsPercentage={dataQuality.duplicatePercentage}
                      emptyCellsPercentage={dataQuality.emptyCellPercentage}
                      emptyRowPercentage={dataQuality.emptyRowPercentage}
                    />
                  </div>
                )}

                {/* Cleaning Options */}
                {csvData.length > 0 && (
                  <div className="mt-6">
                    <CleaningOptions
                      removeDuplicates={removeDuplicates}
                      trimWhitespace={trimWhitespace}
                      removeEmptyRows={removeEmptyRows}
                      onRemoveDuplicatesChange={(value) =>
                        handleCleaningOptionChange(setRemoveDuplicates, value)
                      }
                      onTrimWhitespaceChange={(value) =>
                        handleCleaningOptionChange(setTrimWhitespace, value)
                      }
                      onRemoveEmptyRowsChange={(value) =>
                        handleCleaningOptionChange(setRemoveEmptyRows, value)
                      }
                      onClean={handleCleanCsv}
                    />
                  </div>
                )}

                {/* Preview */}
                {csvData.length > 0 && (
                  <div className="mt-6">
                    <DataPreview
                      data={csvData}
                      title="Data preview"
                      description="Showing the first 10 rows of your CSV."
                      showRowCount
                    />
                  </div>
                )}

                {/* Cleaning Result */}
                {cleanedData.length > 0 && (
                  <div className="mt-6">
                    <CleaningResult
                      originalRows={csvData.length}
                      cleanedRows={cleanedData.length}
                    />
                  </div>
                )}

                {/* Cleaning Summary */}
                {cleaningStats && (
                  <div className="mt-6">
                    <CleaningSummary
                      trimmedCells={cleaningStats.trimmedCells}
                      removedDuplicateRows={cleaningStats.removedDuplicateRows}
                      removedEmptyRows={cleaningStats.removedEmptyRows}
                    />
                  </div>
                )}

                {/* Cleaned Data Preview */}
                {cleanedData.length > 0 && (
                  <div className="mt-6">
                    <DataPreview
                      data={cleanedData}
                      title="Cleaned data preview"
                      description="Preview the cleaned data before downloading it."
                      showDownloadButton
                      onDownload={downloadCleanedCsv}
                    />
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

        {/* Privacy Note */}
        <div className="mt-6 text-center">
          <p className="text-sm text-slate-500">🔒 Your file stays in your browser.</p>
        </div>
      </div>
    </main>
  )
}

export default CsvCleaner
