import { apiCall } from '@/apiClient'
import { IOperationLog } from '@/interfaces/domain/IOperationLog'
import { IUndoResponse } from '@/interfaces/IUndoResponse'

export async function getLogApi(id: string) {
  return await apiCall<IOperationLog[]>({
    method: 'GET',
    url: `/operation-logs/${id}`,
  })
}

export async function patchUndoApi(id: string) {
  return await apiCall<IUndoResponse>({
    method: 'PATCH',
    url: `/operation-logs/${id}/undo`,
  })
}
