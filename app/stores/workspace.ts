import WorkspaceModel from '~/models/WorkspaceModel'
import { ref } from 'vue'
import { useBoardStore } from './board'
import { fetchBoards } from '~/services/board'

export const useWorkspaceStore = defineStore('workspace', () => {
  const activeWorkspaceId = ref<string | null>(null)

  const boardStore = useBoardStore()

  async function selectWorkspace(
    newWorkspace: WorkspaceModel,
    shouldNavigate: boolean = false,
    shouldSelectBoard: boolean = true,
  ) {
    if (activeWorkspaceId.value === newWorkspace.id) return

    const { $queryClient } = useNuxtApp()

    boardStore.activeBoardId = null
    activeWorkspaceId.value = newWorkspace.id

    localStorage.setItem('activeWorkspaceId', newWorkspace.id)

    const boards = await $queryClient.fetchQuery({
      queryKey: boardKeys.byWorkspace(newWorkspace.id),
      queryFn: () => fetchBoards(newWorkspace.id),
      staleTime: 1000 * 60 * 5,
    })

    if (shouldSelectBoard && boards && boards.length > 0) {
      await boardStore.selectBoard(boards[0]!, shouldNavigate)
    } else {
      if (shouldNavigate) {
        await navigateTo(`/workspace/${newWorkspace.id}`)
      }
    }
  }

  return {
    activeWorkspaceId,

    selectWorkspace,
  }
})
