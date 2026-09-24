type ValidationRulesProps = {
  columns: string[]
  requiredFields: string[]
  uniqueField: string
  emailField: string
  onRequiredFieldsChange: (fields: string[]) => void
  onUniqueFieldChange: (field: string) => void
  onEmailFieldChange: (field: string) => void
}

function ValidationRules({
  columns,
  requiredFields,
  uniqueField,
  emailField,
  onRequiredFieldsChange,
  onUniqueFieldChange,
  onEmailFieldChange,
}: ValidationRulesProps) {
  function handleToggleField(field: string) {
    if (requiredFields.includes(field)) {
      onRequiredFieldsChange(requiredFields.filter((item) => item !== field))
      return
    }

    onRequiredFieldsChange([...requiredFields, field])
  }

  return (
    <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-lg font-semibold text-slate-950">Validation Rules</h2>

        <p className="mt-1 text-sm text-slate-500">Choose which fields should be required.</p>
      </div>

      {/* Required Fields */}
      <div className="mt-6">
        <p className="text-sm font-medium text-slate-700">Required fields</p>

        {columns.length === 0 ? (
          <p className="mt-3 text-sm text-slate-500">No columns detected.</p>
        ) : (
          <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {columns.map((column) => (
              <label
                key={column}
                className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 transition hover:bg-slate-50"
              >
                <input
                  type="checkbox"
                  checked={requiredFields.includes(column)}
                  onChange={() => handleToggleField(column)}
                  className="h-4 w-4 cursor-pointer accent-blue-600"
                />

                <span className="truncate text-sm text-slate-700">{column}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Unique Field */}
      <div className="mt-8">
        <p className="text-sm font-medium text-slate-700">Unique field</p>

        <p className="mt-1 text-xs text-slate-500">
          Check whether values in a column appear more than once.
        </p>

        <select
          value={uniqueField}
          onChange={(event) => onUniqueFieldChange(event.target.value)}
          className="mt-3 w-full cursor-pointer rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 sm:max-w-md"
        >
          <option value="">No unique field</option>

          {columns.map((column) => (
            <option key={column} value={column}>
              {column}
            </option>
          ))}
        </select>
      </div>

      {/* Email Field */}
      <div className="mt-8">
        <p className="text-sm font-medium text-slate-700">Email field</p>

        <p className="mt-1 text-xs text-slate-500">
          Check whether values in a column contain a valid email format.
        </p>

        <select
          value={emailField}
          onChange={(event) => onEmailFieldChange(event.target.value)}
          className="mt-3 w-full cursor-pointer rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 sm:max-w-md"
        >
          <option value="">No email validation</option>

          {columns.map((column) => (
            <option key={column} value={column}>
              {column}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

export default ValidationRules
