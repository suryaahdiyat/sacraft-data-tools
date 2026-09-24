export type RequiredValidationIssue = {
  rowIndex: number
  row: Record<string, string>
  fields: string[]
}

export function validateRequired(
  data: Record<string, string>[],
  requiredFields: string[],
): RequiredValidationIssue[] {
  if (requiredFields.length === 0) {
    return []
  }

  const issues: RequiredValidationIssue[] = []

  data.forEach((row, index) => {
    const missingFields = requiredFields.filter((field) => row[field]?.trim() === '')

    if (missingFields.length > 0) {
      issues.push({
        rowIndex: index + 2,
        row,
        fields: missingFields,
      })
    }
  })

  return issues
}
