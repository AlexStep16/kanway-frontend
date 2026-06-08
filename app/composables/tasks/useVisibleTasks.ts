import { useTaskFilterStore } from '~/stores/taskFilters'
import dayjs from 'dayjs'

export function useVisibleTasks(
  boardId: MaybeRef<string | null>,
  columnId: MaybeRef<string | null>,
) {
  const { data: tasks } = useTasks(boardId)

  const columnTasks = computed(
    () => tasks.value?.filter((t) => t.column.id === toValue(columnId)) || [],
  )

  const filterStore = useTaskFilterStore()

  const filteredTasks = computed(() => {
    if (!columnTasks.value) return []

    let result = columnTasks.value.filter((t) => !t.isDeleted)

    const f = filterStore.filters

    if (f.isCompleted === true) {
      result = result.filter((t) => t.isCompleted)
    }

    if (f.isInProgress === true) {
      result = result.filter((t) => !t.isCompleted)
    }

    if (f.isExpired === true) {
      result = result.filter((t) => {
        const hasDueDate = t.dueDate !== null && t.dueDate !== undefined && t.dueDate !== ''
        if (!hasDueDate) return false

        const hasDueHours = t.dueHours !== null && t.dueHours !== undefined
        const hasDueMinutes = t.dueMinutes !== null && t.dueMinutes !== undefined

        if (hasDueHours && hasDueMinutes) {
          const fullDueDateTime = new Date(
            `${t.dueDate}T${String(t.dueHours).padStart(2, '0')}:${String(t.dueMinutes).padStart(2, '0')}:00`,
          )

          return fullDueDateTime < new Date()
        } else {
          const dueDateOnly = dayjs(t.dueDate).startOf('day').toDate()

          return dueDateOnly < new Date()
        }
      })
    }

    if (f.isDueToday === true) {
      result = result.filter((t) => {
        const hasDueDate = t.dueDate !== null && t.dueDate !== undefined && t.dueDate !== ''
        if (!hasDueDate) return false

        const today = dayjs().startOf('day')
        const taskDueDate = dayjs(t.dueDate).startOf('day')

        return taskDueDate.isSame(today, 'day')
      })
    }

    if (f.isDueTomorrow === true) {
      result = result.filter((t) => {
        const hasDueDate = t.dueDate !== null && t.dueDate !== undefined && t.dueDate !== ''
        if (!hasDueDate) return false

        const tomorrow = dayjs().add(1, 'day').startOf('day')
        const taskDueDate = dayjs(t.dueDate).startOf('day')

        return taskDueDate.isSame(tomorrow, 'day')
      })
    }

    if (f.isDueThisWeek === true) {
      result = result.filter((t) => {
        const hasDueDate = t.dueDate && t.dueDate.length > 0
        if (!hasDueDate) return false

        const startOfThisWeek = dayjs().startOf('isoWeek')

        const endOfThisWeek = dayjs().endOf('isoWeek')
        const taskDueDate = dayjs(t.dueDate).startOf('day')

        return dayjs(taskDueDate).isBetween(startOfThisWeek, endOfThisWeek, 'day', '[]')
      })
    }

    if (f.tags && f.tags.length > 0) {
      result = result.filter((t) => {
        return t.tags.some((tag) => f.tags.includes(tag))
      })
    }

    return result
  })

  function getTasksByColumnId(columnId: string) {
    const tasks = filteredTasks.value.filter((t) => t.column.id === columnId)

    return tasks.sort((a, b) => a.rank.localeCompare(b.rank))
  }

  const availableTags = computed(() => {
    if (!columnTasks.value) return []

    const tags = new Set<string>()
    columnTasks.value.forEach((t) => t.tags.forEach((tag) => tags.add(tag)))
    return Array.from(tags)
  })

  return {
    tasks: filteredTasks,
    getTasksByColumnId,
    availableTags,
  }
}
