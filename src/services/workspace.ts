import WorkspaceModel from '@/models/WorkspaceModel'
import { IWorkspace } from '@interfaces/domain/IWorkspace'
import {
  archiveWorkspaceApi,
  cloneWorkspaceApi,
  deleteWorkspaceApi,
  getWorkspacesApi,
  postWorkspaceApi,
  patchWorkspaceApi,
  getArchivedWorkspacesApi,
  recoverWorkspaceApi,
} from '@api/workspaces'
import { useBoardDataStore } from '@stores/boardData'
import { useCategoryDataStore } from '@stores/categoryData'
import { useTaskDataStore } from '@stores/taskData'
import { IResponseWithLog } from '@/interfaces/IResponseWithLog'

export function transformWorkspace(raw: IWorkspace): WorkspaceModel {
  return new WorkspaceModel({
    ...raw,
    deletedTime: raw.deletedTime ? new Date(raw.deletedTime) : undefined,
    createdAt: new Date(raw.createdAt),
    updatedAt: new Date(raw.updatedAt),
  })
}

export async function fetchWorkspaces() {
  const workspaces = await getWorkspacesApi()

  return workspaces.map(transformWorkspace)
}

export async function fetchArchivedWorkspaces() {
  const workspaces = await getArchivedWorkspacesApi()

  return workspaces.map(transformWorkspace)
}

export async function createWorkspace(
  payload: Partial<WorkspaceModel>,
): Promise<IResponseWithLog<IWorkspace[]>> {
  const newWorkspace = await postWorkspaceApi(payload)

  return {
    data: newWorkspace.data.map(transformWorkspace),
    logId: newWorkspace.logId,
  }
}

export async function saveWorkspace(
  payload: Partial<WorkspaceModel> & { id: string },
): Promise<IResponseWithLog<IWorkspace[]>> {
  const saveResult = await patchWorkspaceApi(payload.id, payload)

  return {
    data: saveResult.data.map(transformWorkspace),
    logId: saveResult.logId,
  }
}

export async function removeWorkspace(workspaceId: string) {
  await deleteWorkspaceApi(workspaceId)
}

export async function archiveWorkspace(
  workspaceId: string,
): Promise<IResponseWithLog<IWorkspace[]>> {
  const archiveResult = await archiveWorkspaceApi(workspaceId)

  useBoardDataStore().integrateBoards(archiveResult.data.boards)
  useCategoryDataStore().integrateCategories(archiveResult.data.categories)
  useTaskDataStore().integrateTasks(archiveResult.data.tasks)

  return {
    data: archiveResult.data.workspaces.map(transformWorkspace),
    logId: archiveResult.logId,
  }
}

export async function recoverWorkspace(
  workspaceId: string,
): Promise<IResponseWithLog<IWorkspace[]>> {
  const recoverResult = await recoverWorkspaceApi(workspaceId)

  useBoardDataStore().integrateBoards(recoverResult.data.boards)
  useCategoryDataStore().integrateCategories(recoverResult.data.categories)
  useTaskDataStore().integrateTasks(recoverResult.data.tasks)

  return {
    data: recoverResult.data.workspaces.map(transformWorkspace),
    logId: recoverResult.logId,
  }
}

export async function cloneWorkspace(workspaceId: string): Promise<IResponseWithLog<IWorkspace[]>> {
  const cloneResult = await cloneWorkspaceApi(workspaceId)

  useBoardDataStore().integrateBoards(cloneResult.data.boards)
  useCategoryDataStore().integrateCategories(cloneResult.data.categories)
  useTaskDataStore().integrateTasks(cloneResult.data.tasks)

  return {
    data: cloneResult.data.workspaces.map(transformWorkspace),
    logId: cloneResult.logId,
  }
}
