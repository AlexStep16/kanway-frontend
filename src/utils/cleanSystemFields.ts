export function cleanSystemFields(obj: any): any {
  const cleanedObj = { ...obj }

  delete cleanedObj._id
  delete cleanedObj.id
  delete cleanedObj.createdAt
  delete cleanedObj.updatedAt
  delete cleanedObj.isDeleted

  return cleanedObj
}
