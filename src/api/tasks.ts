import { apiCall } from '@/apiClient'
import { ISingleUpdate } from '@/interfaces/domain/ISingleUpdate'
import { ITasksResponse } from '@/interfaces/ITasksResponse'
import { IResponseWithLog } from '@/interfaces/IResponseWithLog'
import { ITask } from '@interfaces/domain/ITask'

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
  return await apiCall<IResponseWithLog<ITask[]>>({
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
  return await apiCall<IResponseWithLog<ITask[]>>({
    method: 'PATCH',
    url: `/workspaces/${workspaceId}/boards/${boardId}/tasks/${taskId}`,
    data: payload,
  })
}

export async function bulkUpdateTasksApi(
  workspaceId: string,
  boardId: string,
  payload: ISingleUpdate<IResponseWithLog<ITask>>[],
) {
  return await apiCall<IResponseWithLog<ITask[]>>({
    method: 'PATCH',
    url: `/workspaces/${workspaceId}/boards/${boardId}/tasks/bulk`,
    data: payload,
  })
}

export async function deleteTaskApi(workspaceId: string, boardId: string, taskId: string) {
  return await apiCall<void>({
    method: 'DELETE',
    url: `/workspaces/${workspaceId}/boards/${boardId}/tasks/${taskId}`,
  })
}

export async function archiveTaskApi(workspaceId: string, boardId: string, taskId: string) {
  return await apiCall<IResponseWithLog<ITasksResponse>>({
    method: 'PATCH',
    url: `/workspaces/${workspaceId}/boards/${boardId}/tasks/${taskId}/archive`,
  })
}

export async function recoverTaskApi(workspaceId: string, boardId: string, taskId: string) {
  return await apiCall<IResponseWithLog<ITasksResponse>>({
    method: 'PATCH',
    url: `/workspaces/${workspaceId}/boards/${boardId}/tasks/${taskId}/recover`,
  })
}

export async function cloneTaskApi(workspaceId: string, boardId: string, taskId: string) {
  return await apiCall<IResponseWithLog<ITask[]>>({
    method: 'POST',
    url: `/workspaces/${workspaceId}/boards/${boardId}/tasks/${taskId}/clone`,
  })
}
