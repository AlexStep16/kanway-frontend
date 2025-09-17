import { Task } from './Task'

enum SortingType {
  Date = "date",
  Name = "name",
  ExpireDate = "expire_date",
}

interface Category {
  _id: string
  name: string
  board_id: string
  board_name?: string
  workspace_id?: string
  workspace_name?: string
  tasks: Task[]
  order: number
  isNameInputShown?: boolean
  refInputElement?: HTMLElement | null
  refDivElement?: HTMLElement | null
  isMenuOpened?: boolean
  is_deleted: boolean
  isSortMenuOpened?: boolean
  isCategoryUpdating?: boolean
  hasNewBoard?: boolean
  hasNewWorkspace?: boolean
  savedName?: string
  selected?: boolean
  sorting?: {
    type: SortingType | null
    up: boolean | null
  }
  createdAt: Date
  tasksCount: number
  addTaskButtonRef?: { value: HTMLElement | null } | null
}

export { Category, SortingType }