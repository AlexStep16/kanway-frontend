import { ITask } from '@interfaces/domain/ITask'
import { ICategory } from '@interfaces/domain/ICategory'

export interface ICategoriesWithChildrenResponse {
  categories: ICategory[]
  tasks: ITask[]
}
