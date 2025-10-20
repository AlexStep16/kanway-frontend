import dayjs from 'dayjs'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useWorkspaceDataStore } from './workspaceData'
import { Workspace } from '@interfaces/Workspace'
import { useBoardDataStore } from '@stores/boardData'

export const useRootStore = defineStore('root', () => {
  const timezone = ref(dayjs.tz.guess())
  const WORKSPACE_STORE = useWorkspaceDataStore()
  const BOARD_STORE = useBoardDataStore()

  async function updateTabsFromRoute(params: any) {
    let selectedWorkspace: Workspace | null = null
    const workspaceId = params.workspaceId
    const boardId = params.boardId

    if (typeof workspaceId === 'string' && workspaceId) {
      selectedWorkspace =
        WORKSPACE_STORE.workspaces.find((workspace: Workspace) => workspace._id === workspaceId) ??
        null
    }

    if (!selectedWorkspace && WORKSPACE_STORE.workspaces.length > 0) {
      selectedWorkspace = WORKSPACE_STORE.workspaces[0] ?? null
    }

    if (selectedWorkspace) {
      await BOARD_STORE.loadBoards(selectedWorkspace._id)

      //await CHAT_STORE.getChats(selectedWorkspace._id)

      await WORKSPACE_STORE.selectWorkspace(selectedWorkspace, false, false)
    } else {
      return
    }

    let selectedBoard: any = null
    const workspaceBoards = selectedWorkspace
      ? BOARD_STORE.boards.filter((board) => board.workspace_id === selectedWorkspace._id)
      : []

    if (typeof boardId === 'string' && !['archive', 'settings'].includes(boardId)) {
      selectedBoard = workspaceBoards.find((board: any) => board._id === boardId)
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
    // State
    timezone,

    // Actions
    updateTabsFromRoute,
    $reset,
  }
})
