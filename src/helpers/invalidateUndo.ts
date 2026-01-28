import { IUndoResponse } from '@/interfaces/IUndoResponse'
import { boardKeys, categoryKeys, taskKeys, workspaceKeys } from '@/keys'
import { queryClient } from '@/plugins/queryClient'

export function invalidateUndo(data: IUndoResponse) {
  queryClient.invalidateQueries({ queryKey: workspaceKeys.all })

  if (data.affectedBoardIds?.length) {
    queryClient.invalidateQueries({ queryKey: boardKeys.all })
  }

  if (data.affectedCategoryIds?.length) {
    queryClient.invalidateQueries({ queryKey: categoryKeys.all })
    queryClient.invalidateQueries({ queryKey: boardKeys.all })
  }

  if (data.affectedTaskIds?.length) {
    queryClient.invalidateQueries({ queryKey: taskKeys.all })
    queryClient.invalidateQueries({ queryKey: categoryKeys.all })
    queryClient.invalidateQueries({ queryKey: boardKeys.all })
  }
}
