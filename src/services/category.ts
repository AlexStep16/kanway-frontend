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
  moveCategoryApi,
} from '@api/categories'
import { ICategoryState } from '@stores/interfaces/ICategoryState'
import { IResponseWithLog } from '@/interfaces/IResponseWithLog'
import { ICategoryCreateApiPayload } from '@/interfaces/ICategoryCreateApiPayload'
import { ICategoryEditApiPayload } from '@/interfaces/ICategoryEditApiPayload'
import { ICategoryMoveApiPayload } from '@/interfaces/ICategoryMoveApiPayload'

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
  const category = categories.length > 0 ? categories[0] : null

  return category ? transformCategory(category) : null
}

export async function fetchArchivedCategories() {
  const categories = await getArchivedCategoriesApi()

  return categories.map(transformCategory)
}

export async function createCategory(
  payload: ICategoryCreateApiPayload,
): Promise<IResponseWithLog<ICategory[]>> {
  const newCategory = await postCategoryApi(payload)

  return {
    data: newCategory.data.map(transformCategory),
    logId: newCategory.logId,
  }
}

export async function saveCategory(
  payload: ICategoryEditApiPayload,
): Promise<IResponseWithLog<ICategory[]>> {
  const saveResult = await patchCategoryApi(payload)

  return {
    data: saveResult.data.map(transformCategory),
    logId: saveResult.logId,
  }
}

export async function saveCategories(
  payload: ICategoryEditApiPayload[],
): Promise<IResponseWithLog<ICategory[]>> {
  const saveResult = await bulkUpdateCategoriesApi(payload)

  return {
    data: saveResult.data.map(transformCategory),
    logId: saveResult.logId,
  }
}

export async function removeCategory(id: string): Promise<IResponseWithLog<null>> {
  return await deleteCategoryApi(id)
}

export async function archiveCategory(id: string): Promise<IResponseWithLog<ICategory[]>> {
  const archiveResult = await archiveCategoryApi(id)

  return {
    data: archiveResult.data.map(transformCategory),
    logId: archiveResult.logId,
  }
}

export async function moveCategory(
  payload: ICategoryMoveApiPayload,
): Promise<IResponseWithLog<ICategory[]>> {
  return await moveCategoryApi(payload)
}

export async function recoverCategory(id: string): Promise<IResponseWithLog<ICategory[]>> {
  const recoverResult = await recoverCategoryApi(id)

  return {
    data: recoverResult.data.map(transformCategory),
    logId: recoverResult.logId,
  }
}

export async function cloneCategory(id: string): Promise<IResponseWithLog<ICategory[]>> {
  const cloneResult = await cloneCategoryApi(id)

  return {
    data: cloneResult.data.map(transformCategory),
    logId: cloneResult.logId,
  }
}
