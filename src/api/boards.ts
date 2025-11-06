import { apiCall } from '@/apiClient'
import IBoard from '@models/BoardModel'

export async function getBoardsApi(workspaceId: string) {
  return await apiCall<IBoard[]>({
    method: 'GET',
    url: `/workspaces/${workspaceId}/boards`,
  })
}

export async function postBoardApi(payload: Partial<IBoard>, workspaceId: string) {
  return await apiCall<IBoard[]>({
    method: 'POST',
    url: `/workspaces/${workspaceId}/boards`,
    data: payload,
  })
}

export async function patchBoardApi(
  boardId: string,
  workspaceId: string,
  payload: Partial<IBoard>,
) {
  return await apiCall<IBoard[]>({
    method: 'PATCH',
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
    method: 'PATCH',
    url: `/workspaces/${workspaceId}/boards/${boardId}/archive`,
  })
}

export async function cloneBoardApi(boardId: string, workspaceId: string) {
  return await apiCall<IBoard[]>({
    method: 'POST',
    url: `/workspaces/${workspaceId}/boards/${boardId}/clone`,
  })
}
