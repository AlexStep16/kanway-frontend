import type { IResponseWithLog } from '~/interfaces/IResponseWithLog'

export function invalidateUndo(data: IResponseWithLog<any>[]) {
  const { $queryClient } = useNuxtApp()

  $queryClient.invalidateQueries({ queryKey: boardKeys.all })
  $queryClient.invalidateQueries({ queryKey: columnKeys.all })
  $queryClient.invalidateQueries({ queryKey: taskKeys.all })
  $queryClient.invalidateQueries({ queryKey: workspaceKeys.all })
}
