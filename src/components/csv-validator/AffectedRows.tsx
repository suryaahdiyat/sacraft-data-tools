import { AlertTriangle } from 'lucide-react'

import type { RequiredValidationIssue } from '../../utils/csv/validator/validateRequired'
import type { DuplicateValidationIssue } from '../../utils/csv/validator/validateDuplicates'
import type { EmailValidationIssue } from '../../utils/csv/validator/validateEmail'

type AffectedRowsProps = {
  requiredIssues: RequiredValidationIssue[]
  duplicateIssues: DuplicateValidationIssue[]
  emailIssues: EmailValidationIssue[]
}

type AffectedRow = {
  rowIndex: number
  row: Record<string, string>
  issues: string[]
}

function AffectedRows({ requiredIssues, duplicateIssues, emailIssues }: AffectedRowsProps) {
  const affectedRows = new Map<number, AffectedRow>()

  for (const issue of requiredIssues) {
    const existing = affectedRows.get(issue.rowIndex)

    if (existing) {
      existing.issues.push(...issue.fields.map((field) => `Required: ${field}`))
    } else {
      affectedRows.set(issue.rowIndex, {
        rowIndex: issue.rowIndex,
        row: issue.row,
        issues: issue.fields.map((field) => `Required: ${field}`),
      })
    }
  }

  for (const issue of duplicateIssues) {
    const existing = affectedRows.get(issue.rowIndex)

    if (existing) {
      existing.issues.push(`Duplicate: ${issue.field}`)
    } else {
      affectedRows.set(issue.rowIndex, {
        rowIndex: issue.rowIndex,
        row: issue.row,
        issues: [`Duplicate: ${issue.field}`],
      })
    }
  }

  for (const issue of emailIssues) {
    const existing = affectedRows.get(issue.rowIndex)

    if (existing) {
      existing.issues.push(`Invalid email: ${issue.field}`)
    } else {
      affectedRows.set(issue.rowIndex, {
        rowIndex: issue.rowIndex,
        row: issue.row,
        issues: [`Invalid email: ${issue.field}`],
      })
    }
  }

  const rows = Array.from(affectedRows.values()).sort((a, b) => a.rowIndex - b.rowIndex)

  if (rows.length === 0) {
    return null
  }

  const columns = Object.keys(rows[0].row)

  return (
    <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-lg font-semibold text-slate-950">Affected Rows</h2>

        <p className="mt-1 text-sm text-slate-500">Rows that failed the validation rules.</p>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200">
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50">
            <tr>
              <th className="whitespace-nowrap px-4 py-3 font-semibold text-slate-700">Row</th>

              {columns.map((column) => (
                <th
                  key={column}
                  className="whitespace-nowrap px-4 py-3 font-semibold text-slate-700"
                >
                  {column}
                </th>
              ))}

              <th className="whitespace-nowrap px-4 py-3 font-semibold text-slate-700">Issue</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((affectedRow) => (
              <tr key={affectedRow.rowIndex} className="border-b border-slate-100 last:border-0">
                <td className="whitespace-nowrap px-4 py-3 font-medium text-slate-900">
                  {affectedRow.rowIndex}
                </td>

                {columns.map((column) => (
                  <td key={column} className="max-w-[240px] px-4 py-3 text-slate-600">
                    <span className="block truncate">{affectedRow.row[column] || '-'}</span>
                  </td>
                ))}

                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1.5">
                    {affectedRow.issues.map((issue) => (
                      <span
                        key={issue}
                        className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700"
                      >
                        <AlertTriangle size={12} />
                        {issue}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AffectedRows
