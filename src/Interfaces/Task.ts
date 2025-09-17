interface Task {
  _id: string
  name: string
  description?: string
  due_date?: Date | null
  due_hours?: number | null
  due_minutes?: number | null
  order: number
  is_completed: boolean
  is_deleted: boolean
  isTaskUpdating?: boolean
  isShowTimeblockCbx?: boolean
  isShowTimeblockCbxTimeout?: NodeJS.Timeout | null
  category_id: string
  category_name?: string
  hasNewCategory?: boolean
  hasNewWorkspace?: boolean
  hasNewBoard?: boolean
  board_id?: string
  board_name?: string
  workspace_id?: string
  workspace_name?: string
  isMenuOpened?: boolean
  color?: string
  tags: Array<string>
  createdAt: Date
  refInputElement?: HTMLElement | null
  selected?: boolean
  isInputShown?: boolean
}

export { Task }