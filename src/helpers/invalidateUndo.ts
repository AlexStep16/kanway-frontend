import { IResponseWithLog } from '@/interfaces/IResponseWithLog'
import { boardKeys, categoryKeys, taskKeys, workspaceKeys } from '@/keys'
import { queryClient } from '@/plugins/queryClient'

export function invalidateUndo(data: IResponseWithLog<any>[]) {
  queryClient.invalidateQueries({ queryKey: boardKeys.all })
  queryClient.invalidateQueries({ queryKey: categoryKeys.all })
  queryClient.invalidateQueries({ queryKey: taskKeys.all })
  queryClient.invalidateQueries({ queryKey: workspaceKeys.all })
}
