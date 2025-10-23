import { apiCall } from '@/apiClient'
import CategoryRaw from '@interfaces/CategoryRaw'
import { CRUDResponse } from '@/interfaces/CRUDResponse'

export async function getCategoriesApi(workspaceId: string, boardId: string) {
  return await apiCall<CategoryRaw[]>({
    method: 'GET',
    url: `/workspace/${workspaceId}/categories/${boardId}`,
  })
}

export async function postCategoryApi(payload: Partial<CategoryRaw>, workspaceId: string) {
  return await apiCall<CRUDResponse<CategoryRaw>>({
    method: 'POST',
    url: `/workspace/${workspaceId}/categories`,
    data: payload,
  })
}

export async function putCategoryApi(
  workspaceId: string,
  categoryId: string,
  payload: Partial<CategoryRaw>,
) {
  return await apiCall<CategoryRaw[]>({
    method: 'PUT',
    url: `/workspace/${workspaceId}/categories/${categoryId}`,
    data: payload,
  })
}

export async function deleteCategoryApi(categoryId: string, workspaceId: string) {
  return await apiCall<void>({
    method: 'DELETE',
    url: `/workspace/${workspaceId}/categories/${categoryId}`,
  })
}

export async function archiveCategoryApi(categoryId: string, workspaceId: string) {
  return await apiCall<CategoryRaw[]>({
    method: 'POST',
    url: `/workspace/${workspaceId}/categories/${categoryId}/archive`,
  })
}

export async function cloneCategoryApi(categoryId: string, workspaceId: string) {
  return await apiCall<CRUDResponse<CategoryRaw>>({
    method: 'PUT',
    url: `/workspace/${workspaceId}/categories/clone/${categoryId}`,
  })
}
