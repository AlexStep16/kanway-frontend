import WorkspaceModel from '@models/WorkspaceModel'
import { defineStore, Pinia } from 'pinia'
import { ref } from 'vue'
import { Nullable } from '@/types/utils'
import { useBoardStore } from './board'
import { queryClient } from '@/plugins/queryClient'
import { boardKeys } from '@/keys'
import { fetchBoards } from '@/services/board'

export const useWorkspaceStore = (pinia?: Pinia) => {
  return defineStore('workspace', () => {
    const activeWorkspaceId = ref<Nullable<string>>(null)

    const BOARD_STORE = useBoardStore()

    async function selectWorkspace(
      newWorkspace: WorkspaceModel,
      shouldNavigate: boolean = false,
      shouldSelectBoard: boolean = true,
    ) {
      if (activeWorkspaceId.value === newWorkspace.id) return

      BOARD_STORE.activeBoardId = null
      activeWorkspaceId.value = newWorkspace.id

      localStorage.setItem('activeWorkspaceId', newWorkspace.id)

      const boards = await queryClient.fetchQuery({
        queryKey: boardKeys.byWorkspace(newWorkspace.id),
        queryFn: () => fetchBoards(newWorkspace.id),
        staleTime: 1000 * 60 * 5,
      })

      if (shouldSelectBoard && boards && boards.length > 0) {
        await BOARD_STORE.selectBoard(boards[0], shouldNavigate)
      } else {
        if (shouldNavigate) {
          window.history.pushState({ triggeredBy: 'user' }, '', `/workspace/${newWorkspace.id}`)
        }
      }
    }

    return {
      activeWorkspaceId,

      selectWorkspace,
    }
  })(pinia)
}
