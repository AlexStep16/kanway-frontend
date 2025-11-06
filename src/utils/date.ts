import dayjs from 'dayjs'
import { Nullable } from '@/types/utils'

export function getTimeInReadableFormat(
  dueDate: string,
  dueHours?: Nullable<number>,
  dueMinutes?: Nullable<number>,
): string {
  let output = ''

  output = dayjs(dueDate).calendar()

  if (dueHours != null && dueMinutes != null) {
    output += ` ${dueHours.toString().padStart(2, '0')}:${dueMinutes.toString().padStart(2, '0')}`
  }

  return output
}
