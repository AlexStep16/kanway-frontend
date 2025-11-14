import { COLOR_NAMES } from '@/constants/COLOR_NAMES_MAP'
import { OptionalNullable } from '@/types/utils'

export interface ITask {
  id: string
  name: string
  workspaceId: string
  workspaceName: string
  boardId: string
  boardName: string
  categoryId: string
  categoryName: string
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
  color?: OptionalNullable<string>
  colorName?: OptionalNullable<(typeof COLOR_NAMES)[number]>
  createdAt: Date
  updatedAt: Date
}
