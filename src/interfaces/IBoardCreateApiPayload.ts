export interface IBoardCreateApiPayload {
  id?: string
  name: string
  workspaceId: string
  isFavorite?: boolean
  order?: number
}
