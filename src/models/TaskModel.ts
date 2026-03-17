import { COLOR_NAMES } from '@/constants/COLOR_NAMES_MAP'
import { TASK_COLORS, TASK_COLORS_TITLES } from '@/constants/TASK_COLORS'
import { OptionalNullable } from '@/types/utils'
import { ITask } from '@interfaces/domain/ITask'

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
  public category: {
    id: string
    name: string
  }
  public isDeleted: boolean
  public isDeletedExternal: boolean
  public order: number
  public isCompleted: boolean
  public tags: Array<string>
  public userId: string
  public deletedTime?: OptionalNullable<Date>
  public description?: OptionalNullable<string>
  public dueDate?: OptionalNullable<string>
  public dueHours?: OptionalNullable<number>
  public dueMinutes?: OptionalNullable<number>
  public color?: OptionalNullable<{
    value: (typeof TASK_COLORS_TITLES)[number]
    tone: 'light' | 'medium' | 'dark'
  }>
  public colorName?: OptionalNullable<(typeof COLOR_NAMES)[number]>
  public createdAt: Date
  public updatedAt: Date

  constructor(props: ITask) {
    this.id = props.id
    this.name = props.name
    this.workspace = props.workspace
    this.board = props.board
    this.category = props.category
    this.isDeleted = props.isDeleted
    this.isDeletedExternal = props.isDeletedExternal
    this.order = props.order
    this.isCompleted = props.isCompleted
    this.tags = props.tags
    this.userId = props.userId
    this.deletedTime = props.deletedTime
    this.description = props.description
    this.dueDate = props.dueDate
    this.dueHours = props.dueHours
    this.dueMinutes = props.dueMinutes
    this.color = props.color
    this.colorName = props.colorName
    this.createdAt = props.createdAt
    this.updatedAt = props.updatedAt
  }
}
