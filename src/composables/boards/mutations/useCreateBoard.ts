import { useMutation } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'
import { boardKeys } from '@/keys'
import { queryClient } from '@/plugins/queryClient'
import { IBoard } from '@/interfaces/domain/IBoard'
import { createBoard } from '@/services/board'
import { useBoardStore } from '@/stores/board'
import { useUndo } from '@/composables/log/useUndo'
import { IBoardCreateApiPayload } from '@/interfaces/IBoardCreateApiPayload'

interface CreateBoardVars {
  payload: IBoardCreateApiPayload
}

export function useCreateBoard() {
  const { mutate: undo } = useUndo()

  return useMutation({
    mutationKey: [...boardKeys.all, 'create'],
    mutationFn: async ({ payload }: CreateBoardVars) => createBoard(payload),

    onSuccess: (result, { payload }) => {
      const boardStore = useBoardStore()

      queryClient.invalidateQueries({ queryKey: boardKeys.byWorkspace(payload.workspaceId) })
      queryClient.invalidateQueries({ queryKey: [...boardKeys.count(), payload.workspaceId] })

      queryClient.setQueryData(
        boardKeys.byWorkspace(payload.workspaceId),
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
