import { TASK_COLORS } from '@/constants/TASK_COLORS'

export interface ITaskCreateApiPayload {
  id?: string
  name: string
  description?: string
  dueDate?: string
  dueHours?: number
  dueMinutes?: number
  categoryId: string
  boardId: string
  workspaceId: string
  color?: (typeof TASK_COLORS)[number]
  tags?: string[]
  isCompleted?: boolean
  order?: number
}
