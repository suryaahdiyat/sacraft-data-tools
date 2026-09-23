type DataOverviewProps = {
  rows: number
  columns: number
  duplicateRows: number
  emptyCells: number
}

function DataOverview({ rows, columns, duplicateRows, emptyCells }: DataOverviewProps) {
  return (
    <section>
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-slate-900">Data Overview</h2>

        <p className="mt-1 text-sm text-slate-500">Quick summary of your uploaded CSV file.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Rows</p>

          <p className="mt-2 text-2xl font-semibold text-slate-900">{rows.toLocaleString()}</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Columns</p>

          <p className="mt-2 text-2xl font-semibold text-slate-900">{columns.toLocaleString()}</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Duplicate Rows</p>

          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {duplicateRows.toLocaleString()}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Empty Cells</p>

          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {emptyCells.toLocaleString()}
          </p>
        </div>
      </div>
    </section>
  )
}

export default DataOverview
