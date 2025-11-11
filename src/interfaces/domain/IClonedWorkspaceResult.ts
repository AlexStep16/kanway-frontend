import { IWorkspace } from '@interfaces/domain/IWorkspace'
import { IBoard } from '@interfaces/domain/IBoard'
import { ITask } from '@interfaces/domain/ITask'
import { ICategory } from '@interfaces/domain/ICategory'

export interface IClonedWorkspaceResult {
  workspaces: IWorkspace[]
  boards: IBoard[]
  categories: ICategory[]
  tasks: ITask[]
}
