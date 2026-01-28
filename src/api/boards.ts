import { apiCall } from '@/apiClient'
import { IBoard } from '@interfaces/domain/IBoard'
import { IResponseWithLog } from '@/interfaces/IResponseWithLog'
import { IBoardCreateApiPayload } from '@/interfaces/IBoardCreateApiPayload'
import { ISingleUpdate } from '@/interfaces/domain/ISingleUpdate'

export async function getBoardsApi(workspaceId?: string) {
  const queryParams = workspaceId ? `?workspaceId=${workspaceId}` : ''

  return await apiCall<IBoard[]>({
    method: 'GET',
    url: `/boards${queryParams}`,
  })
}

export async function getBoardApi(id: string) {
  return await apiCall<IBoard[]>({
    method: 'GET',
    url: `/boards/${id}`,
  })
}

export async function getBoardsCountApi(workspaceId?: string) {
  const queryParams = workspaceId ? `?workspaceId=${workspaceId}` : ''

  return await apiCall<number>({
    method: 'GET',
    url: `/boards/count${queryParams}`,
  })
}

export async function getArchivedBoardsApi() {
  return await apiCall<IBoard[]>({
    method: 'GET',
    url: `/archive/boards`,
  })
}

export async function postBoardApi(payload: IBoardCreateApiPayload) {
  return await apiCall<IResponseWithLog<IBoard[]>>({
    method: 'POST',
    url: `/boards`,
    data: payload,
  })
}

export async function patchBoardApi(payload: ISingleUpdate<IBoard>) {
  return await apiCall<IResponseWithLog<IBoard[]>>({
    method: 'PATCH',
    url: `/boards/${payload.id}`,
    data: payload,
  })
}

export async function deleteBoardApi(id: string) {
  return await apiCall<void>({
    method: 'DELETE',
    url: `/boards/${id}`,
  })
}

export async function archiveBoardApi(id: string) {
  return await apiCall<IResponseWithLog<IBoard[]>>({
    method: 'PATCH',
    url: `/boards/${id}/archive`,
  })
}

export async function recoverBoardApi(id: string) {
  return await apiCall<IResponseWithLog<IBoard[]>>({
    method: 'PATCH',
    url: `/boards/${id}/recover`,
  })
}

export async function cloneBoardApi(id: string) {
  return await apiCall<IResponseWithLog<IBoard[]>>({
    method: 'POST',
    url: `/boards/${id}/clone`,
  })
}
