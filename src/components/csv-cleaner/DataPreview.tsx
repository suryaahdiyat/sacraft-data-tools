type DataPreviewProps = {
  data: Record<string, string>[]
  title: string
  description: string
  showRowCount?: boolean
  showDownloadButton?: boolean
  onDownload?: () => void
}

function DataPreview({
  data,
  title,
  description,
  showRowCount = false,
  showDownloadButton = false,
  onDownload,
}: DataPreviewProps) {
  if (data.length === 0) {
    return null
  }

  const columns = Object.keys(data[0])
  const previewData = data.slice(0, 10)

  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-6 py-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-950">{title}</h2>

            <p className="mt-1 text-sm text-slate-500">{description}</p>
          </div>

          <div className="flex items-center gap-3">
            {showRowCount && (
              <span className="text-sm text-slate-400">{data.length.toLocaleString()} rows</span>
            )}

            {showDownloadButton && onDownload && (
              <button
                type="button"
                onClick={onDownload}
                className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Download Clean CSV
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50">
            <tr>
              <th className="w-12 px-5 py-3 font-medium text-slate-400">#</th>

              {columns.map((column) => (
                <th
                  key={column}
                  className="whitespace-nowrap px-5 py-3 font-semibold text-slate-700"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {previewData.map((row, rowIndex) => (
              <tr key={rowIndex} className="transition hover:bg-slate-50">
                <td className="px-5 py-3 text-slate-400">{rowIndex + 1}</td>

                {columns.map((column) => (
                  <td
                    key={`${rowIndex}-${column}`}
                    className="max-w-xs whitespace-nowrap px-5 py-3 text-slate-600"
                  >
                    <div className="max-w-[240px] truncate" title={row[column] ?? ''}>
                      {row[column] || <span className="text-slate-300">empty</span>}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data.length > 10 && (
        <div className="border-t border-slate-200 px-6 py-4 text-sm text-slate-400">
          Showing the first 10 rows of {data.length.toLocaleString()} rows.
        </div>
      )}
    </section>
  )
}

export default DataPreview
