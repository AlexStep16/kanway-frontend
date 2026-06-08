import type { IParent } from '~/interfaces/IParent'

export interface IColumn {
  id: string
  name: string
  workspace: IParent
  board: IParent
  userId: string
  rank: string
  isDeleted: boolean
  isDeletedExternal: boolean
  deletedTime?: Date | null
  createdAt: Date
  updatedAt: Date
}
