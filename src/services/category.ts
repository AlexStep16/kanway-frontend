import CategoryModel from '@models/CategoryModel'
import CategoryRaw from '@interfaces/CategoryRaw'
import {
  getCategoriesApi,
  postCategoryApi,
  putCategoryApi,
  deleteCategoryApi,
  archiveCategoryApi,
  cloneCategoryApi,
} from '@api/categories'
import { toSnakeCaseKeys } from '@utils/objectTransformers'
import { cleanSystemFields } from '@utils/cleanSystemFields'

export function transformCategory(raw: CategoryRaw): CategoryModel {
  return new CategoryModel({
    id: raw._id,
    name: raw.name,
    boardId: raw.board_id,
    order: raw.order,
    isDeleted: raw.is_deleted,
    createdAt: new Date(raw.createdAt),
    updatedAt: new Date(raw.updatedAt),
  })
}

export async function fetchCategories(workspaceId: string, boardId: string) {
  const categories = await getCategoriesApi(workspaceId, boardId)

  return categories.map(transformCategory)
}

export async function createCategory(payload: Partial<CategoryModel>, workspaceId: string) {
  const apiPayload = toSnakeCaseKeys(cleanSystemFields(payload))
  const newCategory = await postCategoryApi(apiPayload, workspaceId)

  return newCategory.result.map(transformCategory)
}

export async function saveCategory(
  workspaceId: string,
  payload: Partial<CategoryModel> & { id: string },
) {
  const apiPayload = toSnakeCaseKeys(cleanSystemFields(payload))
  const saveResult = await putCategoryApi(workspaceId, payload.id, apiPayload)

  return saveResult.map(transformCategory)
}

export async function removeCategory(categoryId: string, workspaceId: string) {
  await deleteCategoryApi(categoryId, workspaceId)
}

export async function archiveCategory(categoryId: string, workspaceId: string) {
  const archiveResult = await archiveCategoryApi(categoryId, workspaceId)

  return archiveResult.map(transformCategory)
}

export async function cloneCategory(categoryId: string, workspaceId: string) {
  const cloneResult = await cloneCategoryApi(categoryId, workspaceId)

  return cloneResult.result.map(transformCategory)
}
