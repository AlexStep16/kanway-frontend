import { defineStore } from 'pinia'
import { useWorkspaceStore } from '@stores/workspace'
import { useBoardStore } from '@stores/board'
import WorkspaceModel from '@/models/WorkspaceModel'
import { useData } from 'vike-vue/useData'
import { Nullable } from '@/types/utils'
import { useBoards } from '@/composables/boards/queries/useBoards'
import { useWorkspaces } from '@/composables/workspaces/queries/useWorkspaces'

export const useRootStore = defineStore('root', () => {
  const WORKSPACE_STORE = useWorkspaceStore()
  const BOARD_STORE = useBoardStore()

  async function updateWorkspaceFromRoute() {
    let selectedWorkspace: Nullable<WorkspaceModel> = null

    const params = useData<{ boardId: string; workspaceId: string }>()
    const workspaceId = params.workspaceId
    const boardId = params.boardId

    const { data: workspaces } = useWorkspaces()

    if (typeof workspaceId === 'string' && workspaceId) {
      selectedWorkspace =
        workspaces.value.find((workspace: WorkspaceModel) => workspace.id === workspaceId) ?? null
    }

    if (!selectedWorkspace && workspaces.value.length > 0) {
      selectedWorkspace = workspaces.value[0] ?? null
    }

    if (selectedWorkspace) {
      await WORKSPACE_STORE.selectWorkspace(selectedWorkspace, false, false)
    } else {
      return
    }

    let selectedBoard: any = null

    const { data: boards } = useBoards(selectedWorkspace.id)

    const workspaceBoards = selectedWorkspace
      ? boards.value.filter((board) => board.workspace.id === selectedWorkspace.id)
      : []

    if (typeof boardId === 'string' && !['archive', 'settings'].includes(boardId)) {
      selectedBoard = workspaceBoards.find((board: any) => board.id === boardId)
    }

    if (!selectedBoard && workspaceBoards.length > 0) {
      selectedBoard = workspaceBoards[0]
    }

    if (selectedBoard) {
      await BOARD_STORE.selectBoard(selectedBoard)
    } else {
      BOARD_STORE.resetBoardSelection()

      setTimeout(() => {
        if (selectedWorkspace) {
          document.title = 'Kanbar | ' + selectedWorkspace.name
        }
      })
    }
  }

  return {
    // Actions
    updateWorkspaceFromRoute,
  }
})
