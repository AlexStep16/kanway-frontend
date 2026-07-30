import { TASK_COLORS_TITLES } from '~/constants/TASK_COLORS'
import type { IParent } from '~/interfaces/IParent'

export interface ITask {
  id: string
  name: string
  workspace: IParent
  board: IParent
  column: IParent
  isDeleted: boolean
  isDeletedExternal: boolean
  rank: string
  isCompleted: boolean
  priority?: 'low' | 'medium' | 'high' | null
  tags: Array<string>
  userId: string
  deletedTime?: Date | null
  description?: string | null
  dueDate?: string | null
  dueHours?: number | null
  dueMinutes?: number | null
  color?: {
    value: (typeof TASK_COLORS_TITLES)[number]
    tone: 'light' | 'medium' | 'dark'
  } | null
  createdAt: Date
  updatedAt: Date
}
