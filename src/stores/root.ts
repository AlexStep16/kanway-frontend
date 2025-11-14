import { defineStore } from 'pinia'
import { useWorkspaceDataStore } from './workspaceData'
import WorkspaceModel from '@/models/WorkspaceModel'
import { useBoardDataStore } from '@stores/boardData'
import { useData } from 'vike-vue/useData'
import { Nullable } from '@/types/utils'

export const useRootStore = defineStore('root', () => {
  const WORKSPACE_STORE = useWorkspaceDataStore()
  const BOARD_STORE = useBoardDataStore()

  async function updateWorkspaceFromRoute() {
    let selectedWorkspace: Nullable<WorkspaceModel> = null

    const params = useData<{ boardId: string; workspaceId: string }>()
    const workspaceId = params.workspaceId
    const boardId = params.boardId

    if (typeof workspaceId === 'string' && workspaceId) {
      selectedWorkspace =
        WORKSPACE_STORE.workspaces.find(
          (workspace: WorkspaceModel) => workspace.id === workspaceId,
        ) ?? null
    }

    if (!selectedWorkspace && WORKSPACE_STORE.workspaces.length > 0) {
      selectedWorkspace = WORKSPACE_STORE.workspaces[0] ?? null
    }

    if (selectedWorkspace) {
      await BOARD_STORE.loadBoards(selectedWorkspace.id)

      //await CHAT_STORE.getChats(selectedWorkspace.id)

      await WORKSPACE_STORE.selectWorkspace(selectedWorkspace, false, false)
    } else {
      return
    }

    let selectedBoard: any = null
    const workspaceBoards = selectedWorkspace
      ? BOARD_STORE.boards.filter((board) => board.workspaceId === selectedWorkspace.id)
      : []

    if (typeof boardId === 'string' && !['archive', 'settings'].includes(boardId)) {
      selectedBoard = workspaceBoards.find((board: any) => board.id === boardId)
    }

    if (!selectedBoard && workspaceBoards.length > 0) {
      selectedBoard = workspaceBoards[0]
    }

    /*if (typeof boardId === 'string' && ['settings', 'archive'].includes(boardId)) {
      if (boardId === 'settings') {
        await SIDEBAR_STORE.selectSettings()
      } else if (boardId === 'archive') {
        SIDEBAR_STORE.selectArchive()
      }

      return
    }*/
    if (selectedBoard) {
      await BOARD_STORE.selectBoard(selectedBoard)
    } else {
      BOARD_STORE.activeBoard = null

      setTimeout(() => {
        if (selectedWorkspace) {
          document.title = 'Kanbar | ' + selectedWorkspace.name
        }
      })
    }
  }

  function $reset() {}

  return {
    // Actions
    updateWorkspaceFromRoute,
    $reset,
  }
})
