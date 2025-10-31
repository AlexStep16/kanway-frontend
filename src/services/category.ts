import CategoryModel from '@models/CategoryModel'
import ICategory from '@models/CategoryModel'
import {
  getCategoriesApi,
  postCategoryApi,
  patchCategoryApi,
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

export async function removeCategory(categoryId: string, workspaceId: string, boardId: string) {
  await deleteCategoryApi(categoryId, workspaceId, boardId)
}

export async function archiveCategory(categoryId: string, workspaceId: string, boardId: string) {
  const archiveResult = await archiveCategoryApi(categoryId, boardId, workspaceId)

  return archiveResult.map(transformCategory)
}

export async function cloneCategory(categoryId: string, workspaceId: string, boardId: string) {
  const cloneResult = await cloneCategoryApi(categoryId, boardId, workspaceId)

  return transformCategory(cloneResult)
}
