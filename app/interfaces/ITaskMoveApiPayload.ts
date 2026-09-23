export interface ITaskMoveApiPayload {
  id: string
  afterId?: string | null
  beforeId?: string | null
  newColumnId?: string
}
