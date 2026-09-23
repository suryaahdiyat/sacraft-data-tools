export type DataQuality = {
  score: number
  duplicatePercentage: number
  emptyCellPercentage: number
  emptyRowPercentage: number
}

export function calculateDataQuality(data: Record<string, string>[]): DataQuality {
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
  const rowKeys = data.map((row) => JSON.stringify(row))
  const uniqueRows = new Set(rowKeys)
  const duplicateRows = rows - uniqueRows.size

  // Empty cells & empty rows
  let emptyCells = 0
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

  const duplicatePercentage = (duplicateRows / rows) * 100

  const emptyCellPercentage = totalCells > 0 ? (emptyCells / totalCells) * 100 : 0

  const emptyRowPercentage = (emptyRows / rows) * 100

  const duplicatePenalty = Math.min(duplicatePercentage * 0.3, 30)
  const emptyCellPenalty = Math.min(emptyCellPercentage * 0.4, 40)
  const emptyRowPenalty = Math.min(emptyRowPercentage * 0.3, 30)

  const score = Math.max(0, Math.round(100 - duplicatePenalty - emptyCellPenalty - emptyRowPenalty))

  return {
    score,
    duplicatePercentage,
    emptyCellPercentage,
    emptyRowPercentage,
  }
}
