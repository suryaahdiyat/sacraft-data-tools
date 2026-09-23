type CleaningResultProps = {
  originalRows: number
  cleanedRows: number
}

function CleaningResult({ originalRows, cleanedRows }: CleaningResultProps) {
  const rowsRemoved = originalRows - cleanedRows

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-lg font-semibold text-slate-950">Cleaning result</h2>

        <p className="mt-1 text-sm text-slate-500">Your cleaned data is ready for preview.</p>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-sm text-slate-500">Original rows</p>

          <p className="mt-1 text-2xl font-semibold text-slate-950">
            {originalRows.toLocaleString()}
          </p>
        </div>

        <div className="rounded-2xl bg-green-50 p-4">
          <p className="text-sm text-green-700">Cleaned rows</p>

          <p className="mt-1 text-2xl font-semibold text-green-700">
            {cleanedRows.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-slate-200 p-4">
        <p className="text-sm text-slate-500">Rows removed</p>

        <p className="mt-1 text-lg font-semibold text-slate-950">{rowsRemoved.toLocaleString()}</p>
      </div>
    </section>
  )
}

export default CleaningResult
