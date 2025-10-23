import {
  archiveWorkspace as archiveWorkspaceService,
  cloneWorkspace as cloneWorkspaceService,
  createWorkspace,
  fetchWorkspaces,
  removeWorkspace,
  saveWorkspace,
} from '@services/workspace'
import { BackendError, HttpError } from '@utils/errors'
import { Workspace } from '@interfaces/Workspace'
import { defineStore, Pinia } from 'pinia'
import { computed, ref } from 'vue'
import { ErrorsMessage } from '@enums/ErrorsMessage'
import { toast } from 'vue-sonner'
import { useBoardDataStore } from '@stores/boardData'

type WorkspaceErrorType = BackendError | HttpError | null

/** Methods with _ prefix are private and have no side effects */

export const useWorkspaceDataStore = (pinia?: Pinia) => {
  return defineStore('workspaceData', () => {
    const workspaces = ref<Array<Workspace>>([])
    const activeWorkspace = ref<Workspace | null>(null)

    // Errors
    const loadWorkspacesError = ref<WorkspaceErrorType>(null)
    const _addWorkspaceError = ref<WorkspaceErrorType>(null)
    const _editWorkspacesError = ref<Map<string, WorkspaceErrorType>>(new Map())
    const _deleteWorkspacesError = ref<Map<string, WorkspaceErrorType>>(new Map())
    const _archiveWorkspacesError = ref<Map<string, WorkspaceErrorType>>(new Map())
    const _cloneWorkspacesError = ref<Map<string, WorkspaceErrorType>>(new Map())

    // Loading
    const isWorkspacesLoading = ref<boolean>(false)
    const _isAddingWorkspace = ref<boolean>(false)
    const _editingWorkspaces = ref<Set<string>>(new Set())
    const _deletingWorkspaces = ref<Set<string>>(new Set())
    const _archivingWorkspaces = ref<Set<string>>(new Set())
    const _cloningWorkspaces = ref<Set<string>>(new Set())
    const _addingToFavoritesWorkspaces = ref<Set<string>>(new Set())

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

      await BOARD_STORE.loadBoards(newWorkspace._id)

      const availableBoards = BOARD_STORE.getActiveWorkspaceBoards

      if (availableBoards.length > 0 && shouldSelectBoard)
        await BOARD_STORE.selectBoard(availableBoards[0], shouldNavigate)
      else {
        if (shouldNavigate) {
          window.history.pushState({ triggeredBy: 'user' }, '', `/workspace/${newWorkspace._id}`)
        }
      }
    }

    async function _addWorkspace(workspace: Partial<Workspace>): Promise<Workspace> {
      if (!workspace) throw new Error('Необходимо указать пространство')

      try {
        _isAddingWorkspace.value = true

        const newWorkspaces: Workspace[] = await createWorkspace({ ...workspace })

        workspaces.value.push(...newWorkspaces)

        return newWorkspaces[0]
      } catch (e) {
        if (e instanceof BackendError) {
          _addWorkspaceError.value = e
        } else if (e instanceof HttpError) {
          _addWorkspaceError.value = e

          if (e.status === 401) {
          }
        } else {
          _addWorkspaceError.value = new HttpError(ErrorsMessage.UNEXPECTED_ERROR, null)
        }

        throw e
      } finally {
        _isAddingWorkspace.value = false
      }
    }

    async function addWorkspace(workspace: Partial<Workspace>): Promise<Workspace | false> {
      try {
        const newWorkspace = await _addWorkspace(workspace)

        toast.success('Пространство успешно создано')

        return newWorkspace
      } catch {
        toast.error(_addWorkspaceError.value?.message ?? 'Ошибка при создании пространства')

        return false
      }
    }

    async function _updateWorkspace(
      payload: Partial<Workspace> & { _id: string },
    ): Promise<Workspace> {
      if (!payload) throw new Error('Необходимо указать пространство')

      try {
        _editingWorkspaces.value.add(payload._id)

        const editResult = await saveWorkspace({ ...payload })

        const newWorkspace = editResult.find((w) => w._id === payload._id)

        const workspaceIndex = workspaces.value.findIndex((w) => w._id === payload._id)
        if (workspaceIndex !== -1 && newWorkspace) {
          Object.assign(workspaces.value[workspaceIndex], newWorkspace)
        }

        if (!newWorkspace) throw new Error('Не удалось найти отредактированное пространство')

        return newWorkspace
      } catch (e) {
        if (e instanceof BackendError) {
          _editWorkspacesError.value.set(payload._id, e)
        } else if (e instanceof HttpError) {
          _editWorkspacesError.value.set(payload._id, e)

          if (e.status === 401) {
          }
        } else {
          _editWorkspacesError.value.set(
            payload._id,
            new HttpError(ErrorsMessage.UNEXPECTED_ERROR, null),
          )
        }

        throw e
      } finally {
        _editingWorkspaces.value.delete(payload._id)
      }
    }

    async function updateWorkspace(
      payload: Partial<Workspace> & { _id: string },
    ): Promise<Workspace | false> {
      try {
        const updatedWorkspace = await _updateWorkspace(payload)

        toast.success('Пространство успешно отредактировано')

        return updatedWorkspace
      } catch {
        toast.error(
          _editWorkspacesError.value.get(payload._id)?.message ||
            'Ошибка при редактировании пространства',
        )

        return false
      }
    }

    async function _deleteWorkspace(workspace: Workspace): Promise<void> {
      if (!workspace) throw new Error('Необходимо указать пространство')

      try {
        _deletingWorkspaces.value.add(workspace._id)

        await removeWorkspace(workspace._id)

        const workspaceIndex = workspaces.value.findIndex((w) => w._id === workspace._id)
        if (workspaceIndex !== -1) {
          workspaces.value.splice(workspaceIndex, 1)

          if (activeWorkspace.value?._id === workspace._id) {
            selectWorkspace(workspaces.value[0], true, true)
          }
        }
      } catch (e) {
        if (e instanceof BackendError) {
          _deleteWorkspacesError.value.set(workspace._id, e)
        } else if (e instanceof HttpError) {
          _deleteWorkspacesError.value.set(workspace._id, e)

          if (e.status === 401) {
          }
        } else {
          _deleteWorkspacesError.value.set(
            workspace._id,
            new HttpError(ErrorsMessage.UNEXPECTED_ERROR, null),
          )
        }

        throw e
      } finally {
        _deletingWorkspaces.value.delete(workspace._id)
      }
    }

    async function deleteWorkspace(workspace: Workspace): Promise<boolean> {
      try {
        await _deleteWorkspace(workspace)

        toast.success('Пространство успешно удалено')

        return true
      } catch {
        toast.error(
          _deleteWorkspacesError.value.get(workspace._id)?.message ||
            'Ошибка при удалении пространства',
        )

        return false
      }
    }

    async function _archiveWorkspace(workspace: Workspace): Promise<Workspace> {
      if (!workspace) throw new Error('Необходимо указать пространство')

      try {
        _archivingWorkspaces.value.add(workspace._id)

        const archiveResult = await archiveWorkspaceService(workspace._id)

        const newWorkspace = archiveResult.find((w) => w._id === workspace._id)

        const workspaceIndex = workspaces.value.findIndex((w) => w._id === workspace._id)
        if (workspaceIndex !== -1 && newWorkspace) {
          Object.assign(workspaces.value[workspaceIndex], newWorkspace)

          workspaces.value.splice(workspaceIndex, 1)

          if (activeWorkspace.value?._id === workspace._id) {
            selectWorkspace(workspaces.value[0], true, true)
          }
        }

        if (!newWorkspace) throw new Error('Не удалось найти заархивированное пространство')

        return newWorkspace
      } catch (e) {
        if (e instanceof BackendError) {
          _archiveWorkspacesError.value.set(workspace._id, e)
        } else if (e instanceof HttpError) {
          _archiveWorkspacesError.value.set(workspace._id, e)

          if (e.status === 401) {
          }
        } else {
          _archiveWorkspacesError.value.set(
            workspace._id,
            new HttpError(ErrorsMessage.UNEXPECTED_ERROR, null),
          )
        }

        throw e
      } finally {
        _archivingWorkspaces.value.delete(workspace._id)
      }
    }

    async function archiveWorkspace(workspace: Workspace): Promise<Workspace | false> {
      try {
        const archivedWorkspace = await _archiveWorkspace(workspace)

        toast.success('Пространство успешно архивировано')

        return archivedWorkspace
      } catch {
        toast.error(
          _archiveWorkspacesError.value.get(workspace._id)?.message ||
            'Ошибка при архивировании пространства',
        )

        return false
      }
    }

    async function _cloneWorkspace(workspace: Workspace): Promise<Workspace> {
      if (!workspace) throw new Error('Необходимо указать пространство')

      try {
        _cloningWorkspaces.value.add(workspace._id)

        const newWorkspaces: Workspace[] = await cloneWorkspaceService(workspace._id)

        workspaces.value.push(...newWorkspaces)

        return newWorkspaces[0]
      } catch (e) {
        if (e instanceof BackendError) {
          _cloneWorkspacesError.value.set(workspace._id, e)
        } else if (e instanceof HttpError) {
          _cloneWorkspacesError.value.set(workspace._id, e)

          if (e.status === 401) {
          }
        } else {
          _cloneWorkspacesError.value.set(
            workspace._id,
            new HttpError(ErrorsMessage.UNEXPECTED_ERROR, null),
          )
        }

        throw e
      } finally {
        _cloningWorkspaces.value.delete(workspace._id)
      }
    }

    async function cloneWorkspace(workspace: Workspace): Promise<Workspace | false> {
      try {
        const newWorkspace = await _cloneWorkspace(workspace)

        toast.success('Пространство успешно скопировано')

        return newWorkspace
      } catch {
        toast.error(
          _cloneWorkspacesError.value.get(workspace._id)?.message ||
            'Ошибка при копировании пространства',
        )

        return false
      }
    }

    async function makeFavorite(workspace: Workspace) {
      const newWorkspace = { ...workspace, isFavorite: !workspace.isFavorite }

      try {
        _addingToFavoritesWorkspaces.value.add(workspace._id)

        const result = await _updateWorkspace(newWorkspace)

        toast.success('Пространство успешно добавлено в избранное')

        return result
      } catch {
        toast.error(
          _editWorkspacesError.value.get(workspace._id)?.message ||
            'Ошибка при добавлении пространства в избранное',
        )

        return false
      } finally {
        _addingToFavoritesWorkspaces.value.delete(workspace._id)
      }
    }

    function getFirstLetterOfWorkspace(workspace: Workspace): string {
      return workspace.name.charAt(0).toUpperCase()
    }

    const getActiveWorkspaceId = computed(() => {
      return activeWorkspace.value?._id ?? ''
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
      return _editingWorkspaces.value.has(workspaceId)
    })

    const isWorkspaceDeleting = computed(() => (workspaceId: string): boolean => {
      return _deletingWorkspaces.value.has(workspaceId)
    })

    const isWorkspaceArchiving = computed(() => (workspaceId: string): boolean => {
      return _archivingWorkspaces.value.has(workspaceId)
    })

    const isWorkspaceCloning = computed(() => (workspaceId: string): boolean => {
      return _cloningWorkspaces.value.has(workspaceId)
    })

    const isWorkspaceAddingToFavorites = computed(() => (workspaceId: string): boolean => {
      return _addingToFavoritesWorkspaces.value.has(workspaceId)
    })

    const isWorkspaceProcessing = computed(() => (workspaceId: string): boolean => {
      return (
        _deletingWorkspaces.value.has(workspaceId) ||
        _archivingWorkspaces.value.has(workspaceId) ||
        _cloningWorkspaces.value.has(workspaceId) ||
        _editingWorkspaces.value.has(workspaceId)
      )
    })

    const getFavoriteWorkspaces = computed((): Workspace[] => {
      return workspaces.value.filter((workspace) => workspace.isFavorite && !workspace.is_deleted)
    })

    function getOtherWorkspaces(workspace_id: string): Workspace[] {
      return workspaces.value.filter((workspace) => workspace._id !== workspace_id)
    }

    function $reset() {}

    return {
      // State
      activeWorkspace,
      workspaces,
      loadWorkspacesError,
      getActiveWorkspaceId,
      getFirstLetterOfActiveWorkspace,
      getActiveWorkspaceName,
      getActiveWorkspaceColor,
      isWorkspacesLoading,
      isAddingWorkspace,
      isWorkspaceEditing,
      isWorkspaceDeleting,
      isWorkspaceArchiving,
      isWorkspaceCloning,
      isWorkspaceProcessing,
      isWorkspaceAddingToFavorites,
      getFavoriteWorkspaces,

      // Actions
      loadWorkspaces,
      selectWorkspace,
      addWorkspace,
      getFirstLetterOfWorkspace,
      updateWorkspace,
      deleteWorkspace,
      archiveWorkspace,
      cloneWorkspace,
      getOtherWorkspaces,
      makeFavorite,

      $reset,
    }
  })(pinia)
}
