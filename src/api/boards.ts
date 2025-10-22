import { apiCall } from '@/apiClient'
import { Board } from '@interfaces/Board'
import { CRUDResponse } from '@/interfaces/CRUDResponse'

export async function getBoardsApi(workspace_id: string) {
  return await apiCall<Board[]>({
    method: 'GET',
    url: `/workspace/${workspace_id}/boards`,
  })
}

export async function postBoardApi(board: Partial<Board>, workspace_id: string) {
  return await apiCall<CRUDResponse<Board>>({
    method: 'POST',
    url: `/workspace/${workspace_id}/boards`,
    data: board,
  })
}

export async function putBoardApi(board: Board, workspace_id: string) {
  return await apiCall<Board[]>({
    method: 'PUT',
    url: `/workspace/${workspace_id}/boards/${board._id}`,
    data: board,
  })
}

export async function deleteBoardApi(boardId: string, workspace_id: string) {
  return await apiCall<void>({
    method: 'DELETE',
    url: `/workspace/${workspace_id}/boards/${boardId}`,
  })
}

export async function archiveBoardApi(boardId: string, workspace_id: string) {
  return await apiCall<Board[]>({
    method: 'POST',
    url: `/workspace/${workspace_id}/boards/${boardId}/archive`,
  })
}
