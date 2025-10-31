import { apiCall } from '@/apiClient'
import ICategory from '@models/CategoryModel'

export async function getCategoriesApi(workspaceId: string, boardId: string) {
  return await apiCall<ICategory[]>({
    method: 'GET',
    url: `/workspaces/${workspaceId}/boards/${boardId}/categories`,
  })
}

export async function postCategoryApi(
  payload: Partial<ICategory>,
  workspaceId: string,
  boardId: string,
) {
  return await apiCall<ICategory[]>({
    method: 'POST',
    url: `/workspaces/${workspaceId}/boards/${boardId}/categories`,
    data: payload,
  })
}

export async function patchCategoryApi(
  workspaceId: string,
  boardId: string,
  categoryId: string,
  payload: Partial<ICategory>,
) {
  return await apiCall<ICategory[]>({
    method: 'PATCH',
    url: `/workspaces/${workspaceId}/boards/${boardId}/categories/${categoryId}`,
    data: payload,
  })
}

export async function deleteCategoryApi(categoryId: string, workspaceId: string, boardId: string) {
  return await apiCall<void>({
    method: 'DELETE',
    url: `/workspaces/${workspaceId}/boards/${boardId}/categories/${categoryId}`,
  })
}

export async function archiveCategoryApi(categoryId: string, boardId: string, workspaceId: string) {
  return await apiCall<ICategory[]>({
    method: 'PATCH',
    url: `/workspaces/${workspaceId}/boards/${boardId}/categories/${categoryId}/archive`,
  })
}

export async function cloneCategoryApi(categoryId: string, boardId: string, workspaceId: string) {
  return await apiCall<ICategory>({
    method: 'POST',
    url: `/workspaces/${workspaceId}/boards/${boardId}/categories/clone/${categoryId}`,
  })
}
