// Utility function to format date from ISO to display format
export function formatDisplayDate(isoDate: string): string {
  const date = new Date(isoDate)
  const months = [
    'JAN',
    'FEB',
    'MAR',
    'APR',
    'MAY',
    'JUN',
    'JUL',
    'AUG',
    'SEP',
    'OCT',
    'NOV',
    'DEC',
  ]
  const month = months[date.getMonth()]
  const day = date.getDate().toString().padStart(2, '0')
  const year = date.getFullYear()
  return `${month} ${day} ${year}`
}
