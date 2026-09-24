import { ArrowRight, FileSpreadsheet, FileCheck2 } from 'lucide-react'
import { Link } from 'react-router-dom'

function Tools() {
  return (
    <main className="min-h-[calc(100vh-8rem)] bg-slate-50">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-slate-500">SA Craft Tools</p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950">
            Tools for working with data.
          </h1>

          <p className="mt-4 text-lg leading-8 text-slate-600">
            Small tools designed to make everyday data tasks easier.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100">
              <FileSpreadsheet size={22} />
            </div>

            <h2 className="mt-5 text-xl font-semibold text-slate-900">CSV Cleaner</h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Clean duplicate rows, whitespace, empty rows, and inspect the quality of your CSV
              data.
            </p>

            <Link
              to="/tools/csv-cleaner"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-900 hover:text-slate-600"
            >
              Open tool
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100">
              <FileCheck2 size={22} />
            </div>

            <h2 className="mt-5 text-xl font-semibold text-slate-900">CSV Validator</h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Find issues in your CSV before you use it.
            </p>

            <Link
              to="/tools/csv-validator"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-900 hover:text-slate-600"
            >
              Open tool
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Tools
