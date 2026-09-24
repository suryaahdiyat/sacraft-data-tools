const EMAIL_FIELD_NAMES = ['email', 'email_address', 'email address', 'e-mail', 'mail']

export function detectEmailField(columns: string[]): string {
  const normalizedColumns = columns.map((column) => ({
    original: column,
    normalized: column
      .trim()
      .toLowerCase()
      .replace(/[-\s]+/g, '_'),
  }))

  const match = normalizedColumns.find((column) => EMAIL_FIELD_NAMES.includes(column.normalized))

  return match?.original ?? ''
}
