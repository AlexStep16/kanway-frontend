import {
  fetchTasks,
  saveTask,
  saveTasks,
  archiveTask as archiveTaskService,
  recoverTask as recoverTaskService,
  cloneTask as cloneTaskService,
  removeTask,
  createTask,
  transformTask,
  fetchArchivedTasks,
} from '@services/task'
import { BackendError, HttpError } from '@utils/errors'
import { defineStore } from 'pinia'
import { computed, reactive, ref } from 'vue'
import { ErrorsMessage } from '@enums/ErrorsMessage'
import { toast } from 'vue-sonner'
import { ITaskState } from '@stores/interfaces/ITaskState'
import { TaskModel } from '@models/TaskModel'
import { useBoardDataStore } from '@stores/boardData'
import { useWorkspaceDataStore } from '@stores/workspaceData'
import { Nullable } from '@/types/utils'
import { generateUUID } from '@utils/idGenerator'
import { ITask } from '@/interfaces/domain/ITask'
import { ISingleUpdate } from '@interfaces/domain/ISingleUpdate'
import _ from 'lodash'
import { ITaskFilters } from '@/interfaces/domain/ITaskFilters'
import dayjs from 'dayjs'
import { requestQueueService } from '@/utils/RequestQueueService'
import { ICategoryState } from '@stores/interfaces/ICategoryState'
import { useCategoryDataStore } from '@stores/categoryData'
import { useUIStore } from '@stores/ui'
import { useLogStore } from '@stores/log'
import { IBoard } from '@interfaces/domain/IBoard'
import { IResponseWithLog } from '@interfaces/IResponseWithLog'

type TaskErrorType = Nullable<BackendError | HttpError>

