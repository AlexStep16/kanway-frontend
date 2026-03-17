import { TASK_COLORS_TITLES } from '@/constants/TASK_COLORS'
import { OptionalNullable } from '@/types/utils'
import { IParent } from '../IParent'

export interface ITask {
  id: string
  name: string
  workspace: IParent
  board: IParent
  category: IParent
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
  color?: OptionalNullable<{
    value: (typeof TASK_COLORS_TITLES)[number]
    tone: 'light' | 'medium' | 'dark'
  }>
  createdAt: Date
  updatedAt: Date
}
