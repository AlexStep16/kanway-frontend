import { apiCall } from '@/apiClient'
import { IWorkspace } from '@interfaces/domain/IWorkspace'
import { IBoard } from '@interfaces/domain/IBoard'
import { IClonedWorkspaceResult } from '@interfaces/domain/IClonedWorkspaceResult'

export async function getWorkspacesApi() {
  return await apiCall<IWorkspace[]>({
    method: 'GET',
    url: '/workspaces',
  })
}

export async function getArchivedWorkspacesApi() {
  return await apiCall<IWorkspace[]>({
    method: 'GET',
    url: `/archive/workspaces`,
  })
}

export async function postWorkspaceApi(payload: Partial<IBoard>) {
  return await apiCall<IWorkspace[]>({
    method: 'POST',
    url: `/workspaces`,
    data: payload,
  })
}

export async function patchWorkspaceApi(workspaceId: string, payload: Partial<IBoard>) {
  return await apiCall<IWorkspace[]>({
    method: 'PATCH',
    url: `/workspaces/${workspaceId}`,
    data: payload,
  })
}

export async function deleteWorkspaceApi(workspaceId: string) {
  return await apiCall<void>({
    method: 'DELETE',
    url: `/workspaces/${workspaceId}`,
  })
}

export async function archiveWorkspaceApi(workspaceId: string) {
  return await apiCall<IWorkspace[]>({
    method: 'PATCH',
    url: `/workspaces/${workspaceId}/archive`,
  })
}

export async function recoverWorkspaceApi(workspaceId: string) {
  return await apiCall<IWorkspace[]>({
    method: 'PATCH',
    url: `/workspaces/${workspaceId}/recover`,
  })
}

export async function cloneWorkspaceApi(workspaceId: string) {
  return await apiCall<IClonedWorkspaceResult>({
    method: 'POST',
    url: `/workspaces/${workspaceId}/clone`,
  })
}
