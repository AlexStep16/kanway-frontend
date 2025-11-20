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
} from '@api/tasks'
import dayjs from 'dayjs'
import { ITaskState } from '@stores/interfaces/ITaskState'
import { ISingleUpdate } from '@/interfaces/domain/ISingleUpdate'
import { useAuthStore } from '@stores/auth'

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

export async function fetchTasks(workspaceId: string, boardId: string) {
  const tasks = await getTasksApi(workspaceId, boardId)

  return tasks.map(transformTask)
}

export async function fetchArchivedTasks() {
  const tasks = await getArchivedTasksApi()

  return tasks.map(transformTask)
}

export async function createTask(
  payload: Partial<TaskModel>,
  boardId: string,
  workspaceId: string,
) {
  const newTask = await postTaskApi(payload, workspaceId, boardId)

  return newTask.map(transformTask)
}

export async function saveTask(
  workspaceId: string,
  boardId: string,
  payload: ISingleUpdate<TaskModel>,
) {
  const saveResult = await patchTaskApi(workspaceId, boardId, payload.id, payload)

  return saveResult.map(transformTask)
}

export async function saveTasks(
  workspaceId: string,
  boardId: string,
  payload: ISingleUpdate<TaskModel>[],
) {
  const saveResult = await bulkUpdateTasksApi(workspaceId, boardId, payload)

  return saveResult.map(transformTask)
}

export async function removeTask(taskId: string, workspaceId: string, boardId: string) {
  await deleteTaskApi(workspaceId, boardId, taskId)
}

export async function archiveTask(taskId: string, workspaceId: string, boardId: string) {
  const archiveResult = await archiveTaskApi(workspaceId, boardId, taskId)

  return archiveResult.map(transformTask)
}

export async function recoverTask(taskId: string, workspaceId: string, boardId: string) {
  const recoverResult = await recoverTaskApi(workspaceId, boardId, taskId)

  return recoverResult.map(transformTask)
}

export async function cloneTask(taskId: string, workspaceId: string, boardId: string) {
  const cloneResult = await cloneTaskApi(workspaceId, boardId, taskId)

  return cloneResult.map(transformTask)
}
