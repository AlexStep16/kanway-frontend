export interface ICategoryCreateApiPayload {
  id?: string
  name: string
  boardId: string
  workspaceId: string
  order?: number
}
