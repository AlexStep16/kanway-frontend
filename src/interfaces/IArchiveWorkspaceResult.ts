import { ITask } from '@interfaces/domain/ITask'
import { ICategory } from '@interfaces/domain/ICategory'
import { IBoard } from '@interfaces/domain/IBoard'
import { IWorkspace } from '@interfaces/domain/IWorkspace'

export interface IArchiveWorkspaceResult {
  workspaces: IWorkspace[]
  boards: IBoard[]
  categories: ICategory[]
  tasks: ITask[]
}
