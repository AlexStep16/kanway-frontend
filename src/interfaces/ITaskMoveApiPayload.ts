export interface ITaskMoveApiPayload {
  id: string
  afterTaskId?: string | null
  beforeTaskId?: string | null
  newCategoryId?: string
}
