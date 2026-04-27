import { apiCall } from '@/apiClient'
import { IWorkspace } from '@interfaces/domain/IWorkspace'
import { IResponseWithLog } from '@/interfaces/IResponseWithLog'
import { ISingleUpdate } from '@interfaces/domain/ISingleUpdate'
import { WelcomePayload } from '@/interfaces/WelcomePayload'

export async function getWorkspacesApi() {
  return await apiCall<IWorkspace[]>({
    method: 'GET',
    url: '/workspaces',
  })
}

export async function getWorkspaceApi(id: string) {
  return await apiCall<IWorkspace[]>({
    method: 'GET',
    url: `/workspaces/${id}`,
  })
}

export async function getWorkspacesCountApi() {
  return await apiCall<number>({
    method: 'GET',
    url: `/workspaces/count`,
  })
}

export async function getArchivedWorkspacesApi() {
  return await apiCall<IWorkspace[]>({
    method: 'GET',
    url: `/archive/workspaces`,
  })
}

export async function postWorkspaceApi(payload: Partial<IWorkspace>) {
  return await apiCall<IResponseWithLog<IWorkspace[]>>({
    method: 'POST',
    url: `/workspaces`,
    data: payload,
  })
}

export async function patchWorkspaceApi(
  workspaceId: string,
  payload: ISingleUpdate<Partial<IWorkspace>>,
) {
  return await apiCall<IResponseWithLog<IWorkspace[]>>({
    method: 'PATCH',
    url: `/workspaces/${workspaceId}`,
    data: payload,
  })
}

export async function deleteWorkspaceApi(workspaceId: string) {
  return await apiCall<IResponseWithLog<null>>({
    method: 'DELETE',
    url: `/workspaces/${workspaceId}`,
  })
}

export async function archiveWorkspaceApi(workspaceId: string) {
  return await apiCall<IResponseWithLog<IWorkspace[]>>({
    method: 'PATCH',
    url: `/workspaces/${workspaceId}/archive`,
  })
}

export async function recoverWorkspaceApi(workspaceId: string) {
  return await apiCall<IResponseWithLog<IWorkspace[]>>({
    method: 'PATCH',
    url: `/workspaces/${workspaceId}/recover`,
  })
}

export async function cloneWorkspaceApi(workspaceId: string) {
  return await apiCall<IResponseWithLog<IWorkspace[]>>({
    method: 'POST',
    url: `/workspaces/${workspaceId}/clone`,
  })
}

export async function welcomeApi(payload: WelcomePayload) {
  return await apiCall<IWorkspace>({
    method: 'POST',
    url: `/workspaces/welcome`,
    data: payload,
  })
}
