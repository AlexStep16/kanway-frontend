import { useMutation } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'
import { boardKeys, workspaceKeys } from '@/keys'
import { queryClient } from '@/plugins/queryClient'
import { IBoard } from '@/interfaces/domain/IBoard'
import { createBoard } from '@/services/board'
import { useBoardStore } from '@/stores/board'
import { useUndo } from '@/composables/logs/useUndo'

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
      const boardStore = useBoardStore()

      queryClient.invalidateQueries({ queryKey: boardKeys.byWorkspace(workspaceId) })
      queryClient.invalidateQueries({ queryKey: [...boardKeys.count(), workspaceId] })

      queryClient.setQueryData(
        boardKeys.byWorkspace(workspaceId),
        (oldBoards: IBoard[] | undefined) => {
          return oldBoards ? [...oldBoards, ...result.data] : result.data
        },
      )

      if (result.data) {
        boardStore.selectBoard(result.data[0], true)
      }

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
