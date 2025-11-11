import { AvailableColors } from '@enums/AvailableColors'

export interface IWorkspace {
  id: string
  name: string
  userId: string
  isFavorite: boolean
  order: number
  color: AvailableColors
  isDeleted: boolean
  deletedTime?: Date
  createdAt: Date
  updatedAt: Date
}
