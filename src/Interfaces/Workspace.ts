interface Workspace {
  _id: string
  name: string
  user_id: string
  is_edit_enabled?: boolean
  is_favorite?: boolean
  is_color_for_theme?: boolean
  is_deleted: boolean
  order: number
  isFilled?: boolean
  isFilling?: boolean
  isChatsFilling?: boolean
  color?: string
  inputRefElement?: HTMLElement
  
  isMenuOpened: boolean
  isWorkspaceUpdating: boolean
  selected?: boolean
}

export { Workspace }