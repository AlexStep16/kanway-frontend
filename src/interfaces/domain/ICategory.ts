import { OptionalNullable } from '@/types/utils'

export interface ICategory {
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
  tasksCount: number
  userId: string
  order: number
  isDeleted: boolean
  isDeletedExternal: boolean
  deletedTime?: OptionalNullable<Date>
  createdAt: Date
  updatedAt: Date
}
