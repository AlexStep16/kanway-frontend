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

export async function putBoardApi(payload: Partial<Board> & { _id: string }) {
  return await apiCall<Board[]>({
    method: 'PUT',
    url: `/workspace/${payload.workspace_id}/boards/${payload._id}`,
    data: payload,
  })
}

export async function deleteBoardApi(board_id: string, workspace_id: string) {
  return await apiCall<void>({
    method: 'DELETE',
    url: `/workspace/${workspace_id}/boards/${board_id}`,
  })
}

export async function archiveBoardApi(board_id: string, workspace_id: string) {
  return await apiCall<Board[]>({
    method: 'POST',
    url: `/workspace/${workspace_id}/boards/${board_id}/archive`,
  })
}

export async function cloneBoardApi(board_id: string, workspace_id: string) {
  return await apiCall<CRUDResponse<Board>>({
    method: 'PUT',
    url: `/workspace/${workspace_id}/boards/clone/${board_id}`,
  })
}
