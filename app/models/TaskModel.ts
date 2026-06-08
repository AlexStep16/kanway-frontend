import { TASK_COLORS_TITLES } from '~/constants/TASK_COLORS'
import type { ITask } from '~/interfaces/domain/ITask'

export class TaskModel implements ITask {
  public id: string
  public name: string
  public workspace: {
    id: string
    name: string
  }
  public board: {
    id: string
    name: string
  }
  public column: {
    id: string
    name: string
  }
  public isDeleted: boolean
  public isDeletedExternal: boolean
  public rank: string
  public isCompleted: boolean
  public tags: Array<string>
  public userId: string
  public deletedTime?: Date | null
  public description?: string | null
  public dueDate?: string | null
  public dueHours?: number | null
  public dueMinutes?: number | null
  public color?: {
    value: (typeof TASK_COLORS_TITLES)[number]
    tone: 'light' | 'medium' | 'dark'
  } | null
  public createdAt: Date
  public updatedAt: Date

  constructor(props: ITask) {
    this.id = props.id
    this.name = props.name
    this.workspace = props.workspace
    this.board = props.board
    this.column = props.column
    this.isDeleted = props.isDeleted
    this.isDeletedExternal = props.isDeletedExternal
    this.rank = props.rank
    this.isCompleted = props.isCompleted
    this.tags = props.tags
    this.userId = props.userId
    this.deletedTime = props.deletedTime
    this.description = props.description
    this.dueDate = props.dueDate
    this.dueHours = props.dueHours
    this.dueMinutes = props.dueMinutes
    this.color = props.color
    this.createdAt = props.createdAt
    this.updatedAt = props.updatedAt
  }
}
