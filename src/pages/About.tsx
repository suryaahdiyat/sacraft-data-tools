function About() {
  return (
    <main className="min-h-[calc(100vh-8rem)] bg-slate-50">
      <div className="mx-auto max-w-3xl px-6 py-20">
        <p className="text-sm font-medium text-slate-500">
          About SA Craft
        </p>

        <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950">
          Useful tools, without the noise.
        </h1>

        <p className="mt-6 text-lg leading-8 text-slate-600">
          SA Craft is a collection of simple browser-based tools for people
          who work with data in their everyday tasks.
        </p>

        <p className="mt-5 leading-7 text-slate-600">
          The goal is simple: make common data tasks easier while keeping the
          experience clear, lightweight, and privacy-conscious.
        </p>
      </div>
    </main>
  )
}

export default About