type CleaningSummaryProps = {
  trimmedCells: number
  removedDuplicateRows: number
  removedEmptyRows: number
}

function CleaningSummary({
  trimmedCells,
  removedDuplicateRows,
  removedEmptyRows,
}: CleaningSummaryProps) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-lg font-semibold text-slate-950">Cleaning summary</h2>

        <p className="mt-1 text-sm text-slate-500">Here's what SA Craft changed in your data.</p>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 p-4">
          <p className="text-sm text-slate-500">Values trimmed</p>

          <p className="mt-1 text-2xl font-semibold text-slate-950">
            {trimmedCells.toLocaleString()}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 p-4">
          <p className="text-sm text-slate-500">Duplicate rows removed</p>

          <p className="mt-1 text-2xl font-semibold text-slate-950">
            {removedDuplicateRows.toLocaleString()}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 p-4">
          <p className="text-sm text-slate-500">Empty rows removed</p>

          <p className="mt-1 text-2xl font-semibold text-slate-950">
            {removedEmptyRows.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 rounded-2xl bg-green-50 px-4 py-3 text-sm text-green-700">
        <span className="font-semibold">Cleaning completed</span>

        <span>Your cleaned data is ready to download.</span>
      </div>
    </section>
  )
}

export default CleaningSummary
