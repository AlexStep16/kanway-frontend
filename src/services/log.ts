import { IUndoResponse } from '@interfaces/IUndoResponse'
import { patchUndoApi } from '@api/log'
import { IResponseWithLog } from '@interfaces/IResponseWithLog'
import { IWorkspacesWithChildrenResponse } from '@interfaces/IWorkspacesWithChildrenResponse'

export async function undoOperation(
  id: string,
): Promise<IResponseWithLog<IUndoResponse<IWorkspacesWithChildrenResponse>>> {
  const response = await patchUndoApi(id)

  return response
}
