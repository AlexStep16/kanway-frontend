import type { IParent } from '~/interfaces/IParent'

export interface IBoard {
  id: string
  name: string
  workspace: IParent
  userId: string
  isFavorite: boolean
  rank: string
  isDeleted: boolean
  isDeletedExternal: boolean
  deletedTime?: Date
  createdAt: Date
  updatedAt: Date
}
