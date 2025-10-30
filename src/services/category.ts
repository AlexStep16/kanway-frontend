import CategoryModel from '@models/CategoryModel'
import ICategory from '@models/CategoryModel'
import {
  getCategoriesApi,
  postCategoryApi,
  putCategoryApi,
  deleteCategoryApi,
  archiveCategoryApi,
  cloneCategoryApi,
} from '@api/categories'

export function transformCategory(raw: ICategory): CategoryModel {
  return new CategoryModel({
    ...raw,
    createdAt: new Date(raw.createdAt),
    updatedAt: new Date(raw.updatedAt),
  })
}

export async function fetchCategories(workspaceId: string, boardId: string) {
  const categories = await getCategoriesApi(workspaceId, boardId)

  return categories.map(transformCategory)
}

export async function createCategory(payload: Partial<CategoryModel>, workspaceId: string) {
  const newCategory = await postCategoryApi(payload, workspaceId)

  return newCategory.result.map(transformCategory)
}

export async function saveCategory(
  workspaceId: string,
  payload: Partial<CategoryModel> & { id: string },
) {
  const saveResult = await putCategoryApi(workspaceId, payload.id, payload)

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
