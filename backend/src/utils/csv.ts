export function toCsv<T extends Record<string, unknown>>(rows: T[], headers: Array<keyof T>): string {
  const escapeCell = (value: unknown) => {
    if (value === null || value === undefined) {
      return '';
    }

    const stringValue = String(value);
    if (/[",\n]/.test(stringValue)) {
      return `"${stringValue.replace(/"/g, '""')}"`;
    }

    return stringValue;
  };

  const headerLine = headers.map(String).join(',');
  const dataLines = rows.map((row) => headers.map((header) => escapeCell(row[header])).join(','));
  return [headerLine, ...dataLines].join('\n');
}
