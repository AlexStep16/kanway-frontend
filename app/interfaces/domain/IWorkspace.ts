import { AvailableColors } from '~/enums/AvailableColors'

export interface IWorkspace {
  id: string
  name: string
  userId: string
  isFavorite: boolean
  rank: string
  color: AvailableColors
  colorName: string
  isDeleted: boolean
  deletedTime?: Date | null
  createdAt: Date
  updatedAt: Date
}
