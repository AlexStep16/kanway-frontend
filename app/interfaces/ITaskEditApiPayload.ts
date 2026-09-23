import { TASK_COLORS_TITLES } from '~/constants/TASK_COLORS'

export interface ITaskEditApiPayload {
  id: string
  name?: string
  description?: string | null
  dueDate?: string | null
  dueHours?: number | null
  dueMinutes?: number | null
  priority?: 'low' | 'medium' | 'high' | null
  columnId?: string
  color?: {
    value: (typeof TASK_COLORS_TITLES)[number]
    tone: 'light' | 'medium' | 'dark'
  } | null
  tags?: string[]
  isCompleted?: boolean
}
