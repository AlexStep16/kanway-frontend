import { TASK_COLORS } from '@/constants/TASK_COLORS'
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
  color?: Nullable<(typeof TASK_COLORS)[number]>
  tags?: string[]
  isCompleted?: boolean
  order?: number
}
