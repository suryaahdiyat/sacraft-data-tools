type CleaningOptionsProps = {
  removeDuplicates: boolean
  trimWhitespace: boolean
  removeEmptyRows: boolean
  onRemoveDuplicatesChange: (value: boolean) => void
  onTrimWhitespaceChange: (value: boolean) => void
  onRemoveEmptyRowsChange: (value: boolean) => void
  onClean: () => void
}

function CleaningOptions({
  removeDuplicates,
  trimWhitespace,
  removeEmptyRows,
  onRemoveDuplicatesChange,
  onTrimWhitespaceChange,
  onRemoveEmptyRowsChange,
  onClean,
}: CleaningOptionsProps) {
  return (
    <section>
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-slate-900">Cleaning Options</h2>

        <p className="mt-1 text-sm text-slate-500">
          Choose which cleaning operations you want to apply.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="space-y-4">
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={removeDuplicates}
              onChange={(event) => onRemoveDuplicatesChange(event.target.checked)}
              className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />

            <div>
              <p className="text-sm font-medium text-slate-900">Remove duplicate rows</p>

              <p className="mt-1 text-sm text-slate-500">
                Remove rows that contain exactly the same values.
              </p>
            </div>
          </label>

          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={trimWhitespace}
              onChange={(event) => onTrimWhitespaceChange(event.target.checked)}
              className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />

            <div>
              <p className="text-sm font-medium text-slate-900">Trim whitespace</p>

              <p className="mt-1 text-sm text-slate-500">
                Remove unnecessary spaces from the beginning and end of values.
              </p>
            </div>
          </label>

          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={removeEmptyRows}
              onChange={(event) => onRemoveEmptyRowsChange(event.target.checked)}
              className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />

            <div>
              <p className="text-sm font-medium text-slate-900">Remove empty rows</p>

              <p className="mt-1 text-sm text-slate-500">Remove rows where all cells are empty.</p>
            </div>
          </label>
        </div>

        <div className="mt-6 border-t border-slate-100 pt-6">
          <button
            type="button"
            onClick={onClean}
            className="w-full cursor-pointer rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Clean CSV
          </button>
        </div>
      </div>
    </section>
  )
}

export default CleaningOptions
