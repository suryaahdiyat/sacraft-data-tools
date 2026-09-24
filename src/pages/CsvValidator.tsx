import { useState } from 'react'
import { FileCheck2 } from 'lucide-react'

import CsvValidatorUpload from '../components/csv-validator/CsvValidatorUpload'
import { parseCsv, type ParsedCsv } from '../utils/csv/validator/parseCsv'
import ValidationRules from '../components/csv-validator/ValidationRules'
import ValidationResults from '../components/csv-validator/ValidationResults'
import AffectedRows from '../components/csv-validator/AffectedRows'
import { detectEmailField } from '../utils/csv/validator/detectEmailField'
import {
  validateRequired,
  type RequiredValidationIssue,
} from '../utils/csv/validator/validateRequired'

import {
  validateDuplicates,
  type DuplicateValidationIssue,
} from '../utils/csv/validator/validateDuplicates'

import { validateEmail, type EmailValidationIssue } from '../utils/csv/validator/validateEmail'

function CsvValidator() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [requiredFields, setRequiredFields] = useState<string[]>([])
  const [parsedCsv, setParsedCsv] = useState<ParsedCsv | null>(null)
  const [isParsing, setIsParsing] = useState(false)
  const [parseError, setParseError] = useState('')
  const [hasValidated, setHasValidated] = useState(false)

  const [requiredIssues, setRequiredIssues] = useState<RequiredValidationIssue[]>([])

  const [uniqueField, setUniqueField] = useState('')
  const [duplicateIssues, setDuplicateIssues] = useState<DuplicateValidationIssue[]>([])
  const [emailField, setEmailField] = useState('')
  const [emailIssues, setEmailIssues] = useState<EmailValidationIssue[]>([])

  async function handleFile(file: File | undefined) {
    if (!file) return

    if (!file.name.toLowerCase().endsWith('.csv')) {
      alert('Please select a CSV file.')
      return
    }

    setSelectedFile(file)
    setParsedCsv(null)
    setParseError('')
    setIsParsing(true)

    setRequiredFields([])
    setUniqueField('')
    setEmailField('')
    setEmailIssues([])
    setHasValidated(false)

    try {
      const result = await parseCsv(file)

      setParsedCsv(result)

      const columns = result.data.length > 0 ? Object.keys(result.data[0]) : []

      setEmailField(detectEmailField(columns))
    } catch {
      setParseError('Unable to read this CSV file.')
    } finally {
      setIsParsing(false)
    }
  }

  function handleRemoveFile() {
    setSelectedFile(null)
    setParsedCsv(null)
    setParseError('')
    setRequiredFields([])
    setIsParsing(false)
    setRequiredIssues([])
    setHasValidated(false)
    setUniqueField('')
    setDuplicateIssues([])
    setEmailField('')
    setEmailIssues([])
  }

  function resetValidationResults() {
    setHasValidated(false)
    setRequiredIssues([])
    setDuplicateIssues([])
    setEmailIssues([])
  }

  return (
    <main className="min-h-[calc(100vh-8rem)] bg-slate-50">
      <div className="mx-auto max-w-4xl px-6 py-16 sm:py-20">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-sm">
            <FileCheck2 size={26} />
          </div>

          <p className="mt-6 text-sm font-semibold text-blue-600">SA Craft Tool</p>

          <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
            CSV Validator
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-lg leading-8 text-slate-600">
            Find issues in your CSV before you use it.
          </p>
        </div>

        {/* Upload */}
        <div className="mt-12">
          <CsvValidatorUpload
            selectedFile={selectedFile}
            onFileSelected={handleFile}
            onRemoveFile={handleRemoveFile}
          />
        </div>
        {isParsing && (
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
            <p className="text-sm text-slate-500">Reading CSV file...</p>
          </div>
        )}

        {parseError && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-6">
            <p className="text-sm font-medium text-red-700">{parseError}</p>
          </div>
        )}

        {parsedCsv && (
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <p className="text-sm text-slate-500">Rows</p>
              <p className="mt-2 text-2xl font-semibold text-slate-950">
                {parsedCsv.rows.toLocaleString()}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <p className="text-sm text-slate-500">Columns</p>
              <p className="mt-2 text-2xl font-semibold text-slate-950">
                {parsedCsv.columns.toLocaleString()}
              </p>
            </div>
          </div>
        )}

        {parsedCsv && (
          <ValidationRules
            columns={parsedCsv.data.length > 0 ? Object.keys(parsedCsv.data[0]) : []}
            requiredFields={requiredFields}
            uniqueField={uniqueField}
            emailField={emailField}
            onRequiredFieldsChange={(fields) => {
              setRequiredFields(fields)
              resetValidationResults()
            }}
            onUniqueFieldChange={(field) => {
              setUniqueField(field)
              resetValidationResults()
            }}
            onEmailFieldChange={(field) => {
              setEmailField(field)
              resetValidationResults()
            }}
          />
        )}

        {parsedCsv && (
          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={() => {
                const requiredValidationIssues = validateRequired(parsedCsv.data, requiredFields)

                const duplicateValidationIssues = validateDuplicates(parsedCsv.data, uniqueField)

                const emailValidationIssues = validateEmail(parsedCsv.data, emailField)

                setRequiredIssues(requiredValidationIssues)
                setDuplicateIssues(duplicateValidationIssues)
                setEmailIssues(emailValidationIssues)
                setHasValidated(true)
              }}
              className="cursor-pointer rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Validate CSV
            </button>
          </div>
        )}

        {parsedCsv && hasValidated && (
          <>
            <ValidationResults
              totalRows={parsedCsv.rows}
              requiredIssues={requiredIssues}
              duplicateIssues={duplicateIssues}
              emailIssues={emailIssues}
            />

            <AffectedRows
              requiredIssues={requiredIssues}
              duplicateIssues={duplicateIssues}
              emailIssues={emailIssues}
            />
          </>
        )}

        {/* Privacy Note */}
        <div className="mt-6 text-center">
          <p className="text-sm text-slate-500">🔒 Your file stays in your browser.</p>
        </div>
      </div>
    </main>
  )
}

export default CsvValidator
