import CategoryModel from '@models/CategoryModel'
import { ICategory } from '@interfaces/domain/ICategory'
import {
  getCategoriesApi,
  postCategoryApi,
  patchCategoryApi,
  deleteCategoryApi,
  archiveCategoryApi,
  cloneCategoryApi,
  bulkUpdateCategoriesApi,
  getArchivedCategoriesApi,
  recoverCategoryApi,
  getCategoryApi,
} from '@api/categories'
import { ICategoryState } from '@stores/interfaces/ICategoryState'
import { ISingleUpdate } from '@interfaces/domain/ISingleUpdate'
import { IResponseWithLog } from '@/interfaces/IResponseWithLog'
import { ICategoryCreateApiPayload } from '@/interfaces/ICategoryCreateApiPayload'
import { pickClean } from '@/utils/pickClean'
import { ICategoryEditApiPayload } from '@/interfaces/ICategoryEditApiPayload'

const BASE_CATEGORY_FIELDS: (keyof ICategory)[] = ['name', 'order']

export function transformCategory(raw: ICategory): ICategoryState {
  const categoryModel = new CategoryModel({
    ...raw,
    deletedTime: raw.deletedTime ? new Date(raw.deletedTime) : undefined,
    createdAt: new Date(raw.createdAt),
    updatedAt: new Date(raw.updatedAt),
  })

  return {
    ...categoryModel,
    tempId: (raw as any).tempClientId,
  }
}

export async function fetchCategories(boardId?: string) {
  const categories = await getCategoriesApi(boardId)

  return categories.map(transformCategory)
}

export async function fetchCategory(id: string) {
  const categories = await getCategoryApi(id)

  return categories.map(transformCategory)[0]
}

export async function fetchArchivedCategories() {
  const categories = await getArchivedCategoriesApi()

  return categories.map(transformCategory)
}

export async function createCategory(
  payload: Partial<CategoryModel>,
  boardId: string,
  workspaceId: string,
): Promise<IResponseWithLog<ICategory[]>> {
  const cleanedCategoryFields = pickClean(payload, BASE_CATEGORY_FIELDS)

  const apiPayload: ICategoryCreateApiPayload = {
    ...cleanedCategoryFields,

    name: payload.name || 'Новая категория',
    boardId: boardId,
    workspaceId: workspaceId,
  }

  const newCategory = await postCategoryApi(apiPayload)

  return {
    data: newCategory.data.map(transformCategory),
    logId: newCategory.logId,
  }
}

export async function saveCategory(
  payload: ISingleUpdate<CategoryModel>,
): Promise<IResponseWithLog<ICategory[]>> {
  const cleanedCategoryFields = pickClean(payload, BASE_CATEGORY_FIELDS)
  const apiPayload: ICategoryEditApiPayload = {
    ...cleanedCategoryFields,
    id: payload.id,
    workspaceId: payload.workspace?.id,
    boardId: payload.board?.id,
  }

  const saveResult = await patchCategoryApi(apiPayload)

  return {
    data: saveResult.data.map(transformCategory),
    logId: saveResult.logId,
  }
}

export async function saveCategories(
  payload: ISingleUpdate<CategoryModel>[],
): Promise<IResponseWithLog<ICategory[]>> {
  const cleanedPayload: ICategoryEditApiPayload[] = payload.map((item) => ({
    ...pickClean(item, ['id', ...BASE_CATEGORY_FIELDS]),
    id: item.id,
    workspaceId: item.workspace?.id,
    boardId: item.board?.id,
  }))

  const saveResult = await bulkUpdateCategoriesApi(cleanedPayload)

  return {
    data: saveResult.data.map(transformCategory),
    logId: saveResult.logId,
  }
}

export async function removeCategory(id: string) {
  await deleteCategoryApi(id)
}

export async function archiveCategory(id: string): Promise<IResponseWithLog<ICategory[]>> {
  const archiveResult = await archiveCategoryApi(id)

  return {
    data: archiveResult.data.categories.map(transformCategory),
    logId: archiveResult.logId,
  }
}

export async function recoverCategory(id: string): Promise<IResponseWithLog<ICategory[]>> {
  const recoverResult = await recoverCategoryApi(id)

  return {
    data: recoverResult.data.categories.map(transformCategory),
    logId: recoverResult.logId,
  }
}

export async function cloneCategory(id: string) {
  const cloneResult = await cloneCategoryApi(id)

  return {
    data: cloneResult.data.categories.map(transformCategory),
    logId: cloneResult.logId,
  }
}
