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
} from '@api/categories'
import { ICategoryState } from '@stores/interfaces/ICategoryState'
import { useTaskDataStore } from '@stores/taskData'
import { ISingleUpdate } from '@interfaces/domain/ISingleUpdate'
import { IResponseWithLog } from '@/interfaces/IResponseWithLog'

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

export async function fetchCategories(workspaceId: string, boardId: string) {
  const categories = await getCategoriesApi(workspaceId, boardId)

  return categories.map(transformCategory)
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
  const newCategory = await postCategoryApi(payload, workspaceId, boardId)

  return {
    data: newCategory.data.map(transformCategory),
    logId: newCategory.logId,
  }
}

export async function saveCategory(
  workspaceId: string,
  boardId: string,
  payload: Partial<CategoryModel> & { id: string },
): Promise<IResponseWithLog<ICategory[]>> {
  const saveResult = await patchCategoryApi(workspaceId, boardId, payload.id, payload)

  return {
    data: saveResult.data.map(transformCategory),
    logId: saveResult.logId,
  }
}

export async function saveCategories(
  workspaceId: string,
  boardId: string,
  payload: ISingleUpdate<CategoryModel>[],
): Promise<IResponseWithLog<ICategory[]>> {
  const saveResult = await bulkUpdateCategoriesApi(workspaceId, boardId, payload)

  return {
    data: saveResult.data.map(transformCategory),
    logId: saveResult.logId,
  }
}

export async function removeCategory(categoryId: string, workspaceId: string, boardId: string) {
  await deleteCategoryApi(categoryId, workspaceId, boardId)
}

export async function archiveCategory(
  categoryId: string,
  workspaceId: string,
  boardId: string,
): Promise<IResponseWithLog<ICategory[]>> {
  const archiveResult = await archiveCategoryApi(categoryId, boardId, workspaceId)

  useTaskDataStore().integrateTasks(archiveResult.data.tasks)

  return {
    data: archiveResult.data.categories.map(transformCategory),
    logId: archiveResult.logId,
  }
}

export async function recoverCategory(
  categoryId: string,
  workspaceId: string,
  boardId: string,
): Promise<IResponseWithLog<ICategory[]>> {
  const recoverResult = await recoverCategoryApi(categoryId, boardId, workspaceId)

  useTaskDataStore().integrateTasks(recoverResult.data.tasks)

  return {
    data: recoverResult.data.categories.map(transformCategory),
    logId: recoverResult.logId,
  }
}

export async function cloneCategory(categoryId: string, workspaceId: string, boardId: string) {
  const cloneResult = await cloneCategoryApi(categoryId, boardId, workspaceId)

  useTaskDataStore().integrateTasks(cloneResult.data.tasks)

  return {
    data: cloneResult.data.categories.map(transformCategory),
    logId: cloneResult.logId,
  }
}
