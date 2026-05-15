import dayjs from 'dayjs'

export function getTimeInReadableFormat(
  dueDate: string,
  dueHours?: number | null,
  dueMinutes?: number | null,
): string {
  let output = ''

  output = dayjs(dueDate).calendar()

  output = output.charAt(0).toUpperCase() + output.slice(1)

  if (dueHours != null && dueMinutes != null) {
    output += ` ${dueHours.toString().padStart(2, '0')}:${dueMinutes.toString().padStart(2, '0')}`
  }

  return output
}
