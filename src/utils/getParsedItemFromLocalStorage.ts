export function getParsedItemFromLocalStorage<T>(key: string): T | null {
  if (typeof localStorage === 'undefined') {
    return null
  }

  const item = localStorage.getItem(key)

  if (!item) {
    return null
  }

  try {
    return JSON.parse(item) as T
  } catch (error) {
    console.error(`Error parsing localStorage item with key "${key}":`, error)
    return null
  }
}
