import { ICategory } from '@/interfaces/domain/ICategory'

export interface ICategoryState extends ICategory {
  isNew?: boolean
  tempId?: string
}
