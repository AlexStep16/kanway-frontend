export default interface WorkspaceRaw {
  _id: string
  name: string
  user_id: string
  is_deleted: boolean
  is_favorite: boolean
  order?: number
  color: string
  createdAt: string
  updatedAt: string
}
