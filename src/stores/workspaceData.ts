import { fetchWorkspaces } from '@services/workspace'
import { BackendError, HttpError } from '@utils/errors'
import { Workspace } from '@interfaces/Workspace'
import { defineStore, Pinia } from 'pinia'
import { ref } from 'vue'
import { ErrorsMessage } from '@enums/ErrorsMessage'
import { toast } from 'vue-sonner'
import { useBoardDataStore } from '@stores/boardData'

type WorkspaceErrorType = BackendError | HttpError | null

export const useWorkspaceDataStore = (pinia?: Pinia) => {
  return defineStore('workspaceData', () => {
    const workspaces = ref<Array<Workspace>>([])
    const activeWorkspace = ref<Workspace | null>(null)

    const loadWorkspacesError = ref<WorkspaceErrorType>(null)

    const isWorkspacesLoading = ref<boolean>(false)

    const BOARD_STORE = useBoardDataStore()

    async function loadWorkspaces() {
      loadWorkspacesError.value = null
      isWorkspacesLoading.value = true

      try {
        const workspacesPayload = await fetchWorkspaces()
        workspaces.value = workspacesPayload

        return true
      } catch (e) {
        if (e instanceof BackendError) {
          loadWorkspacesError.value = e
        } else if (e instanceof HttpError) {
          loadWorkspacesError.value = e

          if (e.status === 401) {
          }
        } else {
          loadWorkspacesError.value = new HttpError(ErrorsMessage.UNEXPECTED_ERROR, null)
        }

        toast.error(loadWorkspacesError.value.message)

        return false
      } finally {
        isWorkspacesLoading.value = false
      }
    }

    async function selectWorkspace(
      newWorkspace: Workspace,
      shouldNavigate: boolean = false,
      shouldSelectBoard: boolean = true,
    ) {
      if (activeWorkspace.value === newWorkspace) return

      BOARD_STORE.activeBoard = null
      activeWorkspace.value = newWorkspace

      localStorage.setItem('selectedWorkspace', JSON.stringify(newWorkspace))

      if (
        !BOARD_STORE.areBoardsLoaded(newWorkspace._id) &&
        !BOARD_STORE.isBoardsLoading(newWorkspace._id)
      ) {
        await BOARD_STORE.loadBoards(newWorkspace._id)
      }

      const availableBoards = BOARD_STORE.boards.filter(
        (board) => board.workspace_id === newWorkspace._id,
      )

      if (availableBoards.length > 0 && shouldSelectBoard)
        await BOARD_STORE.selectBoard(availableBoards[0], shouldNavigate)
      else {
        if (shouldNavigate) {
          window.history.pushState({ triggeredBy: 'user' }, '', `/workspace/${newWorkspace._id}`)
        }
      }
    }

    function $reset() {}

    return {
      // State
      activeWorkspace,
      workspaces,
      loadWorkspacesError,

      // Actions
      loadWorkspaces,
      selectWorkspace,

      $reset,
    }
  })(pinia)
}
