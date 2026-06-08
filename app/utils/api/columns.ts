import type { IColumn } from '~/interfaces/domain/IColumn'
import type { ISingleUpdate } from '~/interfaces/domain/ISingleUpdate'
import type { IResponseWithLog } from '~/interfaces/IResponseWithLog'
import type { IColumnCreateApiPayload } from '~/interfaces/IColumnCreateApiPayload'
import type { IColumnMoveApiPayload } from '~/interfaces/IColumnMoveApiPayload'

export async function getColumnsApi(boardId?: string) {
  const queryParams = boardId ? `?boardId=${boardId}` : ''

  return await apiCall<IColumn[]>({
    method: 'GET',
    url: `/columns${queryParams}`,
  })
}

export async function getColumnApi(id: string) {
  return await apiCall<IColumn[]>({
    method: 'GET',
    url: `/columns/${id}`,
  })
}

export async function getArchivedColumnsApi() {
  return await apiCall<IColumn[]>({
    method: 'GET',
    url: `/archive/columns`,
  })
}

export async function postColumnApi(payload: IColumnCreateApiPayload) {
  return await apiCall<IResponseWithLog<IColumn[]>>({
    method: 'POST',
    url: `/columns`,
    data: payload,
  })
}

export async function patchColumnApi(payload: ISingleUpdate<IColumn>) {
  return await apiCall<IResponseWithLog<IColumn[]>>({
    method: 'PATCH',
    url: `/columns/${payload.id}`,
    data: payload,
  })
}

export async function bulkUpdateColumnsApi(payload: ISingleUpdate<IColumn>[]) {
  return await apiCall<IResponseWithLog<IColumn[]>>({
    method: 'PATCH',
    url: `/columns/bulk`,
    data: payload,
  })
}

export async function moveColumnApi(payload: IColumnMoveApiPayload) {
  return await apiCall<IResponseWithLog<IColumn[]>>({
    method: 'PATCH',
    url: `/columns/move`,
    data: payload,
  })
}

export async function deleteColumnApi(id: string) {
  return await apiCall<IResponseWithLog<null>>({
    method: 'DELETE',
    url: `/columns/${id}`,
  })
}

export async function archiveColumnApi(id: string) {
  return await apiCall<IResponseWithLog<IColumn[]>>({
    method: 'PATCH',
    url: `/columns/${id}/archive`,
  })
}

export async function recoverColumnApi(id: string) {
  return await apiCall<IResponseWithLog<IColumn[]>>({
    method: 'PATCH',
    url: `/columns/${id}/recover`,
  })
}

export async function cloneColumnApi(id: string) {
  return await apiCall<IResponseWithLog<IColumn[]>>({
    method: 'POST',
    url: `/columns/${id}/clone`,
  })
}
