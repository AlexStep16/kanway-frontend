import { apiCall } from '@/apiClient'
import ICategory from '@models/CategoryModel'
import { CRUDResponse } from '@/interfaces/CRUDResponse'

export async function getCategoriesApi(workspaceId: string, boardId: string) {
  return await apiCall<ICategory[]>({
    method: 'GET',
    url: `/workspaces/${workspaceId}/categories/${boardId}`,
  })
}

export async function postCategoryApi(payload: Partial<ICategory>, workspaceId: string) {
  return await apiCall<CRUDResponse<ICategory>>({
    method: 'POST',
    url: `/workspaces/${workspaceId}/categories`,
    data: payload,
  })
}

export async function putCategoryApi(
  workspaceId: string,
  categoryId: string,
  payload: Partial<ICategory>,
) {
  return await apiCall<ICategory[]>({
    method: 'PUT',
    url: `/workspaces/${workspaceId}/categories/${categoryId}`,
    data: payload,
  })
}

export async function deleteCategoryApi(categoryId: string, workspaceId: string) {
  return await apiCall<void>({
    method: 'DELETE',
    url: `/workspaces/${workspaceId}/categories/${categoryId}`,
  })
}

export async function archiveCategoryApi(categoryId: string, workspaceId: string) {
  return await apiCall<ICategory[]>({
    method: 'POST',
    url: `/workspaces/${workspaceId}/categories/${categoryId}/archive`,
  })
}

export async function cloneCategoryApi(categoryId: string, workspaceId: string) {
  return await apiCall<CRUDResponse<ICategory>>({
    method: 'PUT',
    url: `/workspaces3/${workspaceId}/categories/clone/${categoryId}`,
  })
}
