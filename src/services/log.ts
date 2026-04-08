import { IOperationLog } from '@/interfaces/domain/IOperationLog'
import { IResponseWithLog } from '@/interfaces/IResponseWithLog'
import { getLogApi, patchUndoApi } from '@api/log'

export async function fetchLog(id: string): Promise<IOperationLog | null> {
  const logs = await getLogApi(id)
  const log = logs.length > 0 ? logs[0] : null

  return log
}

export async function undoOperation(id: string): Promise<IResponseWithLog<any>[]> {
  return await patchUndoApi(id)
}
