import { ICategory } from '@interfaces/domain/ICategory'
import { ITask } from '@interfaces/domain/ITask'

export interface IClonedCategoryResult {
  categories: ICategory[]
  tasks: ITask[]
}
