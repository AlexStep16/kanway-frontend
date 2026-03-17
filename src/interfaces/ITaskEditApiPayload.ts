import { TASK_COLORS_TITLES } from '@/constants/TASK_COLORS'
import { Nullable } from '@/types/utils'

export interface ITaskEditApiPayload {
  id: string
  name?: string
  description?: Nullable<string>
  dueDate?: Nullable<string>
  dueHours?: Nullable<number>
  dueMinutes?: Nullable<number>
  categoryId?: string
  boardId?: string
  workspaceId?: string
  color?: Nullable<{
    value: (typeof TASK_COLORS_TITLES)[number]
    tone: 'light' | 'medium' | 'dark'
  }>
  tags?: string[]
  isCompleted?: boolean
  order?: number
}
