type CleanPick<T, K extends keyof T> = {
  [P in K]?: NonNullable<T[P]>
}

export function pickClean<T, K extends keyof T>(obj: T, keys: K[]): CleanPick<T, K> {
  const result = {} as CleanPick<T, K>

  keys.forEach((key) => {
    const value = obj[key]

    if (value !== null && value !== undefined) {
      result[key] = value as NonNullable<T[typeof key]>
    }
  })

  return result
}
