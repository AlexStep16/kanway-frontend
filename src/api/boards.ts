import { apiCall } from '@/apiClient'
import { IClonedBoardResult } from '@interfaces/domain/IClonedBoardResult'
import { IBoard } from '@interfaces/domain/IBoard'
import { IArchiveBoardResult } from '@/interfaces/IArchiveBoardResult'

export async function getBoardsApi(workspaceId: string) {
  return await apiCall<IBoard[]>({
    method: 'GET',
    url: `/workspaces/${workspaceId}/boards`,
  })
}

export async function getBoardsCountApi(workspaceId: string) {
  return await apiCall<number>({
    method: 'GET',
    url: `/workspaces/${workspaceId}/boards/count`,
  })
}

export async function getArchivedBoardsApi() {
  return await apiCall<IBoard[]>({
    method: 'GET',
    url: `/archive/boards`,
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
  return await apiCall<IArchiveBoardResult>({
    method: 'PATCH',
    url: `/workspaces/${workspaceId}/boards/${boardId}/archive`,
  })
}

export async function recoverBoardApi(boardId: string, workspaceId: string) {
  return await apiCall<IBoard[]>({
    method: 'PATCH',
    url: `/workspaces/${workspaceId}/boards/${boardId}/recover`,
  })
}

export async function cloneBoardApi(boardId: string, workspaceId: string) {
  return await apiCall<IClonedBoardResult>({
    method: 'POST',
    url: `/workspaces/${workspaceId}/boards/${boardId}/clone`,
  })
}
