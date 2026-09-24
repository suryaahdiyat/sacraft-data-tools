import { useRef } from 'react'
import { FileSpreadsheet, Upload, X } from 'lucide-react'

type CsvValidatorUploadProps = {
  selectedFile: File | null
  onFileSelected: (file: File | undefined) => void
  onRemoveFile: () => void
}

function CsvValidatorUpload({
  selectedFile,
  onFileSelected,
  onRemoveFile,
}: CsvValidatorUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    onFileSelected(file)

    event.target.value = ''
  }

  return (
    <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 shadow-sm">
      {!selectedFile ? (
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <Upload size={22} />
          </div>

          <p className="mt-4 font-medium text-slate-900">Upload your CSV file</p>

          <p className="mt-2 text-sm text-slate-500">Select a CSV file to start validation.</p>

          <input
            ref={inputRef}
            type="file"
            accept=".csv,text/csv"
            onChange={handleFileChange}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="mt-6 cursor-pointer rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Choose CSV File
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <FileSpreadsheet size={20} />
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-slate-900">{selectedFile.name}</p>

              <p className="mt-1 text-xs text-slate-500">
                {(selectedFile.size / 1024).toFixed(1)} KB
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onRemoveFile}
            className="flex shrink-0 cursor-pointer items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <X size={16} />
            Remove
          </button>
        </div>
      )}
    </div>
  )
}

export default CsvValidatorUpload
