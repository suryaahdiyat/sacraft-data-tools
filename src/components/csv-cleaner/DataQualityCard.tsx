type DataQualityCardProps = {
  score: number
  label: string
  duplicateRowsPercentage: number
  emptyCellsPercentage: number
  emptyRowPercentage: number
}

function DataQualityCard({
  score,
  label,
  duplicateRowsPercentage,
  emptyCellsPercentage,
  emptyRowPercentage,
}: DataQualityCardProps) {
  return (
    <section>
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-slate-900">Data Quality</h2>

        <p className="mt-1 text-sm text-slate-500">
          A quick assessment of the quality of your dataset.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Quality Score</p>

            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-4xl font-bold text-slate-900">{score}</span>

              <span className="text-sm text-slate-400">/ 100</span>
            </div>

            <p className="mt-2 text-sm font-medium text-slate-600">{label}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="rounded-xl bg-slate-50 px-4 py-3">
              <p className="text-xs text-slate-500">Duplicate Rows</p>

              <p className="mt-1 text-lg font-semibold text-slate-900">
                {duplicateRowsPercentage.toFixed(1)}%
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 px-4 py-3">
              <p className="text-xs text-slate-500">Empty Cells</p>

              <p className="mt-1 text-lg font-semibold text-slate-900">
                {emptyCellsPercentage.toFixed(1)}%
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 px-4 py-3">
              <p className="text-xs text-slate-500">Empty Rows</p>

              <p className="mt-1 text-lg font-semibold text-slate-900">
                {emptyRowPercentage.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default DataQualityCard
