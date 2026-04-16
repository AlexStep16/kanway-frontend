import { defineStore } from 'pinia'
import { useWorkspaceStore } from '@stores/workspace'
import { useBoardStore } from '@stores/board'
import WorkspaceModel from '@/models/WorkspaceModel'
import { useData } from 'vike-vue/useData'
import { Nullable } from '@/types/utils'
import { useWorkspaces } from '@/composables/workspaces/queries/useWorkspaces'
import { fetchBoards } from '@/services/board'
import { queryClient } from '@/plugins/queryClient'
import { boardKeys } from '@/keys'
import { computed } from 'vue'
import { useUIStore } from './ui'

export const useRootStore = defineStore('root', () => {
  const workspaceStore = useWorkspaceStore()
  const boardStore = useBoardStore()
  const uiStore = useUIStore()

  async function updateWorkspaceFromRoute() {
    let selectedWorkspace: Nullable<WorkspaceModel> = null
    let shouldNavigateToBoard = false

    const params = useData<{ boardId: string; workspaceId: string }>()
    const workspaceId = params.workspaceId
    const boardId = params.boardId

    const { data: workspacesData } = useWorkspaces()

    const workspaces = computed(() => workspacesData.value || [])

    if (typeof workspaceId === 'string' && workspaceId) {
      selectedWorkspace =
        workspaces.value.find((workspace: WorkspaceModel) => workspace.id === workspaceId) ?? null
    }

    if (!selectedWorkspace && workspaces.value.length > 0) {
      selectedWorkspace = workspaces.value[0] ?? null
    }

    if (selectedWorkspace) {
      await workspaceStore.selectWorkspace(selectedWorkspace, false, false)
    } else {
      return
    }

    let selectedBoard: any = null

    const boards = await queryClient.fetchQuery({
      queryKey: boardKeys.lists(),
      queryFn: () => fetchBoards(selectedWorkspace.id),
    })

    const workspaceBoards = selectedWorkspace
      ? boards.filter((board) => board.workspace.id === selectedWorkspace.id)
      : []

    if (typeof boardId === 'string' && boardId) {
      selectedBoard = workspaceBoards.find((board: any) => board.id === boardId)
    }

    if (!selectedBoard && workspaceBoards.length > 0) {
      selectedBoard = workspaceBoards[0]
      shouldNavigateToBoard = true
    }

    if (selectedBoard) {
      await boardStore.selectBoard(selectedBoard, shouldNavigateToBoard)
    } else {
      boardStore.resetBoardSelection()
      uiStore.selectChat()

      setTimeout(() => {
        if (selectedWorkspace) {
          document.title = 'Kanway | ' + selectedWorkspace.name
        }
      })
    }
  }

  return {
    // Actions
    updateWorkspaceFromRoute,
  }
})
