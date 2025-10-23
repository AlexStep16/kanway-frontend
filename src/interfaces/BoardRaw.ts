export default interface BoardRaw {
  _id: string
  name: string
  workspace_id: string
  is_deleted: boolean
  is_favorite: boolean
  order?: number
  createdAt: string
  updatedAt: string
}
