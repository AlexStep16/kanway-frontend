import { IBoard } from '@interfaces/domain/IBoard'
import { ICategory } from '@interfaces/domain/ICategory'
import { ITask } from '@interfaces/domain/ITask'

export interface IClonedBoardResult {
  boards: IBoard[]
  categories: ICategory[]
  tasks: ITask[]
}
