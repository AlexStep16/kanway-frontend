import { IUndoResponse } from '@interfaces/IUndoResponse'
import { patchUndoApi } from '@api/log'
import { IWorkspacesWithChildrenResponse } from '@interfaces/IWorkspacesWithChildrenResponse'

export async function undoOperation(
  id: string,
): Promise<IUndoResponse<IWorkspacesWithChildrenResponse>> {
  const response = await patchUndoApi(id)

  return response[0]
}
