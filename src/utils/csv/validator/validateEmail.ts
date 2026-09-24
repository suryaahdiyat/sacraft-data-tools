export type EmailValidationIssue = {
  rowIndex: number
  row: Record<string, string>
  field: string
  value: string
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

export function validateEmail(
  data: Record<string, string>[],
  field: string,
): EmailValidationIssue[] {
  if (!field) {
    return []
  }

  const issues: EmailValidationIssue[] = []

  data.forEach((row, index) => {
    const value = row[field]?.trim() ?? ''

    if (!value) {
      return
    }

    if (!isValidEmail(value)) {
      issues.push({
        rowIndex: index + 2,
        row,
        field,
        value,
      })
    }
  })

  return issues
}
