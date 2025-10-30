import { apiCall } from '@/apiClient'
import IBoard from '@models/BoardModel'
import { CRUDResponse } from '@/interfaces/CRUDResponse'

export async function getBoardsApi(workspaceId: string) {
  return await apiCall<IBoard[]>({
    method: 'GET',
    url: `/workspaces/${workspaceId}/boards`,
  })
}

export async function postBoardApi(payload: Partial<IBoard>, workspaceId: string) {
  return await apiCall<CRUDResponse<IBoard>>({
    method: 'POST',
    url: `/workspaces/${workspaceId}/boards`,
    data: payload,
  })
}

export async function putBoardApi(boardId: string, workspaceId: string, payload: Partial<IBoard>) {
  return await apiCall<IBoard[]>({
    method: 'PUT',
    url: `/workspaces/${workspaceId}/boards/${boardId}`,
    data: payload,
  })
}

export async function deleteBoardApi(boardId: string, workspaceId: string) {
  return await apiCall<void>({
    method: 'DELETE',
    url: `/workspaces/${workspaceId}/boards/${boardId}`,
  })
}

export async function archiveBoardApi(boardId: string, workspaceId: string) {
  return await apiCall<IBoard[]>({
    method: 'POST',
    url: `/workspaces/${workspaceId}/boards/${boardId}/archive`,
  })
}

export async function cloneBoardApi(boardId: string, workspaceId: string) {
  return await apiCall<CRUDResponse<IBoard>>({
    method: 'PUT',
    url: `/workspaces/${workspaceId}/boards/clone/${boardId}`,
  })
}
