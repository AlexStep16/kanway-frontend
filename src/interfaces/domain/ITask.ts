import { COLOR_NAMES } from '@/constants/COLOR_NAMES_MAP'
import { TASK_COLORS } from '@/constants/TASK_COLORS'
import { OptionalNullable } from '@/types/utils'

export interface ITask {
  id: string
  name: string
  workspace: {
    id: string
    name: string
  }
  board: {
    id: string
    name: string
  }
  category: {
    id: string
    name: string
  }
  isDeleted: boolean
  isDeletedExternal: boolean
  order: number
  isCompleted: boolean
  tags: Array<string>
  userId: string
  deletedTime?: OptionalNullable<Date>
  description?: OptionalNullable<string>
  dueDate?: OptionalNullable<string>
  dueHours?: OptionalNullable<number>
  dueMinutes?: OptionalNullable<number>
  color?: OptionalNullable<(typeof TASK_COLORS)[number]>
  colorName?: OptionalNullable<(typeof COLOR_NAMES)[number]>
  createdAt: Date
  updatedAt: Date
}
