import { OptionalNullable } from '@/types/utils'
import { IParent } from '../IParent'

export interface ICategory {
  id: string
  name: string
  workspace: IParent
  board: IParent
  tasksCount: number
  userId: string
  rank: string
  isDeleted: boolean
  isDeletedExternal: boolean
  deletedTime?: OptionalNullable<Date>
  createdAt: Date
  updatedAt: Date
}
