import { apiCall } from '@/apiClient'
import { IUndoResponse } from '@interfaces/IUndoResponse'
import { IResponseWithLog } from '@interfaces/IResponseWithLog'
import { IWorkspacesWithChildrenResponse } from '@interfaces/IWorkspacesWithChildrenResponse'

export async function patchUndoApi(id: string) {
  return await apiCall<IResponseWithLog<IUndoResponse<IWorkspacesWithChildrenResponse>>>({
    method: 'PATCH',
    url: `/operation-logs/${id}/undo`,
  })
}
