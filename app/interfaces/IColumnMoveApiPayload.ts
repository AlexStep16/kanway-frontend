export interface IColumnMoveApiPayload {
  id: string
  afterId?: string | null
  beforeId?: string | null
  newBoardId?: string
}