export const useTaskDataStore = defineStore('taskData', () => {
  const BOARD_STORE = useBoardDataStore()
  const WORKSPACE_STORE = useWorkspaceDataStore()
  const CATEGORY_STORE = useCategoryDataStore()
  const UI_STORE = useUIStore()
  const LOG_STORE = useLogStore()

  const activeWorkspace = computed(() => WORKSPACE_STORE.getActiveWorkspace)
  const activeBoard = computed(() => BOARD_STORE.getActiveBoard as IBoard)

  // State
  const tasks = ref<Array<ITaskState>>([])
  const taskToEdit = ref<Nullable<ITaskState>>(null)
  const taskFilters = ref<ITaskFilters>({
    isCompleted: false,
    isInProgress: false,
    isExpired: false,
    isDueToday: false,
    isDueTomorrow: false,
    isDueThisWeek: false,
    tags: [],
  })

  // Errors
  const loadTasksError = ref<TaskErrorType>(null)
  const loadArchivedTasksError = ref<TaskErrorType>(null)
  const _addTasksError = ref<Map<string, TaskErrorType>>(new Map())
  const _editTasksError = ref<Map<string, TaskErrorType>>(new Map())
  const _editManyTasksError = ref<Map<string, TaskErrorType>>(new Map())
  const _archiveTasksError = ref<Map<string, TaskErrorType>>(new Map())
  const _recoverTasksError = ref<Map<string, TaskErrorType>>(new Map())
  const _cloneTasksError = ref<Map<string, TaskErrorType>>(new Map())
  const _deleteTasksError = ref<Map<string, TaskErrorType>>(new Map())

  // Loading
  const _loadingStatusBoards = ref<Map<string, boolean>>(new Map())
  const _loadingStatusArchived = ref<boolean>(false)
  const _isArchivedTasksLoaded = ref<boolean>(false)
  const _loadedBoards = ref<Set<string>>(new Set())
  const _addingTasks = ref<Set<string>>(new Set())
  const _editingTasks = ref<Set<string>>(new Set())
  const _editingManyTasks = ref<Set<string>>(new Set())
  const _movingTasks = ref<Set<string>>(new Set())
  const _deletingTasks = ref<Set<string>>(new Set())
  const _archivingTasks = ref<Set<string>>(new Set())
  const _recoveringTasks = ref<Set<string>>(new Set())
  const _cloningTasks = ref<Set<string>>(new Set())

  async function loadTasks(boardId: string, workspaceId: string, force_reload: boolean = false) {
    if (areTasksLoaded(boardId) && !force_reload) return
    if (areTasksLoading(boardId)) return
    if (_loadingStatusBoards.value.get(boardId)) return

    _loadingStatusBoards.value.set(boardId, true)

    loadTasksError.value = null

    try {
      const tasksPayload = await fetchTasks(workspaceId, boardId)
      console.log(tasks.value.map((t) => t.boardId))
      console.log(boardId)
      tasks.value = tasks.value.filter((t) => t.boardId !== boardId || t.isDeleted) // Remove old tasks of this board

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

  async function loadArchivedTasks(force_reload: boolean = false) {
    if (_isArchivedTasksLoaded.value && !force_reload) return
    if (_loadingStatusArchived.value) return

    loadArchivedTasksError.value = null
    _loadingStatusArchived.value = true

    try {
      const tasksPayload = await fetchArchivedTasks()

      tasks.value = tasks.value.filter((t) => !t.isDeleted) // Remove old archived tasks

      tasks.value.push(...tasksPayload)

      _isArchivedTasksLoaded.value = true

      return true
    } catch (e) {
      if (e instanceof BackendError) {
        loadArchivedTasksError.value = e
      } else if (e instanceof HttpError) {
        loadArchivedTasksError.value = e

        if (e.status === 401) {
        }
      } else {
        loadArchivedTasksError.value = new HttpError(ErrorsMessage.UNEXPECTED_ERROR, null)
      }

      toast.error(loadArchivedTasksError.value.message)

      return false
    } finally {
      _loadingStatusArchived.value = false
    }
  }

  function addTaskToStore(categoryId: string) {
    if (!categoryId || !activeWorkspace.value) return null
    if (tasks.value.some((t) => t.categoryId === categoryId && t.isNew)) return null
    const category = CATEGORY_STORE.getCategoryById(categoryId) as ICategoryState

    const newTask = new TaskModel({
      id: 'new-' + generateUUID(),
      name: '',
      workspaceId: activeWorkspace.value.id,
      workspaceName: activeWorkspace.value.name,
      boardId: activeBoard.value.id,
      boardName: activeBoard.value.name,
      categoryId: category.id,
      categoryName: category.name,
      isDeleted: false,
      isDeletedExternal: false,
      order: getTasksByCategoryId(categoryId).length + 1,
      isCompleted: false,
      tags: [],
      userId: '',
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    const newTaskState: ITaskState = reactive({ ...newTask, isNew: true })

    tasks.value.push(newTaskState)

    return newTaskState
  }

  function _updateOrAddTasksInStore(newTasks: ISingleUpdate<ITaskState>[]) {
    for (const newTask of newTasks) {
      const existingTask = tasks.value.find((t) => t.id === newTask.id)

      if (!existingTask) {
        if (newTask.tempId) {
          const existingTask = tasks.value.find((t) => t.id === newTask.tempId)

          if (existingTask) {
            Object.assign(existingTask, newTask, { isNew: false })
          }
        } else if (newTask.categoryId) {
          const addedTask = addTaskToStore(newTask.categoryId)

          if (addedTask) Object.assign(addedTask, newTask, { isNew: false })
        }
      } else {
        Object.assign(existingTask, newTask)
      }
    }
  }

  async function _addTask(
    payload: TaskModel,
    categoryId: Nullable<string>,
    boardId: string | null,
  ): Promise<IResponseWithLog<ITaskState>> {
    if (!categoryId || !boardId || !payload) throw new Error('Нет данных для создания задачи')
    if (!activeWorkspace.value) throw new Error('Нет активного рабочего пространства')

    _addTasksError.value.delete(payload.id)

    try {
      _addingTasks.value.add(payload.id)

      const board = BOARD_STORE.getBoardById(boardId)
      const category = CATEGORY_STORE.getCategoryById(categoryId)

      if (!board || !category) throw new Error('Нет данных для создания задачи')

      const createResult = await createTask(
        {
          ...payload,
          categoryId,
          categoryName: category.name,
          boardName: board.name,
          workspaceName: activeWorkspace.value.name,
        },
        boardId,
        activeWorkspace.value.id,
      )

      const newTasks: ITaskState[] = createResult.data

      return {
        data: newTasks[0],
        logId: createResult.logId,
      }
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

  function cleanStateFields(payload: ITaskState | ISingleUpdate<ITaskState>) {
    delete payload.isNew
    delete payload.tempId
  }

  async function addTask(payload: ITaskState, boardId: string | null): Promise<ITaskState | false> {
    try {
      const clonedPayload: ITaskState = { ...payload }
      cleanStateFields(clonedPayload)

      const result = await _addTask(clonedPayload, payload.categoryId, boardId)

      const data = result.data

      if (data) _updateOrAddTasksInStore([data])

      toast.success('Задача успешно создана', {
        action: {
          label: 'Отменить',
          onClick: () => {
            if (result.logId) LOG_STORE.undo(result.logId)
          },
        },
      })

      return data
    } catch {
      toast.error(_addTasksError.value.get(payload.id)?.message ?? 'Ошибка при создании задачи')

      return false
    }
  }

  function createOrSplice(task: ITaskState, target: HTMLInputElement) {
    const taskName = target.value

    task.name = taskName

    if (task.isNew && task.name.trim() !== '') {
      addTask(task, BOARD_STORE.getActiveBoard?.id ?? null)
    } else {
      const index = tasks.value.findIndex((t) => t.id === task.id)

      if (index !== -1) {
        tasks.value.splice(index, 1)
      }
    }
  }

  async function _updateTasks(
    payload: ISingleUpdate<TaskModel>[],
    workspaceId: string,
    boardId: string,
  ): Promise<IResponseWithLog<ITaskState[]>> {
    if (payload.length === 0) throw new Error('Нет данных для обновления задачи')

    try {
      for (const p of payload) {
        _editManyTasksError.value.delete(p.id)
        _editingManyTasks.value.add(p.id)
      }

      const coreAction = () => saveTasks(workspaceId, boardId, payload)

      const editManyResult = await requestQueueService.enqueueBulk(
        payload.map((p) => p.id),
        coreAction,
      )
      const newTasks = editManyResult.data.filter((t) => payload.some((p) => p.id === t.id))

      if (newTasks.length === 0) throw new Error('Сервер не вернул обновленные задачи')

      return {
        data: newTasks,
        logId: editManyResult.logId,
      }
    } catch (e) {
      if (e instanceof BackendError) {
        for (const p of payload) {
          _editManyTasksError.value.set(p.id, e)
        }
      } else if (e instanceof HttpError) {
        for (const p of payload) {
          _editManyTasksError.value.set(p.id, e)
        }

        if (e.status === 401) {
        }
      } else {
        for (const p of payload) {
          _editManyTasksError.value.set(p.id, new HttpError(ErrorsMessage.UNEXPECTED_ERROR, null))
        }
      }

      throw e
    } finally {
      for (const p of payload) {
        _editingManyTasks.value.delete(p.id)
      }
    }
  }

  async function _updateTask(
    payload: ISingleUpdate<TaskModel>,
    workspaceId: string,
    boardId: string,
  ): Promise<IResponseWithLog<ITaskState>> {
    if (!payload) throw new Error('Нет данных для обновления задачи')

    _editTasksError.value.delete(payload.id)

    try {
      _editingTasks.value.add(payload.id)

      const coreAction = () => saveTask(workspaceId, boardId, payload)

      const editResult = await requestQueueService.enqueue(payload.id, coreAction)

      const newTask = editResult.data.find((c) => c.id === payload.id)

      if (!newTask) throw new Error('Сервер не вернул обновленную задачу')

      return {
        data: newTask,
        logId: editResult.logId,
      }
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
    payload: ISingleUpdate<ITaskState>,
    boardId: string,
    isOptimisticUpdate: boolean = false,
  ): Promise<ITaskState | false> {
    if (!isTaskChanged(payload) || !activeWorkspace.value) return false
    const savedTask = _.cloneDeep(tasks.value.find((t) => t.id === payload.id))
    const board = BOARD_STORE.getBoardById(boardId)

    if (!board) return false

    try {
      if (isOptimisticUpdate && savedTask) {
        _updateOrAddTasksInStore([payload])
      }

      const clonedPayload: ISingleUpdate<ITaskState> = { ...payload }
      cleanStateFields(clonedPayload)
      const result = await _updateTask(clonedPayload, activeWorkspace.value.id, board.id)
      const data = result.data

      _updateOrAddTasksInStore([data])

      return data
    } catch {
      if (isOptimisticUpdate && savedTask) {
        _updateOrAddTasksInStore([savedTask])
      }

      toast.error(
        _editTasksError.value.get(payload.id)?.message || 'Ошибка при редактировании задачи',
      )

      return false
    }
  }

  async function updateTasks(
    payload: ISingleUpdate<ITaskState>[],
    boardId: string,
    isOptimisticUpdate: boolean = false,
  ): Promise<ITaskState[] | false> {
    if (payload.length === 0 || !activeWorkspace.value) return false
    const savedTasks: ITaskState[] = []
    const board = BOARD_STORE.getBoardById(boardId)

    if (!board) return false

    for (const p of payload) {
      const existingTask = tasks.value.find((t) => t.id === p.id)
      if (existingTask) {
        savedTasks.push(_.cloneDeep(existingTask))
      }
    }

    try {
      if (isOptimisticUpdate) {
        _updateOrAddTasksInStore(payload)
      }

      const clonedPayload = payload.map((p) => {
        const clonedP = { ...p }
        cleanStateFields(clonedP)
        return clonedP
      })

      const result = await _updateTasks(
        clonedPayload,
        activeWorkspace.value.id,
        activeBoard.value.id,
      )
      const data = result.data

      _updateOrAddTasksInStore(data)

      return data
    } catch {
      if (isOptimisticUpdate) {
        _updateOrAddTasksInStore(savedTasks)
      }

      toast.error(
        _editManyTasksError.value.get(payload[0].id)?.message || 'Ошибка при редактировании задачи',
      )

      return false
    }
  }

  async function _deleteTask(task: ITaskState): Promise<void> {
    if (!task) throw new Error('Нет задачи для удаления')
    if (_deletingTasks.value.has(task.id)) throw new Error('Задача уже в процессе удаления')
    if (!activeWorkspace.value) throw new Error('Нет активного рабочего пространства')

    _deleteTasksError.value.delete(task.id)

    try {
      _deletingTasks.value.add(task.id)

      const coreAction = () => removeTask(task.id, activeWorkspace.value!.id, task.boardId)

      await requestQueueService.enqueue(task.id, coreAction)

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
    if (!task || _deletingTasks.value.has(task.id)) return false

    try {
      const clonedTask: ITaskState = { ...task }
      cleanStateFields(clonedTask)

      await _deleteTask(clonedTask)

      toast.success('Задача успешно удалена')

      return true
    } catch {
      toast.error(_deleteTasksError.value.get(task.id)?.message || 'Ошибка при удалении задачи')

      return false
    }
  }

  async function _archiveTask(
    task: TaskModel,
    workspaceId: string,
  ): Promise<IResponseWithLog<ITaskState[]>> {
    if (!task) throw new Error('Нет задачи для архивирования')
    if (_archivingTasks.value.has(task.id)) throw new Error('Задача уже в процессе архивирования')

    _archiveTasksError.value.delete(task.id)

    try {
      _archivingTasks.value.add(task.id)

      const coreAction = () => archiveTaskService(task.id, workspaceId, task.boardId)

      const archiveResult = await requestQueueService.enqueue(task.id, coreAction)
      const archivedTasks = archiveResult.data
      const archivedTask = archivedTasks.find((t) => t.id === task.id)

      if (!archivedTask) throw new Error('Сервер не вернул архивированную задачу')

      return {
        data: archivedTasks,
        logId: archiveResult.logId,
      }
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
    if (!task || _archivingTasks.value.has(task.id) || !activeWorkspace.value) return false

    try {
      const clonedTask: ITaskState = { ...task }
      cleanStateFields(clonedTask)

      const archiveResult = await _archiveTask(clonedTask, activeWorkspace.value.id)
      const data = archiveResult.data
      const archivedTask = data.find((t) => t.id === task.id) as ITaskState

      _updateOrAddTasksInStore(data)

      toast.success('Задача успешно архивирована', {
        action: {
          label: 'Отменить',
          onClick: () => {
            if (archiveResult.logId) LOG_STORE.undo(archiveResult.logId)
          },
        },
      })

      return archivedTask
    } catch {
      toast.error(
        _archiveTasksError.value.get(task.id)?.message || 'Ошибка при архивировании задачи',
      )

      return false
    }
  }

  async function _recoverTask(
    task: TaskModel,
    workspaceId: string,
  ): Promise<IResponseWithLog<ITaskState[]>> {
    if (!task) throw new Error('Нет задачи для восстановления')
    if (_recoveringTasks.value.has(task.id)) throw new Error('Задача уже в процессе восстановления')

    _recoverTasksError.value.delete(task.id)

    try {
      _updateOrAddTasksInStore([task]) // Optimistic update

      _recoveringTasks.value.add(task.id)

      const coreAction = () => recoverTaskService(task.id, workspaceId, task.boardId)

      const recoverResult = await requestQueueService.enqueue(task.id, coreAction)
      const recoveredTasks = recoverResult.data
      const recoveredTask = recoveredTasks.find((t) => t.id === task.id)

      if (!recoveredTask) throw new Error('Сервер не вернул восстановленную задачу')

      return {
        data: recoveredTasks,
        logId: recoverResult.logId,
      }
    } catch (e) {
      if (e instanceof BackendError) {
        _recoverTasksError.value.set(task.id, e)
      } else if (e instanceof HttpError) {
        _recoverTasksError.value.set(task.id, e)

        if (e.status === 401) {
        }
      } else {
        _recoverTasksError.value.set(task.id, new HttpError(ErrorsMessage.UNEXPECTED_ERROR, null))
      }

      throw e
    } finally {
      _recoveringTasks.value.delete(task.id)
    }
  }

  async function recoverTask(task: ITaskState): Promise<ITaskState | false> {
    if (!task || _recoveringTasks.value.has(task.id) || !activeWorkspace.value) return false

    try {
      const clonedTask: ITaskState = { ...task }
      cleanStateFields(clonedTask)

      const recoverResult = await _recoverTask(clonedTask, activeWorkspace.value.id)
      const data = recoverResult.data
      const recoveredTask = data.find((t) => t.id === task.id) as ITaskState

      _updateOrAddTasksInStore(data)

      toast.success('Задача успешно восстановлена', {
        action: {
          label: 'Отменить',
          onClick: () => {
            if (recoverResult.logId) LOG_STORE.undo(recoverResult.logId)
          },
        },
      })

      return recoveredTask
    } catch {
      toast.error(
        _recoverTasksError.value.get(task.id)?.message || 'Ошибка при восстановлении задачи',
      )

      return false
    }
  }

  async function _cloneTask(
    task: TaskModel,
    workspaceId: string,
  ): Promise<IResponseWithLog<ITaskState>> {
    if (!task) throw new Error('Нет задачи для копирования')
    if (_cloningTasks.value.has(task.id)) throw new Error('Задача уже в процессе копирования')

    _cloneTasksError.value.delete(task.id)

    try {
      _cloningTasks.value.add(task.id)

      const coreAction = () => cloneTaskService(task.id, workspaceId, task.boardId)

      const cloneResult = await requestQueueService.enqueue(task.id, coreAction)
      const clonedTasks = cloneResult.data

      if (!clonedTasks[0]) throw new Error('Сервер не вернул новую задачу')

      return {
        data: clonedTasks[0],
        logId: cloneResult.logId,
      }
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
    if (!task || _cloningTasks.value.has(task.id) || !activeWorkspace.value) return false

    try {
      const clonedTask: ITaskState = { ...task }
      cleanStateFields(clonedTask)

      const result = await _cloneTask(clonedTask, activeWorkspace.value.id)
      const data = result.data

      _updateOrAddTasksInStore([data])

      toast.success('Задача успешно скопирована', {
        action: {
          label: 'Отменить',
          onClick: () => {
            if (result.logId) LOG_STORE.undo(result.logId)
          },
        },
      })

      return data
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
    if (!taskId || _movingTasks.value.has(taskId)) return false

    const task = tasks.value.find((t) => t.id === taskId)
    const newCategory = CATEGORY_STORE.getCategoryById(newCategoryId)

    if (!newCategory || !task) return false

    const newTask: ITaskState = {
      ...task,
      categoryId: newCategoryId,
      categoryName: newCategory.name,
    }
    cleanStateFields(newTask)

    try {
      _movingTasks.value.add(task.id)

      const result = await _updateTask(newTask, workspaceId, task.boardId)
      const data = result.data

      _updateOrAddTasksInStore([data])

      toast.success('Задача успешно перемещена', {
        action: {
          label: 'Отменить',
          onClick: () => {
            if (result.logId) LOG_STORE.undo(result.logId)
          },
        },
      })

      return data
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

  function openTaskToEdit(task: ITaskState) {
    const taskOriginal = tasks.value.find((t) => t.id === task.id)
    if (!taskOriginal) return

    taskToEdit.value = taskOriginal

    UI_STORE.openEditTaskModal()
  }

  function deleteFromStore(taskIds: string[]) {
    tasks.value = tasks.value.filter((t) => !taskIds.includes(t.id))
  }

  function integrateTasks(rawTasks: ITask[]) {
    if (!rawTasks || rawTasks.length === 0) return
    const newModels = rawTasks.map((raw) => transformTask(raw))

    for (const newModel of newModels) {
      const existingIndex = tasks.value.findIndex((t) => t.id === newModel.id)

      if (existingIndex !== -1) {
        Object.assign(tasks.value[existingIndex], newModel)
      } else {
        tasks.value.push(newModel)
      }
    }
  }

  function getTasksByCategoryId(categoryId: string): ITaskState[] {
    return tasks.value.filter((task) => task.categoryId === categoryId && !task.isDeleted)
  }

  function getAllTasksByCategoryId(categoryId: string): ITaskState[] {
    return tasks.value.filter((task) => task.categoryId === categoryId)
  }

  function getVisibleTasksByCategoryId(categoryId: string, sort = true): ITaskState[] {
    const filtered = getVisibleTasks.value.filter(
      (task) => task.categoryId === categoryId && !task.isDeleted,
    )

    if (sort) return filtered.sort((a, b) => a.order - b.order)

    return filtered
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
    if (payload.order !== undefined && task.order !== payload.order) return true

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

  const getFilteredTasks = computed(() => {
    let result = getActiveBoardTasks.value.filter((t) => !t.isNew)

    if (taskFilters.value.isCompleted === true) {
      result = result.filter((t) => t.isCompleted)
    }

    if (taskFilters.value.isInProgress === true) {
      result = result.filter((t) => !t.isCompleted)
    }

    if (taskFilters.value.isExpired === true) {
      result = result.filter((t) => {
        const hasDueDate = t.dueDate !== null && t.dueDate !== undefined && t.dueDate !== ''
        if (!hasDueDate) return false

        const hasDueHours = t.dueHours !== null && t.dueHours !== undefined
        const hasDueMinutes = t.dueMinutes !== null && t.dueMinutes !== undefined

        if (hasDueHours && hasDueMinutes) {
          const fullDueDateTime = new Date(
            `${t.dueDate}T${String(t.dueHours).padStart(2, '0')}:${String(t.dueMinutes).padStart(2, '0')}:00`,
          )

          return fullDueDateTime < new Date()
        } else {
          const dueDateOnly = dayjs(t.dueDate).startOf('day').toDate()

          return dueDateOnly < new Date()
        }
      })
    }

    if (taskFilters.value.isDueToday === true) {
      result = result.filter((t) => {
        const hasDueDate = t.dueDate !== null && t.dueDate !== undefined && t.dueDate !== ''
        if (!hasDueDate) return false

        const today = dayjs().startOf('day')
        const taskDueDate = dayjs(t.dueDate).startOf('day')

        return taskDueDate.isSame(today, 'day')
      })
    }

    if (taskFilters.value.isDueTomorrow === true) {
      result = result.filter((t) => {
        const hasDueDate = t.dueDate !== null && t.dueDate !== undefined && t.dueDate !== ''
        if (!hasDueDate) return false

        const tomorrow = dayjs().add(1, 'day').startOf('day')
        const taskDueDate = dayjs(t.dueDate).startOf('day')

        return taskDueDate.isSame(tomorrow, 'day')
      })
    }

    if (taskFilters.value.isDueThisWeek === true) {
      result = result.filter((t) => {
        const hasDueDate = t.dueDate && t.dueDate.length > 0
        if (!hasDueDate) return false

        const startOfThisWeek = dayjs().startOf('isoWeek')

        const endOfThisWeek = dayjs().endOf('isoWeek')
        const taskDueDate = dayjs(t.dueDate).startOf('day')

        return dayjs(taskDueDate).isBetween(startOfThisWeek, endOfThisWeek, 'day', '[]')
      })
    }

    if (taskFilters.value.tags && taskFilters.value.tags.length > 0) {
      result = result.filter((t) => {
        return t.tags.some((tag) => taskFilters.value.tags.includes(tag))
      })
    }

    const newTask = getActiveBoardTasks.value.find((t) => t.isNew)
    if (newTask) result.push(newTask)

    return result
  })

  function clearFilters() {
    for (const key in taskFilters.value) {
      const filterKey = key as keyof ITaskFilters
      const filterValue = taskFilters.value[filterKey]

      if (Array.isArray(filterValue)) {
        ;(taskFilters.value as any)[filterKey] = []
      } else if (typeof filterValue === 'boolean') {
        ;(taskFilters.value as any)[filterKey] = false
      }
    }
  }

  function areTasksLoading(boardId: string): boolean {
    return _loadingStatusBoards.value.get(boardId) === true
  }

  function areTasksLoaded(boardId: string): boolean {
    return _loadedBoards.value.has(boardId)
  }

  const getVisibleTasks = computed((): ITaskState[] => {
    return getFilteredTasks.value
  })

  const getArchivedTasks = computed((): ITaskState[] => {
    return tasks.value
      .filter((task) => task.isDeleted && !task.isDeletedExternal)
      .sort((a, b) => {
        if (!a.deletedTime || !b.deletedTime) return a.updatedAt.getTime() - b.updatedAt.getTime()

        return b.deletedTime.getTime() - a.deletedTime.getTime()
      })
  })

  const getTasksTags = computed((): string[] => {
    return getActiveBoardTasks.value.reduce((acc: string[], task: ITaskState) => {
      if (task.tags && task.tags.length > 0) {
        task.tags.forEach((tag) => {
          if (!acc.includes(tag)) {
            acc.push(tag)
          }
        })
      }
      return acc
    }, [])
  })

  const getActiveBoardTasks = computed((): ITaskState[] => {
    if (!activeBoard.value) return []

    return tasks.value
      .filter((task) => task.boardId === activeBoard.value.id && !task.isDeleted)
      .sort((a, b) => {
        return a.order - b.order
      })
  })

  const getActiveBoardTasksByName = computed(() => (name: string): ITaskState[] => {
    return getActiveBoardTasks.value.filter(
      (task) => task.name.toLowerCase().startsWith(name.toLowerCase()) && !task.isNew,
    )
  })

  const getArchivedTasksByName = computed(() => (name: string): ITaskState[] => {
    return getArchivedTasks.value.filter((task) =>
      task.name.toLowerCase().startsWith(name.toLowerCase()),
    )
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

  const isArchivedTasksLoading = computed((): boolean => {
    return _loadingStatusArchived.value
  })

  const isFilterActive = computed((): boolean => {
    for (const key in taskFilters.value) {
      const filterKey = key as keyof ITaskFilters
      const filterValue = taskFilters.value[filterKey]
      if (Array.isArray(filterValue) && filterValue.length > 0) {
        return true
      }
      if (typeof filterValue === 'boolean' && filterValue === true) {
        return true
      }
    }

    return false
  })

  function $reset() {}

  return {
    // State
    tasks,
    taskToEdit,
    taskFilters,
    getActiveBoardTasks,
    isTaskMoving,
    isTaskProcessing,
    isTaskArchiving,
    isTaskCloning,
    isTaskAdding,
    isArchivedTasksLoading,
    getVisibleTasks,
    getTasksTags,
    isFilterActive,
    getActiveBoardTasksByName,
    getArchivedTasks,
    getArchivedTasksByName,

    // Errors
    loadTasksError,

    // Actions
    loadTasks,
    loadArchivedTasks,
    areTasksLoading,
    areTasksLoaded,
    updateTask,
    updateTasks,
    moveTask,
    deleteTask,
    archiveTask,
    recoverTask,
    cloneTask,
    getVisibleTasksByCategoryId,
    getTasksByCategoryId,
    getAllTasksByCategoryId,
    clearTaskToEdit,
    addTaskToStore,
    openTaskToEdit,
    createOrSplice,
    integrateTasks,
    clearFilters,
    deleteFromStore,

    $reset,
  }
})
