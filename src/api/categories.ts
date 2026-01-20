import { apiCall } from '@/apiClient'
import { IClonedCategoryResult } from '@interfaces/domain/IClonedCategoryResult'
import { ICategory } from '@interfaces/domain/ICategory'
import { ISingleUpdate } from '@interfaces/domain/ISingleUpdate'
import { ICategoriesWithChildrenResponse } from '@/interfaces/ICategoriesWithChildrenResponse'
import { IResponseWithLog } from '@/interfaces/IResponseWithLog'
import { ICategoryCreateApiPayload } from '@/interfaces/ICategoryCreateApiPayload'

export async function getCategoriesApi(boardId?: string) {
  const queryParams = boardId ? `?boardId=${boardId}` : ''

  return await apiCall<ICategory[]>({
    method: 'GET',
    url: `/categories${queryParams}`,
  })
}

export async function getCategoryApi(id: string) {
  return await apiCall<ICategory[]>({
    method: 'GET',
    url: `/categories/${id}`,
  })
}

export async function getArchivedCategoriesApi() {
  return await apiCall<ICategory[]>({
    method: 'GET',
    url: `/archive/categories`,
  })
}

export async function postCategoryApi(payload: ICategoryCreateApiPayload) {
  return await apiCall<IResponseWithLog<ICategory[]>>({
    method: 'POST',
    url: `/categories`,
    data: payload,
  })
}

export async function patchCategoryApi(payload: ISingleUpdate<ICategory>) {
  return await apiCall<IResponseWithLog<ICategory[]>>({
    method: 'PATCH',
    url: `/categories/${payload.id}`,
    data: payload,
  })
}

export async function bulkUpdateCategoriesApi(payload: ISingleUpdate<ICategory>[]) {
  return await apiCall<IResponseWithLog<ICategory[]>>({
    method: 'PATCH',
    url: `/categories/bulk`,
    data: payload,
  })
}

export async function deleteCategoryApi(id: string) {
  return await apiCall<void>({
    method: 'DELETE',
    url: `/categories/${id}`,
  })
}

export async function archiveCategoryApi(id: string) {
  return await apiCall<IResponseWithLog<ICategoriesWithChildrenResponse>>({
    method: 'PATCH',
    url: `/categories/${id}/archive`,
  })
}

export async function recoverCategoryApi(id: string) {
  return await apiCall<IResponseWithLog<ICategoriesWithChildrenResponse>>({
    method: 'PATCH',
    url: `/categories/${id}/recover`,
  })
}

export async function cloneCategoryApi(id: string) {
  return await apiCall<IResponseWithLog<IClonedCategoryResult>>({
    method: 'POST',
    url: `/categories/${id}/clone`,
  })
}
