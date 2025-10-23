/**
 * Преобразует объект с ключами из camelCase в snake_case.
 * Рекурсивно обрабатывает вложенные объекты и массивы.
 */
function camelToSnakeCase(str: string): string {
  // Простая реализация: ищем заглавную букву и вставляем подчеркивание
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
}

export function toSnakeCaseKeys(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map((v) => toSnakeCaseKeys(v))
  }
  if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((acc, key) => {
      const snakeKey = camelToSnakeCase(key)
      acc[snakeKey] = toSnakeCaseKeys(obj[key])

      return acc
    }, {} as any)
  }
  return obj
}
