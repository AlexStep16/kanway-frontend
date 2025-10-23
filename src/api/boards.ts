import { apiCall } from '@/apiClient'
import BoardRaw from '@interfaces/BoardRaw'
import { CRUDResponse } from '@/interfaces/CRUDResponse'

export async function getBoardsApi(workspaceId: string) {
  return await apiCall<BoardRaw[]>({
    method: 'GET',
    url: `/workspace/${workspaceId}/boards`,
  })
}

export async function postBoardApi(payload: Partial<BoardRaw>, workspaceId: string) {
  return await apiCall<CRUDResponse<BoardRaw>>({
    method: 'POST',
    url: `/workspace/${workspaceId}/boards`,
    data: payload,
  })
}

export async function putBoardApi(
  boardId: string,
  workspaceId: string,
  payload: Partial<BoardRaw>,
) {
  return await apiCall<BoardRaw[]>({
    method: 'PUT',
    url: `/workspace/${workspaceId}/boards/${boardId}`,
    data: payload,
  })
}

export async function deleteBoardApi(boardId: string, workspaceId: string) {
  return await apiCall<void>({
    method: 'DELETE',
    url: `/workspace/${workspaceId}/boards/${boardId}`,
  })
}

export async function archiveBoardApi(boardId: string, workspaceId: string) {
  return await apiCall<BoardRaw[]>({
    method: 'POST',
    url: `/workspace/${workspaceId}/boards/${boardId}/archive`,
  })
}

export async function cloneBoardApi(boardId: string, workspaceId: string) {
  return await apiCall<CRUDResponse<BoardRaw>>({
    method: 'PUT',
    url: `/workspace/${workspaceId}/boards/clone/${boardId}`,
  })
}
