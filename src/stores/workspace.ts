import WorkspaceModel from '@models/WorkspaceModel'
import { defineStore, Pinia } from 'pinia'
import { ref } from 'vue'
import { Nullable } from '@/types/utils'
import { useBoardStore } from './board'
import { queryClient } from '@/plugins/queryClient'
import { boardKeys } from '@/keys'
import { fetchBoards } from '@/services/board'
import { navigate } from 'vike/client/router'

export const useWorkspaceStore = (pinia?: Pinia) => {
  return defineStore('workspace', () => {
    const activeWorkspaceId = ref<Nullable<string>>(null)

    const boardStore = useBoardStore()

    async function selectWorkspace(
      newWorkspace: WorkspaceModel,
      shouldNavigate: boolean = false,
      shouldSelectBoard: boolean = true,
    ) {
      if (activeWorkspaceId.value === newWorkspace.id) return

      boardStore.activeBoardId = null
      activeWorkspaceId.value = newWorkspace.id

      localStorage.setItem('activeWorkspaceId', newWorkspace.id)

      const boards = await queryClient.fetchQuery({
        queryKey: boardKeys.byWorkspace(newWorkspace.id),
        queryFn: () => fetchBoards(newWorkspace.id),
        staleTime: 1000 * 60 * 5,
      })

      if (shouldSelectBoard && boards && boards.length > 0) {
        await boardStore.selectBoard(boards[0], shouldNavigate)
      } else {
        if (shouldNavigate) {
          navigate(`/workspace/${newWorkspace.id}`)
        }
      }
    }

    return {
      activeWorkspaceId,

      selectWorkspace,
    }
  })(pinia)
}
