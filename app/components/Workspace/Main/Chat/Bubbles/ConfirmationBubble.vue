<script setup lang="ts">
import MarkdownContent from '~/components/Workspace/Main/Chat/Bubbles/MarkdownContent.vue'
import dayjs from 'dayjs'

interface StringModification {
  set?: string
  append?: boolean
  prepend?: boolean
  replace_part?: {
    find: string
    replace_with: string
  }
}

interface DateModification {
  set?: string // YYYY-MM-DD
  shift?: {
    value: number
    unit: 'days' | 'weeks' | 'months' | 'years'
  }
}

interface TimeModification {
  set?: string // HH:MM
  shift?: {
    value: number
    unit: 'minutes' | 'hours'
  }
}

interface ArrayModification {
  set?: string[]
  add?: string[]
  remove?: string[]
}

interface Changes {
  name: StringModification
  description: StringModification
  dueDate: DateModification
  dueTime: TimeModification
  tags: ArrayModification
  categoryId: string
  boardId: string
  workspaceId: string
  isCompleted: boolean
  color: string
}

defineProps<{
  text: string
  changes?: Changes
}>()

const unitMap: Record<string, string[]> = {
  days: ['день', 'дня', 'дней'],
  weeks: ['неделя', 'недели', 'недель'],
  months: ['месяц', 'месяца', 'месяцев'],
  years: ['год', 'года', 'лет'],
  hours: ['час', 'часа', 'часов'],
  minutes: ['минута', 'минуты', 'минут'],
}

function getStringModificationText(modification: StringModification): string {
  let action = ''

  if (modification.set !== undefined) {
    action = modification.set
  } else if (modification.append) {
    action = 'Добавить в конец - ' + modification.append
  } else if (modification.prepend) {
    action = 'Добавить в начало - ' + modification.prepend
  } else if (modification.replace_part) {
    action = `Заменить "${modification.replace_part.find}" на "${modification.replace_part.replace_with}"`
  }

  return action
}

function getDateModificationText(modification: DateModification): string {
  let action = ''

  if (modification.set !== undefined) {
    action = dayjs(modification.set).calendar()
    action = action.charAt(0).toUpperCase() + action.slice(1)
  } else if (modification.shift) {
    action = `Сдвинуть на ${modification.shift.value} ${pluralize(modification.shift.value, unitMap[modification.shift.unit]!)}`
  }

  return action
}

function getTimeModificationText(modification: TimeModification): string {
  let action = ''

  if (modification.set !== undefined) {
    action = modification.set
  } else if (modification.shift) {
    action = `Сдвинуть на ${modification.shift.value} ${pluralize(modification.shift.value, unitMap[modification.shift.unit]!)}`
  }

  return action
}

function getTagsModificationText(modification: ArrayModification): string {
  let action = ''

  if (modification.set !== undefined) {
    action = 'Установить теги: ' + modification.set.join(', ')
  } else {
    const parts: string[] = []
    if (modification.add && modification.add.length > 0) {
      parts.push('Добавить: ' + modification.add.join(', '))
    }
    if (modification.remove && modification.remove.length > 0) {
      parts.push('Удалить: ' + modification.remove.join(', '))
    }
    action = parts.join('; ')
  }

  return action
}

function prepareChangesText(changes: Changes): { field: string; action: string }[] {
  const lines: { field: string; action: string }[] = []

  for (const [key, value] of Object.entries(changes) as [keyof Changes, Changes[keyof Changes]][]) {
    if (key === 'name') {
      lines.push({ field: 'Имя', action: getStringModificationText(value as StringModification) })
    }
    if (key === 'description') {
      lines.push({
        field: 'Описание',
        action: getStringModificationText(value as StringModification),
      })
    }
    if (key === 'dueDate') {
      lines.push({ field: 'Дата', action: getDateModificationText(value as DateModification) })
    }
    if (key === 'dueTime') {
      lines.push({ field: 'Время', action: getTimeModificationText(value as TimeModification) })
    }
    if (key === 'tags') {
      lines.push({ field: 'Теги', action: getTagsModificationText(value as ArrayModification) })
    }
    if (key === 'categoryId') {
      lines.push({ field: 'Категория', action: value as string })
    }
    if (key === 'boardId') {
      lines.push({ field: 'Доска', action: value as string })
    }
    if (key === 'workspaceId') {
      lines.push({ field: 'Рабочее пространство', action: value as string })
    }
    if (key === 'isCompleted') {
      lines.push({ field: 'Статус выполнения', action: value ? 'Выполнено' : 'Не выполнено' })
    }
    if (key === 'color') {
      lines.push({ field: 'Цвет', action: value as string })
    }
  }

  return lines
}
</script>

<template>
  <MarkdownContent :text />

  <ul
    class="text-sm text-gray-700 mt-2"
    v-if="changes && Object.keys(changes).length > 0"
  >
    <li
      class="relative before:content-['•'] before:absolute before:left-0 before:inline-block ps-4"
      v-for="(change, index) in prepareChangesText(changes)"
      :key="index + change.field"
    >
      <span class="font-semibold">{{ change.field }}: </span>{{ change.action }}
    </li>
  </ul>
</template>
