import { IBoard } from './domain/IBoard'
import { ICategory } from './domain/ICategory'
import { ITask } from './domain/ITask'
import { IWorkspace } from './domain/IWorkspace'

export interface IActionResponse {
  create?: {
    workspaces?: IWorkspace[]
    boards?: IBoard[]
    categories?: ICategory[]
    tasks?: ITask[]
  }
  edit?: {
    workspaces?: IWorkspace[]
    boards?: IBoard[]
    categories?: ICategory[]
    tasks?: ITask[]
  }
  archive?: {
    workspaces?: IWorkspace[]
    boards?: IBoard[]
    categories?: ICategory[]
    tasks?: ITask[]
  }
  recover?: {
    workspaces?: IWorkspace[]
    boards?: IBoard[]
    categories?: ICategory[]
    tasks?: ITask[]
  }
  delete?: {
    workspaces?: IWorkspace[]
    boards?: IBoard[]
    categories?: ICategory[]
    tasks?: ITask[]
  }
  clone?: {
    workspaces?: IWorkspace[]
    boards?: IBoard[]
    categories?: ICategory[]
    tasks?: ITask[]
  }
  list?: {
    workspaces?: IWorkspace[]
    boards?: IBoard[]
    categories?: ICategory[]
    tasks?: ITask[]
  }
}
