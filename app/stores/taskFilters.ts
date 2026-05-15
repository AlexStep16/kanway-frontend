import type { ITaskFilters } from '~/interfaces/domain/ITaskFilters'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useTaskFilterStore = defineStore('taskFilters', () => {
  const filters = ref<ITaskFilters>({
    isCompleted: false,
    isInProgress: false,
    isExpired: false,
    isDueToday: false,
    isDueTomorrow: false,
    isDueThisWeek: false,
    tags: [],
  })

  const isFilterActive = computed(() => {
    return Object.values(filters.value).some((v) => (Array.isArray(v) ? v.length > 0 : v === true))
  })

  function clearFilters() {
    filters.value.isCompleted = false
    filters.value.isInProgress = false
    filters.value.isExpired = false
    filters.value.isDueToday = false
    filters.value.isDueTomorrow = false
    filters.value.isDueThisWeek = false
    filters.value.tags = []
  }

  return { filters, isFilterActive, clearFilters }
})
