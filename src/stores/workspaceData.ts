import { createWorkspace, fetchWorkspaces, saveWorkspace } from '@services/workspace'
import { BackendError, HttpError } from '@utils/errors'
import { Workspace } from '@interfaces/Workspace'
import { defineStore, Pinia } from 'pinia'
import { computed, ref } from 'vue'
import { ErrorsMessage } from '@enums/ErrorsMessage'
import { toast } from 'vue-sonner'
import { useBoardDataStore } from '@stores/boardData'

type WorkspaceErrorType = BackendError | HttpError | null

export const useWorkspaceDataStore = (pinia?: Pinia) => {
  return defineStore('workspaceData', () => {
    const workspaces = ref<Array<Workspace>>([])
    const activeWorkspace = ref<Workspace | null>(null)

    // Errors
    const loadWorkspacesError = ref<WorkspaceErrorType>(null)
    const addWorkspaceError = ref<WorkspaceErrorType>(null)
    const editWorkspacesError = ref<Map<string, WorkspaceErrorType>>(new Map())

    // Loading
    const isWorkspacesLoading = ref<boolean>(false)
    const _isAddingWorkspace = ref<boolean>(false)
    const editingWorkspaces = ref<Set<string>>(new Set())

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

    async function addWorkspace(workspace: Partial<Workspace>): Promise<Workspace | false> {
      if (!workspace) return false

      try {
        _isAddingWorkspace.value = true

        const newWorkspace = await createWorkspace({ ...workspace })

        workspaces.value.push(...newWorkspace)

        toast.success('Пространство успешно создано')

        return newWorkspace[0]
      } catch (e) {
        if (e instanceof BackendError) {
          addWorkspaceError.value = e
        } else if (e instanceof HttpError) {
          addWorkspaceError.value = e

          if (e.status === 401) {
          }
        } else {
          addWorkspaceError.value = new HttpError(ErrorsMessage.UNEXPECTED_ERROR, null)
        }

        toast.error(addWorkspaceError.value.message)

        return false
      } finally {
        _isAddingWorkspace.value = false
      }
    }

    async function updateWorkspace(workspace: Workspace): Promise<Workspace | false> {
      if (!workspace) return false

      try {
        editingWorkspaces.value.add(workspace._id)

        const editResult = await saveWorkspace({ ...workspace })

        const newWorkspace = editResult.find((w) => w._id === workspace._id)

        const workspaceIndex = workspaces.value.findIndex((w) => w._id === workspace._id)
        if (workspaceIndex !== -1 && newWorkspace) {
          Object.assign(workspaces.value[workspaceIndex], newWorkspace)
        }

        toast.success('Пространство успешно отредактировано')

        return newWorkspace ?? false
      } catch (e) {
        if (e instanceof BackendError) {
          editWorkspacesError.value.set(workspace._id, e)
        } else if (e instanceof HttpError) {
          editWorkspacesError.value.set(workspace._id, e)

          if (e.status === 401) {
          }
        } else {
          editWorkspacesError.value.set(
            workspace._id,
            new HttpError(ErrorsMessage.UNEXPECTED_ERROR, null),
          )
        }

        toast.error(
          editWorkspacesError.value.get(workspace._id)?.message ||
            'Ошибка при редактировании пространства',
        )

        return false
      } finally {
        editingWorkspaces.value.delete(workspace._id)
      }
    }

    function getFirstLetterOfWorkspace(workspace: Workspace): string {
      return workspace.name.charAt(0).toUpperCase()
    }

    const getActiveWorkspaceId = computed(() => {
      return activeWorkspace.value?._id ?? null
    })

    const getFirstLetterOfActiveWorkspace = computed(() => {
      return activeWorkspace.value ? activeWorkspace.value.name.charAt(0).toUpperCase() : ''
    })

    const getActiveWorkspaceName = computed(() => {
      return activeWorkspace.value ? activeWorkspace.value.name : ''
    })

    const getActiveWorkspaceColor = computed(() => {
      return activeWorkspace.value ? activeWorkspace.value.color : ''
    })

    const isAddingWorkspace = computed(() => {
      return _isAddingWorkspace.value
    })

    const isWorkspaceEditing = computed(() => (workspaceId: string): boolean => {
      return editingWorkspaces.value.has(workspaceId)
    })

    function $reset() {}

    return {
      // State
      activeWorkspace,
      workspaces,
      loadWorkspacesError,
      editWorkspacesError,
      getActiveWorkspaceId,
      getFirstLetterOfActiveWorkspace,
      getActiveWorkspaceName,
      getActiveWorkspaceColor,
      isWorkspacesLoading,
      _isAddingWorkspace,
      isAddingWorkspace,
      isWorkspaceEditing,

      // Actions
      loadWorkspaces,
      selectWorkspace,
      addWorkspace,
      getFirstLetterOfWorkspace,
      updateWorkspace,

      $reset,
    }
  })(pinia)
}
