type SelectionResult = {
  isSelected: any
  id: any
}

export function findAllSelections(data: any, results: SelectionResult[] = []): SelectionResult[] {
  if (typeof data !== 'object' || data === null) {
    return results
  }

  if ('isSelected' in data) {
    results.push({
      isSelected: data.isSelected,
      id: data.tempId || data.id,
    })
  }

  if (Array.isArray(data)) {
    for (const item of data) {
      findAllSelections(item, results)
    }
  } else {
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        findAllSelections(data[key], results)
      }
    }
  }

  return results
}
