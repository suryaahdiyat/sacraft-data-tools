import {
  ArrowRight,
  Check,
  Database,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import { Link } from 'react-router-dom'

function Home() {
  return (
    <main>

      {/* Hero */}
      <section className="relative overflow-hidden bg-slate-50">
        <div className="mx-auto max-w-6xl px-6 pb-24 pt-20 sm:pb-32 sm:pt-28">

          <div className="max-w-3xl">

            {/* Badge */}
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-sm font-medium text-slate-600 shadow-sm">
              <Sparkles size={14} className="text-blue-600" />

              Simple tools for everyday data
            </div>

            {/* Heading */}
            <h1 className="text-5xl font-bold tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
              Craft your data.
            </h1>

            {/* Description */}
            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
              Simple, privacy-first tools to clean, convert, and understand
              your data without unnecessary complexity.
            </p>

            {/* CTA */}
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link
                to="/tools"
                className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
              >
                Explore Tools

                <ArrowRight size={17} />
              </Link>

              <Link
                to="/about"
                className="inline-flex items-center rounded-xl px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-white hover:text-slate-950"
              >
                Learn more
              </Link>
            </div>

          </div>
        </div>
      </section>


      {/* Featured Tool */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-6 py-20 sm:py-24">

          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-blue-600">
              Featured tool
            </p>

            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
              Clean your CSV in seconds.
            </h2>

            <p className="mt-4 leading-7 text-slate-600">
              Quickly inspect and clean messy CSV files directly in your
              browser.
            </p>
          </div>


          {/* Tool Card */}
          <div className="mt-10 overflow-hidden rounded-3xl border border-slate-200 bg-slate-50">

            <div className="grid lg:grid-cols-2">

              {/* Left */}
              <div className="p-8 sm:p-10">

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
                  <Database
                    size={22}
                    className="text-blue-600"
                  />
                </div>

                <h3 className="mt-6 text-2xl font-semibold text-slate-950">
                  CSV Cleaner
                </h3>

                <p className="mt-3 max-w-md leading-7 text-slate-600">
                  Find duplicate rows, empty cells, formatting issues, and
                  other common data problems.
                </p>

                <Link
                  to="/tools/csv-cleaner"
                  className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-slate-950 hover:text-blue-600"
                >
                  Open CSV Cleaner

                  <ArrowRight size={16} />
                </Link>

              </div>


              {/* Right */}
              <div className="border-t border-slate-200 bg-white p-8 lg:border-l lg:border-t-0 sm:p-10">

                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  What you can do
                </p>

                <div className="mt-5 space-y-4">

                  {[
                    'Detect duplicate rows',
                    'Find empty cells',
                    'Trim unnecessary whitespace',
                    'Download cleaned CSV',
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 text-sm text-slate-600"
                    >
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                        <Check size={13} />
                      </span>

                      {item}
                    </div>
                  ))}

                </div>

              </div>

            </div>
          </div>

        </div>
      </section>


      {/* Values */}
      <section className="bg-slate-50">
        <div className="mx-auto max-w-6xl px-6 py-20 sm:py-24">

          <div className="grid gap-10 md:grid-cols-3">

            <div>
              <ShieldCheck
                size={23}
                className="text-slate-950"
              />

              <h3 className="mt-5 font-semibold text-slate-950">
                Privacy-first
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Your files can be processed directly in your browser instead
                of being uploaded to a server.
              </p>
            </div>


            <div>
              <Sparkles
                size={23}
                className="text-slate-950"
              />

              <h3 className="mt-5 font-semibold text-slate-950">
                Simple by design
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Focused tools with a clear interface and no unnecessary
                complexity.
              </p>
            </div>


            <div>
              <Database
                size={23}
                className="text-slate-950"
              />

              <h3 className="mt-5 font-semibold text-slate-950">
                Built for real work
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Designed for students, admins, analysts, developers, and
                everyday business tasks.
              </p>
            </div>

          </div>

        </div>
      </section>

    </main>
  )
}

export default Home