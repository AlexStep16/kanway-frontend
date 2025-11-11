import WorkspaceModel from '@/models/WorkspaceModel'
import { IWorkspace } from '@interfaces/domain/IWorkspace'
import {
  archiveWorkspaceApi,
  cloneWorkspaceApi,
  deleteWorkspaceApi,
  getWorkspacesApi,
  postWorkspaceApi,
  patchWorkspaceApi,
} from '@api/workspaces'
import { useBoardDataStore } from '@stores/boardData'
import { useCategoryDataStore } from '@stores/categoryData'
import { useTaskDataStore } from '@stores/taskData'

export function transformWorkspace(raw: IWorkspace): WorkspaceModel {
  return new WorkspaceModel({
    ...raw,
    createdAt: new Date(raw.createdAt),
    updatedAt: new Date(raw.updatedAt),
  })
}

export async function fetchWorkspaces() {
  const workspaces = await getWorkspacesApi()

  return workspaces.map(transformWorkspace)
}

export async function createWorkspace(payload: Partial<WorkspaceModel>) {
  const newWorkspace = await postWorkspaceApi(payload)

  return newWorkspace.map(transformWorkspace)
}

export async function saveWorkspace(payload: Partial<WorkspaceModel> & { id: string }) {
  const saveResult = await patchWorkspaceApi(payload.id, payload)

  return saveResult.map(transformWorkspace)
}

export async function removeWorkspace(workspaceId: string) {
  await deleteWorkspaceApi(workspaceId)
}

export async function archiveWorkspace(workspaceId: string) {
  const archiveResult = await archiveWorkspaceApi(workspaceId)

  return archiveResult.map(transformWorkspace)
}

export async function cloneWorkspace(workspaceId: string) {
  const cloneResult = await cloneWorkspaceApi(workspaceId)

  useBoardDataStore().integrateBoards(cloneResult.boards)
  useCategoryDataStore().integrateCategories(cloneResult.categories)
  useTaskDataStore().integrateTasks(cloneResult.tasks)

  return cloneResult.workspaces.map(transformWorkspace)
}
