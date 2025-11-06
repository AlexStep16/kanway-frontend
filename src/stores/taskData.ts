import {
  fetchTasks,
  saveTask,
  archiveTask as archiveTaskService,
  cloneTask as cloneTaskService,
  removeTask,
  createTask,
} from '@services/task'
import { BackendError, HttpError } from '@utils/errors'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { ErrorsMessage } from '@enums/ErrorsMessage'
import { toast } from 'vue-sonner'
import { ITaskState } from '@stores/interfaces/ITaskState'
import { TaskModel } from '@models/TaskModel'
import { useBoardDataStore } from '@stores/boardData'
import { useWorkspaceDataStore } from '@stores/workspaceData'
import { Nullable } from '@/types/utils'
import dayjs from 'dayjs'
import { v4 } from 'uuid'

type TaskErrorType = Nullable<BackendError | HttpError>

export const useTaskDataStore = defineStore('taskData', () => {
  const BOARD_STORE = useBoardDataStore()
  const WORKSPACE_STORE = useWorkspaceDataStore()

  // State
  const tasks = ref<Array<ITaskState>>([])
  const taskToEdit = ref<Nullable<ITaskState>>(null)

  // Errors
  const loadTasksError = ref<TaskErrorType>(null)
  const _addTasksError = ref<Map<string, TaskErrorType>>(new Map())
  const _editTasksError = ref<Map<string, TaskErrorType>>(new Map())
  const _archiveTasksError = ref<Map<string, TaskErrorType>>(new Map())
  const _cloneTasksError = ref<Map<string, TaskErrorType>>(new Map())
  const _deleteTasksError = ref<Map<string, TaskErrorType>>(new Map())

  // Loading
  const _loadingStatusBoards = ref<Map<string, boolean>>(new Map())
  const _loadedBoards = ref<Set<string>>(new Set())
  const _addingTasks = ref<Set<string>>(new Set())
  const _editingTasks = ref<Set<string>>(new Set())
  const _movingTasks = ref<Set<string>>(new Set())
  const _deletingTasks = ref<Set<string>>(new Set())
  const _archivingTasks = ref<Set<string>>(new Set())
  const _cloningTasks = ref<Set<string>>(new Set())

  async function loadTasks(boardId: string, workspaceId: string, force_reload: boolean = false) {
    if (_loadedBoards.value.has(boardId) && !force_reload) return
    if (_loadingStatusBoards.value.get(boardId)) return
    if (areTasksLoaded(boardId) || areTasksLoading(boardId)) return

    _loadingStatusBoards.value.set(boardId, true)

    loadTasksError.value = null

    try {
      const tasksPayload = await fetchTasks(workspaceId, boardId)

      tasks.value = tasks.value.filter((t) => t.boardId !== boardId) // Remove old tasks of this board

      tasks.value.push(...tasksPayload)

      _loadedBoards.value.add(boardId)

      return true
    } catch (e) {
      if (e instanceof BackendError) {
        loadTasksError.value = e
      } else if (e instanceof HttpError) {
        loadTasksError.value = e

        if (e.status === 401) {
        }
      } else {
        loadTasksError.value = new HttpError(ErrorsMessage.UNEXPECTED_ERROR, null)
      }

      toast.error(loadTasksError.value.message)

      return false
    } finally {
      _loadingStatusBoards.value.set(boardId, false)
    }
  }

  function addTaskToStore(categoryId: string) {
    const newTask = new TaskModel({
      id: 'new-' + v4(),
      name: '',
      workspaceId: WORKSPACE_STORE.getActiveWorkspaceId,
      boardId: BOARD_STORE.getActiveBoardId,
      categoryId: categoryId,
      isDeleted: false,
      isDeletedExternal: false,
      order: getTasksByCategoryId(categoryId).length + 1,
      isCompleted: false,
      tags: [],
      userId: '',
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    tasks.value.push({ ...newTask, isNew: true })
  }

  function _updateOrAddTasksInStore(newTasks: ITaskState[]) {
    for (const newTask of newTasks) {
      const existingTask = tasks.value.find((t) => t.id === newTask.id)

      if (!existingTask) {
        if (newTask.tempId) {
          const existingTask = tasks.value.find((t) => t.id === newTask.tempId)

          if (existingTask) {
            Object.assign(existingTask, newTask, { isNew: false })
          }
        } else {
          tasks.value.push(newTask)
        }
      } else {
        Object.assign(existingTask, newTask)
      }
    }
  }

  async function _addTask(
    payload: ITaskState,
    categoryId: Nullable<string>,
    boardId: string,
  ): Promise<ITaskState | false> {
    if (!categoryId || !payload) return false
    if (isTaskProcessing(payload.id)) throw new Error('Задача уже обрабатывается')

    _addTasksError.value.delete(payload.id)

    try {
      _addingTasks.value.add(payload.id)

      const newTasks: ITaskState[] = await createTask(
        { ...payload, categoryId },
        boardId,
        WORKSPACE_STORE.getActiveWorkspaceId,
      )

      _updateOrAddTasksInStore(newTasks)

      return newTasks[0]
    } catch (e) {
      if (e instanceof BackendError) {
        _addTasksError.value.set(payload.id, e)
      } else if (e instanceof HttpError) {
        _addTasksError.value.set(payload.id, e)

        if (e.status === 401) {
        }
      } else {
        _addTasksError.value.set(payload.id, new HttpError(ErrorsMessage.UNEXPECTED_ERROR, null))
      }

      throw e
    } finally {
      _addingTasks.value.delete(payload.id)
    }
  }

  async function addTask(payload: ITaskState, boardId: string): Promise<ITaskState | false> {
    try {
      const result = await _addTask(payload, payload.categoryId, boardId)

      toast.success('Задача успешно создана')

      return result
    } catch {
      toast.error(_addTasksError.value.get(payload.id)?.message ?? 'Ошибка при создании задачи')

      return false
    }
  }

  function createOrSplice(task: ITaskState, target: HTMLInputElement) {
    const taskName = target.value

    task.name = taskName

    if (task.isNew && task.name.trim() !== '') {
      addTask(task, BOARD_STORE.getActiveBoardId)
    } else {
      const index = tasks.value.findIndex((t) => t.id === task.id)

      if (index !== -1) {
        tasks.value.splice(index, 1)
      }
    }
  }

  async function _updateTask(
    payload: Partial<ITaskState> & { id: string },
    workspaceId: string,
    boardId: string,
  ): Promise<ITaskState> {
    if (!payload) throw new Error('Нет данных для обновления задачи')
    if (isTaskProcessing(payload.id)) throw new Error('Задача уже обрабатывается')

    _editTasksError.value.delete(payload.id)

    try {
      _editingTasks.value.add(payload.id)

      const editResult = await saveTask(workspaceId, boardId, payload)

      const newTask = editResult.find((c) => c.id === payload.id)

      if (!newTask) throw new Error('Сервер не вернул обновленную задачу')

      _updateOrAddTasksInStore(editResult)

      return newTask
    } catch (e) {
      if (e instanceof BackendError) {
        _editTasksError.value.set(payload.id, e)
      } else if (e instanceof HttpError) {
        _editTasksError.value.set(payload.id, e)

        if (e.status === 401) {
        }
      } else {
        _editTasksError.value.set(payload.id, new HttpError(ErrorsMessage.UNEXPECTED_ERROR, null))
      }

      throw e
    } finally {
      _editingTasks.value.delete(payload.id)
    }
  }

  async function updateTask(
    payload: Partial<ITaskState> & { id: string; timezone?: string },
    boardId: string,
  ): Promise<ITaskState | false> {
    if (!isTaskChanged(payload)) return false

    try {
      payload.timezone = dayjs.tz.guess()

      const result = await _updateTask(payload, WORKSPACE_STORE.getActiveWorkspaceId, boardId)

      return result
    } catch {
      toast.error(
        _editTasksError.value.get(payload.id)?.message || 'Ошибка при редактировании задачи',
      )

      return false
    }
  }

  async function _deleteTask(task: ITaskState): Promise<void> {
    if (!task) throw new Error('Нет задачи для удаления')
    if (isTaskProcessing(task.id)) throw new Error('Задача уже обрабатывается')

    _deleteTasksError.value.delete(task.id)

    try {
      _deletingTasks.value.add(task.id)

      await removeTask(task.id, WORKSPACE_STORE.getActiveWorkspaceId, task.boardId)

      const taskIndex = tasks.value.findIndex((t) => t.id === task.id)
      if (taskIndex !== -1) {
        tasks.value.splice(taskIndex, 1)
      }
    } catch (e) {
      if (e instanceof BackendError) {
        _deleteTasksError.value.set(task.id, e)
      } else if (e instanceof HttpError) {
        _deleteTasksError.value.set(task.id, e)

        if (e.status === 401) {
        }
      } else {
        _deleteTasksError.value.set(task.id, new HttpError(ErrorsMessage.UNEXPECTED_ERROR, null))
      }

      throw e
    } finally {
      _deletingTasks.value.delete(task.id)
    }
  }

  async function deleteTask(task: ITaskState): Promise<boolean> {
    try {
      await _deleteTask(task)

      toast.success('Задача успешно удалена')

      return true
    } catch {
      toast.error(_deleteTasksError.value.get(task.id)?.message || 'Ошибка при удалении задачи')

      return false
    }
  }

  async function _archiveTask(task: ITaskState, workspaceId: string): Promise<ITaskState> {
    if (!task) throw new Error('Нет задачи для архивирования')
    if (isTaskProcessing(task.id)) throw new Error('Задача уже обрабатывается')

    _archiveTasksError.value.delete(task.id)

    try {
      _archivingTasks.value.add(task.id)

      const newTasks = await archiveTaskService(task.id, workspaceId, task.boardId)

      if (!newTasks[0]) throw new Error('Сервер не вернул архивированную задачу')

      _updateOrAddTasksInStore(newTasks)

      return newTasks[0]
    } catch (e) {
      if (e instanceof BackendError) {
        _archiveTasksError.value.set(task.id, e)
      } else if (e instanceof HttpError) {
        _archiveTasksError.value.set(task.id, e)

        if (e.status === 401) {
        }
      } else {
        _archiveTasksError.value.set(task.id, new HttpError(ErrorsMessage.UNEXPECTED_ERROR, null))
      }

      throw e
    } finally {
      _archivingTasks.value.delete(task.id)
    }
  }

  async function archiveTask(task: ITaskState): Promise<ITaskState | false> {
    try {
      const result = await _archiveTask(task, WORKSPACE_STORE.getActiveWorkspaceId)

      toast.success('Задача успешно архивирована')

      return result
    } catch {
      toast.error(
        _archiveTasksError.value.get(task.id)?.message || 'Ошибка при архивировании задачи',
      )

      return false
    }
  }

  async function _cloneTask(task: ITaskState, workspaceId: string): Promise<ITaskState> {
    if (!task) throw new Error('Нет задачи для копирования')
    if (isTaskProcessing(task.id)) throw new Error('Задача уже обрабатывается')

    _cloneTasksError.value.delete(task.id)

    try {
      _cloningTasks.value.add(task.id)

      const newTasks = await cloneTaskService(task.id, workspaceId, task.boardId)

      if (!newTasks[0]) throw new Error('Сервер не вернул новую задачу')

      _updateOrAddTasksInStore(newTasks)

      return newTasks[0]
    } catch (e) {
      if (e instanceof BackendError) {
        _cloneTasksError.value.set(task.id, e)
      } else if (e instanceof HttpError) {
        _cloneTasksError.value.set(task.id, e)

        if (e.status === 401) {
        }
      } else {
        _cloneTasksError.value.set(task.id, new HttpError(ErrorsMessage.UNEXPECTED_ERROR, null))
      }

      throw e
    } finally {
      _cloningTasks.value.delete(task.id)
    }
  }

  async function cloneTask(task: ITaskState): Promise<ITaskState | false> {
    try {
      const result = await _cloneTask(task, WORKSPACE_STORE.getActiveWorkspaceId)

      toast.success('Задача успешно скопирована')

      return result
    } catch {
      toast.error(_cloneTasksError.value.get(task.id)?.message || 'Ошибка при копировании задачи')

      return false
    }
  }

  async function moveTask(
    taskId: string,
    newCategoryId: string,
    workspaceId: string,
  ): Promise<ITaskState | false> {
    const task = tasks.value.find((t) => t.id === taskId)

    if (!task) {
      toast.error('Задача не найдена')
      return false
    }

    const newTask: ITaskState = { ...task, categoryId: newCategoryId }

    try {
      _movingTasks.value.add(task.id)

      const result = await _updateTask(newTask, workspaceId, task.boardId)

      toast.success('Задача успешно перемещена')

      return result
    } catch {
      toast.error(_editTasksError.value.get(task.id)?.message || 'Ошибка при перемещении задачи')

      return false
    } finally {
      _movingTasks.value.delete(task.id)
    }
  }

  function clearTaskToEdit() {
    taskToEdit.value = null
  }

  function getTasksByCategoryId(categoryId: string): ITaskState[] {
    return tasks.value
      .filter((task) => task.categoryId === categoryId && !task.isDeleted)
      .sort((a, b) => a.order - b.order)
  }

  function isTaskChanged(payload: Partial<ITaskState>): boolean {
    const task = tasks.value.find((c) => c.id === payload.id)
    if (!task) return false

    if (payload.name !== undefined && task.name !== payload.name) return true
    if (payload.categoryId !== undefined && task.categoryId !== payload.categoryId) return true
    if (payload.color !== undefined && task.color !== payload.color) return true
    if (payload.description !== undefined && task.description !== payload.description) return true
    if (payload.dueDate !== undefined && task.dueDate !== payload.dueDate) return true
    if (payload.dueHours !== undefined && task.dueHours !== payload.dueHours) return true
    if (payload.dueMinutes !== undefined && task.dueMinutes !== payload.dueMinutes) return true
    if (payload.isCompleted !== undefined && task.isCompleted !== payload.isCompleted) return true

    if (payload.tags !== undefined) {
      const currentTags = task.tags || []
      const newTags = payload.tags || []

      const currentTagsSorted = [...currentTags].sort()
      const newTagsSorted = [...newTags].sort()

      if (JSON.stringify(currentTagsSorted) !== JSON.stringify(newTagsSorted)) {
        return true
      }
    }

    return false
  }

  function areTasksLoading(boardId: string): boolean {
    return _loadingStatusBoards.value.get(boardId) === true
  }

  function areTasksLoaded(boardId: string): boolean {
    return _loadedBoards.value.has(boardId)
  }

  const getActiveBoardTasks = computed((): ITaskState[] => {
    if (!BOARD_STORE.activeBoard) return []

    return tasks.value
      .filter((task) => task.boardId === BOARD_STORE.getActiveBoardId)
      .sort((a, b) => {
        return a.order - b.order
      })
  })

  function isTaskProcessing(taskId: string): boolean {
    return (
      _addingTasks.value.has(taskId) ||
      _editingTasks.value.has(taskId) ||
      _movingTasks.value.has(taskId) ||
      _archivingTasks.value.has(taskId) ||
      _cloningTasks.value.has(taskId)
    )
  }

  const isTaskAdding = computed(() => (taskId: string): boolean => {
    return _addingTasks.value.has(taskId)
  })

  const isTaskMoving = computed(() => (taskId: string): boolean => {
    return _movingTasks.value.has(taskId)
  })

  const isTaskArchiving = computed(() => (taskId: string): boolean => {
    return _archivingTasks.value.has(taskId)
  })

  const isTaskCloning = computed(() => (taskId: string): boolean => {
    return _cloningTasks.value.has(taskId)
  })

  function $reset() {}

  return {
    // State
    tasks,
    taskToEdit,
    getActiveBoardTasks,
    isTaskMoving,
    isTaskProcessing,
    isTaskArchiving,
    isTaskCloning,
    isTaskAdding,

    // Errors
    loadTasksError,

    // Actions
    loadTasks,
    areTasksLoading,
    areTasksLoaded,
    updateTask,
    moveTask,
    deleteTask,
    archiveTask,
    cloneTask,
    getTasksByCategoryId,
    clearTaskToEdit,
    addTaskToStore,
    createOrSplice,

    $reset,
  }
})
