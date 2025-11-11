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
} from '@api/tasks'
import dayjs from 'dayjs'
import { ITaskState } from '@stores/interfaces/ITaskState'
import { ISingleUpdate } from '@/interfaces/domain/ISingleUpdate'

export function transformTask(raw: ITask): ITaskState {
  if (raw.dueDate && raw.dueHours != null && raw.dueMinutes != null) {
    const collectedDateTime = `${raw.dueDate}T${raw.dueHours}:${raw.dueMinutes}`
    const utcDueDate = dayjs.utc(collectedDateTime).tz(dayjs.tz.guess())

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
  bulkUpdateTasksApi(workspaceId, boardId, payload)
  const saveResult = await bulkUpdateTasksApi(workspaceId, boardId, payload)
  return saveResult.map(transformTask)
}

export async function removeTask(taskId: string, workspaceId: string, boardId: string) {
  await deleteTaskApi(taskId, workspaceId, boardId)
}

export async function archiveTask(taskId: string, workspaceId: string, boardId: string) {
  const archiveResult = await archiveTaskApi(workspaceId, boardId, taskId)

  return archiveResult.map(transformTask)
}

export async function cloneTask(taskId: string, workspaceId: string, boardId: string) {
  const cloneResult = await cloneTaskApi(workspaceId, boardId, taskId)

  return cloneResult.map(transformTask)
}
