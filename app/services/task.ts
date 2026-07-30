import { TaskModel } from '~/models/TaskModel'
import type { ITask } from '~/interfaces/domain/ITask'
import dayjs from 'dayjs'
import type { ITaskState } from '~/stores/interfaces/ITaskState'
import type { IResponseWithLog } from '~/interfaces/IResponseWithLog'
import type { ITaskCreateApiPayload } from '~/interfaces/ITaskCreateApiPayload'
import type { ITaskEditApiPayload } from '~/interfaces/ITaskEditApiPayload'
import type { ITaskMoveApiPayload } from '~/interfaces/ITaskMoveApiPayload'
import type { IUser } from '~/interfaces/domain/IUser'

export function transformTask(raw: ITask): ITaskState {
  const { $queryClient } = useNuxtApp()

  const user = $queryClient.getQueryData<IUser>(userKeys.me)

  const timezone = user?.timezone || dayjs.tz.guess()

  if (raw.dueDate && raw.dueHours != null && raw.dueMinutes != null) {
    const collectedDateTime = `${raw.dueDate}T${raw.dueHours}:${raw.dueMinutes}`
    const utcDueDate = dayjs.utc(collectedDateTime).tz(timezone)
    raw.dueDate = utcDueDate.format('YYYY-MM-DD')
    raw.dueHours = utcDueDate.hour()
    raw.dueMinutes = utcDueDate.minute()
  }

  const taskModel = new TaskModel({
    ...raw,
    deletedTime: raw.deletedTime ? dayjs.utc(raw?.deletedTime).tz(timezone).toDate() : undefined,
    createdAt: new Date(raw.createdAt),
    updatedAt: new Date(raw.updatedAt),
  })

  return {
    ...taskModel,
    tempId: (raw as any).tempClientId,
  }
}

export async function fetchTasks(boardId?: string, columnId?: string) {
  const tasks = await getTasksApi(boardId, columnId)

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
  payload: ITaskCreateApiPayload,
): Promise<IResponseWithLog<ITask[]>> {
  const newTask = await postTaskApi(payload)

  return {
    data: newTask.data.map(transformTask),
    logId: newTask.logId,
  }
}

export async function saveTask(payload: ITaskEditApiPayload): Promise<IResponseWithLog<ITask[]>> {
  const saveResult = await patchTaskApi(payload)

  return {
    data: saveResult.data.map(transformTask),
    logId: saveResult.logId,
  }
}

export async function saveTasks(
  payload: ITaskEditApiPayload[],
): Promise<IResponseWithLog<ITask[]>> {
  const saveResult = await bulkUpdateTasksApi(payload)

  return {
    data: saveResult.data.map(transformTask),
    logId: saveResult.logId,
  }
}

export async function removeTask(id: string): Promise<IResponseWithLog<null>> {
  return await deleteTaskApi(id)
}

export async function moveTask(payload: ITaskMoveApiPayload): Promise<IResponseWithLog<ITask[]>> {
  return await moveTaskApi(payload)
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
