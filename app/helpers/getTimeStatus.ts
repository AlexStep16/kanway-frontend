import { TimeStatus } from '~/enums/TimeStatus'
import dayjs from 'dayjs'

export function getTimeStatus(
  dueDate: string,
  isCompleted: boolean,
  dueHours?: number | null,
  dueMinutes?: number | null,
): TimeStatus {
  if (isCompleted) return TimeStatus.COMPLETED

  const now = dayjs()
  const date =
    dueHours != null && dueMinutes != null
      ? dayjs(dueDate).hour(dueHours).minute(dueMinutes)
      : dayjs(dueDate).endOf('day')

  if (date < now) return TimeStatus.EXPIRED
  if (date >= now && date <= now.add(2, 'days')) return TimeStatus.EXPIRING
  else if (date >= now) return TimeStatus.PROGRESS

  return TimeStatus.PROGRESS
}
