import { ITask } from '@interfaces/domain/ITask'
import { ICategory } from '@interfaces/domain/ICategory'

export interface IArchiveCategoryResult {
  categories: ICategory[]
  tasks: ITask[]
}
