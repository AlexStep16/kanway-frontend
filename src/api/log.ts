import { apiCall } from '@/apiClient'
import { IUndoResponse } from '@/interfaces/IUndoResponse'

export async function patchUndoApi(id: string) {
  return await apiCall<IUndoResponse>({
    method: 'PATCH',
    url: `/operation-logs/${id}/undo`,
  })
}
