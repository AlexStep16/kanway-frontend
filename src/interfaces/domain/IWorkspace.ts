import { AvailableColors } from '@enums/AvailableColors'

export interface IWorkspace {
  id: string
  name: string
  userId: string
  isFavorite: boolean
  boardsCount: number
  categoriesCount: number
  tasksCount: number
  order: number
  color: AvailableColors
  colorName: string
  isDeleted: boolean
  deletedTime?: Date
  createdAt: Date
  updatedAt: Date
}
