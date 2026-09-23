export type CleaningStats = {
  trimmedCells: number
  removedEmptyRows: number
  removedDuplicateRows: number
}

export function cleanCsvData(
  data: Record<string, string>[],
  options: {
    trimWhitespace: boolean
    removeEmptyRows: boolean
    removeDuplicates: boolean
  },
): {
  cleanedData: Record<string, string>[]
  cleaningStats: CleaningStats
} {
  let cleanedData = [...data]

  let trimmedCells = 0
  let removedEmptyRows = 0
  let removedDuplicateRows = 0

  // Trim whitespace
  if (options.trimWhitespace) {
    cleanedData = cleanedData.map((row) => {
      const newRow = { ...row }

      for (const key of Object.keys(newRow)) {
        const originalValue = newRow[key]
        const trimmedValue = originalValue.trim()

        if (originalValue !== trimmedValue) {
          trimmedCells++
        }

        newRow[key] = trimmedValue
      }

      return newRow
    })
  }

  // Remove empty rows
  if (options.removeEmptyRows) {
    const beforeCount = cleanedData.length

    cleanedData = cleanedData.filter((row) =>
      Object.values(row).some((value) => value.trim() !== ''),
    )

    removedEmptyRows = beforeCount - cleanedData.length
  }

  // Remove duplicate rows
  if (options.removeDuplicates) {
    const seen = new Set<string>()

    cleanedData = cleanedData.filter((row) => {
      const rowKey = JSON.stringify(row)

      if (seen.has(rowKey)) {
        return false
      }

      seen.add(rowKey)
      return true
    })

    removedDuplicateRows = data.length - cleanedData.length - removedEmptyRows
  }

  return {
    cleanedData,
    cleaningStats: {
      trimmedCells,
      removedEmptyRows,
      removedDuplicateRows,
    },
  }
}
