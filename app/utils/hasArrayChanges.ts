export function hasArrayChanges(arr1?: string[], arr2?: string[]) {
  if (!arr1 && !arr2) return false
  if (!arr1 || !arr2) return true
  if (arr1.length !== arr2.length) return true

  const sorted1 = [...arr1].sort()
  const sorted2 = [...arr2].sort()

  return sorted1.some((val, index) => val != sorted2[index])
}
