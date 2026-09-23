import { useRef } from 'react'
import { FileSpreadsheet, Upload, X } from 'lucide-react'

type CsvUploadProps = {
  selectedFile: File | null
  onFileSelected: (file: File | undefined) => void
  onRemoveFile: () => void
}

function CsvUpload({ selectedFile, onFileSelected, onRemoveFile }: CsvUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleBrowse() {
    fileInputRef.current?.click()
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]

    onFileSelected(file)
  }

  return (
    <div>
      {!selectedFile ? (
        <div
          onClick={handleBrowse}
          className="cursor-pointer rounded-3xl border-2 border-dashed border-slate-300 bg-white px-6 py-16 text-center transition hover:border-blue-400 hover:bg-blue-50/30"
        >
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-600">
            <Upload size={24} />
          </div>

          <h2 className="mt-5 text-lg font-semibold text-slate-900">Drop your CSV file here</h2>

          <p className="mt-2 text-sm text-slate-500">or click to browse from your computer</p>

          <p className="mt-5 text-xs text-slate-400">CSV files only</p>

          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,text/csv"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      ) : (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <FileSpreadsheet size={22} />
              </div>

              <div>
                <p className="font-semibold text-slate-900">{selectedFile.name}</p>

                <p className="mt-1 text-sm text-slate-500">
                  {(selectedFile.size / 1024).toFixed(1)} KB
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onRemoveFile}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              aria-label="Remove selected file"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default CsvUpload
