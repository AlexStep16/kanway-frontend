import { ITask } from '@interfaces/domain/ITask'
import { ICategory } from '@interfaces/domain/ICategory'
import { IBoard } from '@interfaces/domain/IBoard'

export interface IArchiveBoardResult {
  boards: IBoard[]
  categories: ICategory[]
  tasks: ITask[]
}
