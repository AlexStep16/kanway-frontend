export interface ICategoryMoveApiPayload {
  id: string
  afterId?: string | null
  beforeId?: string | null
  newBoardId?: string
}
