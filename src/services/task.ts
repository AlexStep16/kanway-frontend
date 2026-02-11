import { TaskModel } from '@models/TaskModel'
import { ITask } from '@interfaces/domain/ITask'
import {
  getTasksApi,
  postTaskApi,
  patchTaskApi,
  deleteTaskApi,
  archiveTaskApi,
  cloneTaskApi,
  bulkUpdateTasksApi,
  getArchivedTasksApi,
  recoverTaskApi,
  getTaskApi,
} from '@api/tasks'
import dayjs from 'dayjs'
import { ITaskState } from '@stores/interfaces/ITaskState'
import { ISingleUpdate } from '@/interfaces/domain/ISingleUpdate'
import { useAuthStore } from '@stores/auth'
import { IResponseWithLog } from '@/interfaces/IResponseWithLog'
import { ITaskCreateApiPayload } from '@/interfaces/ITaskCreateApiPayload'
import { ITaskEditApiPayload } from '@/interfaces/ITaskEditApiPayload'
import { pickClean } from '@/utils/pickClean'

const BASE_TASK_FIELDS: (keyof ITask)[] = [
  'name',
  'description',
  'dueDate',
  'dueHours',
  'dueMinutes',
  'color',
  'tags',
  'isCompleted',
  'order',
]

export function transformTask(raw: ITask): ITaskState {
  const AUTH_STORE = useAuthStore()

  const timezone = AUTH_STORE.user?.timezone || dayjs.tz.guess()

  if (raw.dueDate && raw.dueHours != null && raw.dueMinutes != null) {
    const collectedDateTime = `${raw.dueDate}T${raw.dueHours}:${raw.dueMinutes}`
    const utcDueDate = dayjs.utc(collectedDateTime).tz(timezone)
    raw.dueDate = utcDueDate.format('YYYY-MM-DD')
    raw.dueHours = utcDueDate.hour()
    raw.dueMinutes = utcDueDate.minute()
  }

  const taskModel = new TaskModel({
    ...raw,
    deletedTime: raw.deletedTime ? new Date(raw.deletedTime) : undefined,
    createdAt: new Date(raw.createdAt),
    updatedAt: new Date(raw.updatedAt),
  })

  return {
    ...taskModel,
    tempId: (raw as any).tempClientId,
  }
}

export async function fetchTasks(boardId?: string, categoryId?: string) {
  const tasks = await getTasksApi(boardId, categoryId)

  return tasks.map(transformTask)
}

export async function fetchTask(id: string) {
  const tasks = await getTaskApi(id)
  const task = tasks.length > 0 ? tasks[0] : null

  return task ? transformTask(task) : null
}

export async function fetchArchivedTasks() {
  const tasks = await getArchivedTasksApi()

  return tasks.map(transformTask)
}

export async function createTask(
  payload: Partial<ITask>,
  categoryId: string,
  boardId: string,
  workspaceId: string,
): Promise<IResponseWithLog<ITask[]>> {
  const cleanedTaskFields = pickClean(payload, BASE_TASK_FIELDS)

  const apiPayload: ITaskCreateApiPayload = {
    ...cleanedTaskFields,

    name: payload.name || 'Новая задача',
    categoryId: payload.category?.id || categoryId,
    boardId: payload.board?.id || boardId,
    workspaceId: payload.workspace?.id || workspaceId,
  }

  const newTask = await postTaskApi(apiPayload)

  return {
    data: newTask.data.map(transformTask),
    logId: newTask.logId,
  }
}

export async function saveTask(payload: ISingleUpdate<ITask>): Promise<IResponseWithLog<ITask[]>> {
  const apiPayload: ITaskEditApiPayload = {
    ...payload,
    id: payload.id,
    categoryId: payload.category?.id,
    boardId: payload.board?.id,
    workspaceId: payload.workspace?.id,
  }

  const saveResult = await patchTaskApi(apiPayload)

  return {
    data: saveResult.data.map(transformTask),
    logId: saveResult.logId,
  }
}

export async function saveTasks(
  payload: ISingleUpdate<ITask>[],
): Promise<IResponseWithLog<ITask[]>> {
  const cleanedPayload: ITaskEditApiPayload[] = payload.map((item) => ({
    ...item,
    id: item.id,
    categoryId: item.category?.id,
    boardId: item.board?.id,
    workspaceId: item.workspace?.id,
  }))

  const saveResult = await bulkUpdateTasksApi(cleanedPayload)

  return {
    data: saveResult.data.map(transformTask),
    logId: saveResult.logId,
  }
}

export async function removeTask(id: string) {
  await deleteTaskApi(id)
}

export async function archiveTask(id: string): Promise<IResponseWithLog<ITask[]>> {
  const archiveResult = await archiveTaskApi(id)

  return {
    data: archiveResult.data.map(transformTask),
    logId: archiveResult.logId,
  }
}

export async function recoverTask(id: string): Promise<IResponseWithLog<ITask[]>> {
  const recoverResult = await recoverTaskApi(id)

  return {
    data: recoverResult.data.map(transformTask),
    logId: recoverResult.logId,
  }
}

export async function cloneTask(id: string): Promise<IResponseWithLog<ITask[]>> {
  const cloneResult = await cloneTaskApi(id)

  return {
    data: cloneResult.data.map(transformTask),
    logId: cloneResult.logId,
  }
}
