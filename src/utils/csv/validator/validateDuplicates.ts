export type DuplicateValidationIssue = {
  rowIndex: number
  row: Record<string, string>
  field: string
  value: string
}

export function validateDuplicates(
  data: Record<string, string>[],
  field: string,
): DuplicateValidationIssue[] {
  if (!field) {
    return []
  }

  const valueMap = new Map<string, number[]>()

  data.forEach((row, index) => {
    const value = row[field]?.trim()

    if (!value) {
      return
    }

    const rows = valueMap.get(value) ?? []

    rows.push(index + 2)

    valueMap.set(value, rows)
  })

  const issues: DuplicateValidationIssue[] = []

  data.forEach((row, index) => {
    const value = row[field]?.trim()

    if (!value) {
      return
    }

    const rows = valueMap.get(value) ?? []

    if (rows.length > 1) {
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
