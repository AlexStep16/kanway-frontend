import { apiCall } from '@/apiClient'
import { Board } from '@interfaces/Board'

export async function getBoardsApi(workspace_id: string) {
  return await apiCall<Board[]>({
    method: 'GET',
    url: `/workspace/${workspace_id}/boards`,
  })
}
