import { IOperationLog } from '@/interfaces/domain/IOperationLog'
import { IUndoResponse } from '@/interfaces/IUndoResponse'
import { getLogApi, patchUndoApi } from '@api/log'

export async function fetchLog(id: string): Promise<IOperationLog | null> {
  const logs = await getLogApi(id)
  const log = logs.length > 0 ? logs[0] : null

  return log
}

export async function undoOperation(id: string): Promise<IUndoResponse> {
  return await patchUndoApi(id)
}
