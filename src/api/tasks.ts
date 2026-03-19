import { apiCall } from '@/apiClient'
import { ISingleUpdate } from '@/interfaces/domain/ISingleUpdate'
import { IResponseWithLog } from '@/interfaces/IResponseWithLog'
import { ITask } from '@interfaces/domain/ITask'
import { ITaskCreateApiPayload } from '@/interfaces/ITaskCreateApiPayload'
import { ITaskEditApiPayload } from '@/interfaces/ITaskEditApiPayload'
import { ITaskMoveApiPayload } from '@/interfaces/ITaskMoveApiPayload'

export async function getTasksApi(boardId?: string, categoryId?: string) {
  let queryParams = boardId ? `?boardId=${boardId}` : ''

  if (categoryId) {
    queryParams += boardId ? `&categoryId=${categoryId}` : `?categoryId=${categoryId}`
  }

  return await apiCall<ITask[]>({
    method: 'GET',
    url: `/tasks${queryParams}`,
  })
}

export async function getTaskApi(id: string) {
  return await apiCall<ITask[]>({
    method: 'GET',
    url: `/tasks/${id}`,
  })
}

export async function getArchivedTasksApi() {
  return await apiCall<ITask[]>({
    method: 'GET',
    url: `/archive/tasks`,
  })
}

export async function postTaskApi(payload: ITaskCreateApiPayload) {
  return await apiCall<IResponseWithLog<ITask[]>>({
    method: 'POST',
    url: `/tasks`,
    data: payload,
  })
}

export async function patchTaskApi(payload: ITaskEditApiPayload) {
  return await apiCall<IResponseWithLog<ITask[]>>({
    method: 'PATCH',
    url: `/tasks/${payload.id}`,
    data: payload,
  })
}

export async function moveTaskApi(payload: ITaskMoveApiPayload) {
  return await apiCall<IResponseWithLog<ITask[]>>({
    method: 'PATCH',
    url: `/tasks/move`,
    data: payload,
  })
}

export async function bulkUpdateTasksApi(payload: ISingleUpdate<ITask>[]) {
  return await apiCall<IResponseWithLog<ITask[]>>({
    method: 'PATCH',
    url: `/tasks/bulk`,
    data: payload,
  })
}

export async function deleteTaskApi(id: string) {
  return await apiCall<IResponseWithLog<null>>({
    method: 'DELETE',
    url: `/tasks/${id}`,
  })
}

export async function archiveTaskApi(id: string) {
  return await apiCall<IResponseWithLog<ITask[]>>({
    method: 'PATCH',
    url: `/tasks/${id}/archive`,
  })
}

export async function recoverTaskApi(id: string) {
  return await apiCall<IResponseWithLog<ITask[]>>({
    method: 'PATCH',
    url: `/tasks/${id}/recover`,
  })
}

export async function cloneTaskApi(id: string) {
  return await apiCall<IResponseWithLog<ITask[]>>({
    method: 'POST',
    url: `/tasks/${id}/clone`,
  })
}
