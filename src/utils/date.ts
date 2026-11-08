export function toIsoDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function today(): string {
  return toIsoDate(new Date())
}

export function currentWeekRange(reference: Date = new Date()): { from: string; to: string } {
  const start = new Date(reference)
  const daysSinceMonday = (start.getDay() + 6) % 7
  start.setDate(start.getDate() - daysSinceMonday)
  const end = new Date(start)
  end.setDate(start.getDate() + 6)
  return { from: toIsoDate(start), to: toIsoDate(end) }
}

export function isOverdue(dueDate: string | null, isCompleted: boolean, reference = today()) {
  return dueDate !== null && !isCompleted && dueDate < reference
}

export function formatDate(isoDate: string): string {
  const [year, month, day] = isoDate.split('-').map(Number)
  return new Date(year, month - 1, day).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function formatLongDate(date: Date): string {
  return date.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })
}
