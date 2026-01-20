import { useMutation } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'
import { boardKeys, workspaceKeys } from '@/keys'
import { queryClient } from '@/plugins/queryClient'
import { patchCounter } from '@/utils/queries/patchCounter'
import { IBoard } from '@/interfaces/domain/IBoard'
import { createBoard } from '@/services/board'
import { useBoardStore } from '@/stores/board'
import { useUndo } from '@/composables/useUndo'

interface CreateBoardVars {
  payload: Partial<IBoard>
  workspaceId: string | null
}

export function useCreateBoard() {
  const { mutate: undo } = useUndo()

  return useMutation({
    mutationKey: [...boardKeys.all, 'create'],
    mutationFn: async ({ payload, workspaceId }: CreateBoardVars) => {
      if (!workspaceId) {
        throw new Error('Не выбрано пространство')
      }

      return createBoard(payload, workspaceId)
    },

    onSuccess: (result, { workspaceId }) => {
      const BOARD_STORE = useBoardStore()
      const boards = queryClient.getQueryData<IBoard[]>(boardKeys.byWorkspace(workspaceId))
      const nextBoard = boards && boards.length > 0 ? boards[0] : null

      if (nextBoard) BOARD_STORE.selectBoard(nextBoard, true)

      patchCounter(queryClient, workspaceKeys.all, workspaceId!, 'boardsCount', 1)

      toast.success('Доска успешно создана', {
        action: {
          label: 'Отменить',
          onClick: () => {
            if (result.logId) undo(result.logId)
          },
        },
      })
    },
  })
}
