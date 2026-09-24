import { AlertTriangle, CheckCircle2 } from 'lucide-react'

import type { RequiredValidationIssue } from '../../utils/csv/validator/validateRequired'
import type { DuplicateValidationIssue } from '../../utils/csv/validator/validateDuplicates'
import type { EmailValidationIssue } from '../../utils/csv/validator/validateEmail'

type ValidationResultsProps = {
  totalRows: number
  requiredIssues: RequiredValidationIssue[]
  duplicateIssues: DuplicateValidationIssue[]
  emailIssues: EmailValidationIssue[]
}
function ValidationResults({
  totalRows,
  requiredIssues,
  duplicateIssues,
  emailIssues,
}: ValidationResultsProps) {
  const invalidRowIndexes = new Set([
    ...requiredIssues.map((issue) => issue.rowIndex),
    ...duplicateIssues.map((issue) => issue.rowIndex),
    ...emailIssues.map((issue) => issue.rowIndex),
  ])

  const invalidRows = invalidRowIndexes.size
  const validRows = totalRows - invalidRows

  return (
    <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-lg font-semibold text-slate-950">Validation Results</h2>

        <p className="mt-1 text-sm text-slate-500">Summary of the validation checks.</p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-green-200 bg-green-50 p-5">
          <div className="flex items-center gap-2 text-green-700">
            <CheckCircle2 size={20} />
            <span className="text-sm font-medium">Valid rows</span>
          </div>

          <p className="mt-3 text-2xl font-semibold text-green-900">{validRows.toLocaleString()}</p>
        </div>

        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <div className="flex items-center gap-2 text-amber-700">
            <AlertTriangle size={20} />
            <span className="text-sm font-medium">Invalid rows</span>
          </div>

          <p className="mt-3 text-2xl font-semibold text-amber-900">
            {invalidRows.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-sm font-semibold text-slate-900">Issues</h3>

        <div className="mt-3 space-y-2">
          {requiredIssues.length > 0 && (
            <div className="flex items-center justify-between rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
              <div className="flex items-center gap-2">
                <AlertTriangle size={17} className="text-amber-600" />

                <span className="text-sm font-medium text-amber-800">Required field empty</span>
              </div>

              <span className="text-sm font-semibold text-amber-800">
                {requiredIssues.length} issues
              </span>
            </div>
          )}

          {duplicateIssues.length > 0 && (
            <div className="flex items-center justify-between rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
              <div className="flex items-center gap-2">
                <AlertTriangle size={17} className="text-amber-600" />

                <span className="text-sm font-medium text-amber-800">Duplicate value</span>
              </div>

              <span className="text-sm font-semibold text-amber-800">
                {duplicateIssues.length} issues
              </span>
            </div>
          )}
          {emailIssues.length > 0 && (
            <div className="flex items-center justify-between rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
              <div className="flex items-center gap-2">
                <AlertTriangle size={17} className="text-amber-600" />

                <span className="text-sm font-medium text-amber-800">Invalid email</span>
              </div>

              <span className="text-sm font-semibold text-amber-800">
                {emailIssues.length} issues
              </span>
            </div>
          )}

          {requiredIssues.length === 0 &&
            duplicateIssues.length === 0 &&
            emailIssues.length === 0 && (
              <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3">
                <p className="text-sm text-green-700">No validation issues found.</p>
              </div>
            )}
        </div>
      </div>
    </div>
  )
}

export default ValidationResults
