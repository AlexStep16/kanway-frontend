import { apiCall } from '@/apiClient'
import { ISingleUpdate } from '@/interfaces/domain/ISingleUpdate'
import { ITask } from '@interfaces/domain/ITask'
import dayjs from 'dayjs'

export async function getTasksApi(workspaceId: string, boardId: string) {
  return await apiCall<ITask[]>({
    method: 'GET',
    url: `/workspaces/${workspaceId}/boards/${boardId}/tasks`,
  })
}

export async function getArchivedTasksApi() {
  return await apiCall<ITask[]>({
    method: 'GET',
    url: `/archive/tasks`,
  })
}

export async function postTaskApi(payload: Partial<ITask>, workspaceId: string, boardId: string) {
  return await apiCall<ITask[]>({
    method: 'POST',
    url: `/workspaces/${workspaceId}/boards/${boardId}/tasks`,
    data: payload,
  })
}

export async function patchTaskApi(
  workspaceId: string,
  boardId: string,
  taskId: string,
  payload: Partial<ITask>,
) {
  return await apiCall<ITask[]>({
    method: 'PATCH',
    url: `/workspaces/${workspaceId}/boards/${boardId}/tasks/${taskId}`,
    data: {
      ...payload,
      timezone: dayjs.tz.guess(),
    },
  })
}

export async function bulkUpdateTasksApi(
  workspaceId: string,
  boardId: string,
  payload: ISingleUpdate<ITask>[],
) {
  const timezone = dayjs.tz.guess()
  const data = payload.map((item) => ({
    ...item,
    timezone,
  }))

  return await apiCall<ITask[]>({
    method: 'PATCH',
    url: `/workspaces/${workspaceId}/boards/${boardId}/tasks/bulk`,
    data,
  })
}

export async function deleteTaskApi(workspaceId: string, boardId: string, taskId: string) {
  return await apiCall<void>({
    method: 'DELETE',
    url: `/workspaces/${workspaceId}/boards/${boardId}/tasks/${taskId}`,
  })
}

export async function archiveTaskApi(workspaceId: string, boardId: string, taskId: string) {
  return await apiCall<ITask[]>({
    method: 'PATCH',
    url: `/workspaces/${workspaceId}/boards/${boardId}/tasks/${taskId}/archive`,
  })
}

export async function recoverTaskApi(workspaceId: string, boardId: string, taskId: string) {
  return await apiCall<ITask[]>({
    method: 'PATCH',
    url: `/workspaces/${workspaceId}/boards/${boardId}/tasks/${taskId}/recover`,
  })
}

export async function cloneTaskApi(workspaceId: string, boardId: string, taskId: string) {
  return await apiCall<ITask[]>({
    method: 'POST',
    url: `/workspaces/${workspaceId}/boards/${boardId}/tasks/${taskId}/clone`,
  })
}
