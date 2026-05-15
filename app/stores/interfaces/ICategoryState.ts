import type { ICategory } from '~/interfaces/domain/ICategory'

export interface ICategoryState extends ICategory {
  tempId?: string
}
