import { TASK_COLORS_TITLES } from '~/constants/TASK_COLORS'

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
  color?: {
    value: (typeof TASK_COLORS_TITLES)[number]
    tone: 'light' | 'medium' | 'dark'
  }
  tags?: string[]
  isCompleted?: boolean
}
