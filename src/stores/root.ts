import dayjs from 'dayjs'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useRootStore = defineStore('root', () => {
  const timezone = ref(dayjs.tz.guess())

  function $reset() {}

  return {
    // State
    timezone,

    // Actions
    $reset,
  }
})
