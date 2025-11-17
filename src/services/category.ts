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
) {
  const newCategory = await postCategoryApi(payload, workspaceId, boardId)

  return newCategory.map(transformCategory)
}

export async function saveCategory(
  workspaceId: string,
  boardId: string,
  payload: Partial<CategoryModel> & { id: string },
) {
  const saveResult = await patchCategoryApi(workspaceId, boardId, payload.id, payload)

  return saveResult.map(transformCategory)
}

export async function saveCategories(
  workspaceId: string,
  boardId: string,
  payload: ISingleUpdate<CategoryModel>[],
) {
  const saveResult = await bulkUpdateCategoriesApi(workspaceId, boardId, payload)

  return saveResult.map(transformCategory)
}

export async function removeCategory(categoryId: string, workspaceId: string, boardId: string) {
  await deleteCategoryApi(categoryId, workspaceId, boardId)
}

export async function archiveCategory(categoryId: string, workspaceId: string, boardId: string) {
  const archiveResult = await archiveCategoryApi(categoryId, boardId, workspaceId)

  return archiveResult.map(transformCategory)
}

export async function recoverCategory(categoryId: string, workspaceId: string, boardId: string) {
  const recoverResult = await recoverCategoryApi(categoryId, boardId, workspaceId)

  return recoverResult.map(transformCategory)
}

export async function cloneCategory(categoryId: string, workspaceId: string, boardId: string) {
  const cloneResult = await cloneCategoryApi(categoryId, boardId, workspaceId)

  useTaskDataStore().integrateTasks(cloneResult.tasks)

  return cloneResult.categories.map(transformCategory)
}
