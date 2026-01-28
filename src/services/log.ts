import { IUndoResponse } from '@/interfaces/IUndoResponse'
import { patchUndoApi } from '@api/log'

export async function undoOperation(id: string): Promise<IUndoResponse> {
  return await patchUndoApi(id)
}
