import type { IOperationLog } from '~/interfaces/domain/IOperationLog'
import type { IResponseWithLog } from '~/interfaces/IResponseWithLog'

export async function getLogApi(id: string) {
  return await apiCall<IOperationLog[]>({
    method: 'GET',
    url: `/operation-logs/${id}`,
  })
}

export async function patchUndoApi(id: string) {
  return await apiCall<IResponseWithLog<any>[]>({
    method: 'PATCH',
    url: `/operation-logs/${id}/undo`,
  })
}
