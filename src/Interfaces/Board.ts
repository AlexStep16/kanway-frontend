interface Board {
  _id: string
  name: string
  workspace_id: string
  workspace_name?: string
  is_favorite?: boolean
  is_deleted: boolean
  isMenuOpened: boolean
  order: number
  isTransferMenuOpened: boolean
  hasNewWorkspace?: boolean
  isUpdating: boolean
  isFilling: boolean
  isFilled: boolean
  selected?: boolean
}

export { Board }