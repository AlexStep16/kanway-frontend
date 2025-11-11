import {
  archiveWorkspace as archiveWorkspaceService,
  cloneWorkspace as cloneWorkspaceService,
  createWorkspace,
  fetchWorkspaces,
  removeWorkspace,
  saveWorkspace,
} from '@services/workspace'
import { BackendError, HttpError } from '@utils/errors'
import WorkspaceModel from '@models/WorkspaceModel'
import { defineStore, Pinia } from 'pinia'
import { computed, ref } from 'vue'
import { ErrorsMessage } from '@enums/ErrorsMessage'
import { toast } from 'vue-sonner'
import { useBoardDataStore } from '@stores/boardData'
import { Nullable } from '@/types/utils'
import _ from 'lodash'
import { ISingleUpdate } from '@/interfaces/domain/ISingleUpdate'

type WorkspaceErrorType = Nullable<BackendError | HttpError>

/** Methods with _ prefix are private and have no side effects */

export const useWorkspaceDataStore = (pinia?: Pinia) => {
  return defineStore('workspaceData', () => {
    const workspaces = ref<Array<WorkspaceModel>>([])
    const activeWorkspace = ref<Nullable<WorkspaceModel>>(null)

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
      newWorkspace: WorkspaceModel,
      shouldNavigate: boolean = false,
      shouldSelectBoard: boolean = true,
    ) {
      if (activeWorkspace.value === newWorkspace) return

      BOARD_STORE.activeBoard = null
      activeWorkspace.value = newWorkspace

      localStorage.setItem('selectedWorkspace', JSON.stringify(newWorkspace))

      await BOARD_STORE.loadBoards(newWorkspace.id)

      const availableBoards = BOARD_STORE.getActiveWorkspaceBoards

      if (availableBoards.length > 0 && shouldSelectBoard)
        await BOARD_STORE.selectBoard(availableBoards[0], shouldNavigate)
      else {
        if (shouldNavigate) {
          window.history.pushState({ triggeredBy: 'user' }, '', `/workspace/${newWorkspace.id}`)
        }
      }
    }

    async function _addWorkspace(
      workspace: Partial<WorkspaceModel>,
    ): Promise<WorkspaceModel | false> {
      if (!workspace) return false
      if (isAddingWorkspace.value) throw new Error('Пространство уже добавляется')

      _addWorkspaceError.value = null

      try {
        _isAddingWorkspace.value = true

        const newWorkspaces: WorkspaceModel[] = await createWorkspace({ ...workspace })

        if (!newWorkspaces[0]) return false

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

    async function addWorkspace(
      workspace: Partial<WorkspaceModel>,
    ): Promise<WorkspaceModel | false> {
      try {
        const newWorkspace = await _addWorkspace(workspace)

        if (newWorkspace) _updateWorkspacesInStore([newWorkspace])

        toast.success('Пространство успешно создано')

        return newWorkspace
      } catch {
        toast.error(_addWorkspaceError.value?.message ?? 'Ошибка при создании пространства')

        return false
      }
    }

    function _updateWorkspacesInStore(newWorkspaces: ISingleUpdate<WorkspaceModel>[]) {
      for (const newWorkspace of newWorkspaces) {
        const workspace = workspaces.value.find((w) => w.id === newWorkspace.id)

        if (workspace) {
          Object.assign(workspace, newWorkspace)
        } else {
          workspaces.value.push(newWorkspace as WorkspaceModel)
        }
      }
    }

    async function _updateWorkspace(
      payload: Partial<WorkspaceModel> & { id: string },
    ): Promise<WorkspaceModel> {
      if (!payload) throw new Error('Необходимо указать пространство')

      _editWorkspacesError.value.delete(payload.id)

      try {
        _editingWorkspaces.value.add(payload.id)

        const editResult = await saveWorkspace({ ...payload })

        const newWorkspace = editResult.find((w) => w.id === payload.id)

        if (!newWorkspace) throw new Error('Не удалось найти отредактированное пространство')

        return newWorkspace
      } catch (e) {
        if (e instanceof BackendError) {
          _editWorkspacesError.value.set(payload.id, e)
        } else if (e instanceof HttpError) {
          _editWorkspacesError.value.set(payload.id, e)

          if (e.status === 401) {
          }
        } else {
          _editWorkspacesError.value.set(
            payload.id,
            new HttpError(ErrorsMessage.UNEXPECTED_ERROR, null),
          )
        }

        throw e
      } finally {
        _editingWorkspaces.value.delete(payload.id)
      }
    }

    async function updateWorkspace(
      payload: ISingleUpdate<Partial<WorkspaceModel>>,
      isOptimisticUpdate: boolean = false,
    ): Promise<WorkspaceModel | false> {
      if (!isWorkspaceChanged(payload)) return false
      const savedWorkspace = _.cloneDeep(workspaces.value.find((w) => w.id === payload.id))

      try {
        if (isOptimisticUpdate && savedWorkspace) {
          _updateWorkspacesInStore([payload])
        }

        const updatedWorkspace = await _updateWorkspace(payload)

        if (!isOptimisticUpdate) _updateWorkspacesInStore([updatedWorkspace])

        return updatedWorkspace
      } catch {
        if (isOptimisticUpdate && savedWorkspace) {
          _updateWorkspacesInStore([savedWorkspace])
        }

        toast.error(
          _editWorkspacesError.value.get(payload.id)?.message ||
            'Ошибка при редактировании пространства',
        )

        return false
      }
    }

    async function _deleteWorkspace(workspace: WorkspaceModel): Promise<void> {
      if (!workspace) throw new Error('Необходимо указать пространство')

      _deleteWorkspacesError.value.delete(workspace.id)

      try {
        _deletingWorkspaces.value.add(workspace.id)

        await removeWorkspace(workspace.id)

        const workspaceIndex = workspaces.value.findIndex((w) => w.id === workspace.id)
        if (workspaceIndex !== -1) {
          workspaces.value.splice(workspaceIndex, 1)

          if (activeWorkspace.value?.id === workspace.id) {
            selectWorkspace(workspaces.value[0], true, true)
          }
        }
      } catch (e) {
        if (e instanceof BackendError) {
          _deleteWorkspacesError.value.set(workspace.id, e)
        } else if (e instanceof HttpError) {
          _deleteWorkspacesError.value.set(workspace.id, e)

          if (e.status === 401) {
          }
        } else {
          _deleteWorkspacesError.value.set(
            workspace.id,
            new HttpError(ErrorsMessage.UNEXPECTED_ERROR, null),
          )
        }

        throw e
      } finally {
        _deletingWorkspaces.value.delete(workspace.id)
      }
    }

    async function deleteWorkspace(workspace: WorkspaceModel): Promise<boolean> {
      try {
        await _deleteWorkspace(workspace)

        toast.success('Пространство успешно удалено')

        return true
      } catch {
        toast.error(
          _deleteWorkspacesError.value.get(workspace.id)?.message ||
            'Ошибка при удалении пространства',
        )

        return false
      }
    }

    async function _archiveWorkspace(workspace: WorkspaceModel): Promise<WorkspaceModel[]> {
      if (!workspace) throw new Error('Необходимо указать пространство')

      _archiveWorkspacesError.value.delete(workspace.id)

      try {
        _archivingWorkspaces.value.add(workspace.id)

        const archiveResult = await archiveWorkspaceService(workspace.id)
        const archivedWorkspace = archiveResult.find((w) => w.id === workspace.id)

        if (!archivedWorkspace) throw new Error('Сервер не вернул архивированное пространство')

        return archiveResult
      } catch (e) {
        if (e instanceof BackendError) {
          _archiveWorkspacesError.value.set(workspace.id, e)
        } else if (e instanceof HttpError) {
          _archiveWorkspacesError.value.set(workspace.id, e)

          if (e.status === 401) {
          }
        } else {
          _archiveWorkspacesError.value.set(
            workspace.id,
            new HttpError(ErrorsMessage.UNEXPECTED_ERROR, null),
          )
        }

        throw e
      } finally {
        _archivingWorkspaces.value.delete(workspace.id)
      }
    }

    async function archiveWorkspace(workspace: WorkspaceModel): Promise<WorkspaceModel | false> {
      try {
        const archiveResult = await _archiveWorkspace(workspace)

        _updateWorkspacesInStore(archiveResult)

        toast.success('Пространство успешно архивировано')

        const archivedWorkspace = archiveResult.find((w) => w.id === workspace.id) as WorkspaceModel

        return archivedWorkspace
      } catch {
        toast.error(
          _archiveWorkspacesError.value.get(workspace.id)?.message ||
            'Ошибка при архивировании пространства',
        )

        return false
      }
    }

    async function _cloneWorkspace(workspace: WorkspaceModel): Promise<WorkspaceModel> {
      if (!workspace) throw new Error('Необходимо указать пространство')

      _cloneWorkspacesError.value.delete(workspace.id)

      try {
        _cloningWorkspaces.value.add(workspace.id)

        const newWorkspaces = await cloneWorkspaceService(workspace.id)

        if (!newWorkspaces[0]) throw new Error('Сервер не вернул новое пространство')

        return newWorkspaces[0]
      } catch (e) {
        if (e instanceof BackendError) {
          _cloneWorkspacesError.value.set(workspace.id, e)
        } else if (e instanceof HttpError) {
          _cloneWorkspacesError.value.set(workspace.id, e)

          if (e.status === 401) {
          }
        } else {
          _cloneWorkspacesError.value.set(
            workspace.id,
            new HttpError(ErrorsMessage.UNEXPECTED_ERROR, null),
          )
        }

        throw e
      } finally {
        _cloningWorkspaces.value.delete(workspace.id)
      }
    }

    async function cloneWorkspace(workspace: WorkspaceModel): Promise<WorkspaceModel | false> {
      try {
        const newWorkspace = await _cloneWorkspace(workspace)

        _updateWorkspacesInStore([newWorkspace])

        toast.success('Пространство успешно скопировано')

        return newWorkspace
      } catch {
        toast.error(
          _cloneWorkspacesError.value.get(workspace.id)?.message ||
            'Ошибка при копировании пространства',
        )

        return false
      }
    }

    async function makeFavorite(workspace: WorkspaceModel) {
      const newWorkspace = { ...workspace, isFavorite: !workspace.isFavorite }

      try {
        _addingToFavoritesWorkspaces.value.add(workspace.id)

        const result = await _updateWorkspace(newWorkspace)

        _updateWorkspacesInStore([result])

        toast.success('Пространство успешно добавлено в избранное')

        return result
      } catch {
        toast.error(
          _editWorkspacesError.value.get(workspace.id)?.message ||
            'Ошибка при добавлении пространства в избранное',
        )

        return false
      } finally {
        _addingToFavoritesWorkspaces.value.delete(workspace.id)
      }
    }

    function isWorkspaceChanged(payload: Partial<WorkspaceModel>): boolean {
      const workspace = workspaces.value.find((w) => w.id === payload.id)
      if (!workspace) return false

      if (payload.name !== undefined && workspace.name !== payload.name) return true
      if (payload.color !== undefined && workspace.color !== payload.color) return true
      if (payload.order !== undefined && workspace.order !== payload.order) return true
      if (payload.isFavorite !== undefined && workspace.isFavorite !== payload.isFavorite)
        return true

      return false
    }

    function getFirstLetterOfWorkspace(workspace: WorkspaceModel): string {
      return workspace.name.charAt(0).toUpperCase()
    }

    const getActiveWorkspaceId = computed(() => {
      return activeWorkspace.value?.id ?? ''
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

    function isWorkspaceProcessing(workspaceId: string): boolean {
      return (
        _deletingWorkspaces.value.has(workspaceId) ||
        _archivingWorkspaces.value.has(workspaceId) ||
        _cloningWorkspaces.value.has(workspaceId) ||
        _editingWorkspaces.value.has(workspaceId)
      )
    }

    const getWorkspaces = computed((): WorkspaceModel[] => {
      return workspaces.value
        .filter((workspace) => !workspace.isDeleted)
        .sort((a, b) => {
          return a.order - b.order
        })
    })

    const getFavoriteWorkspaces = computed((): WorkspaceModel[] => {
      return workspaces.value
        .filter((workspace) => workspace.isFavorite && !workspace.isDeleted)
        .sort((a, b) => {
          return a.order - b.order
        })
    })

    function getOtherWorkspaces(workspaceId: string): WorkspaceModel[] {
      return workspaces.value
        .filter((workspace) => workspace.id !== workspaceId && !workspace.isDeleted)
        .sort((a, b) => {
          return a.order - b.order
        })
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
      getWorkspaces,

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
