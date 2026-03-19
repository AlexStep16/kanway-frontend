export interface ICategoryMoveApiPayload {
  id: string
  afterCategoryId?: string | null
  beforeCategoryId?: string | null
  newBoardId?: string
}
