import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useTaskStore = defineStore('task', () => {
  const taskToEdit = ref<any>(null)

  function clearTaskToEdit() {
    taskToEdit.value = null
  }

  function $reset() {
    taskToEdit.value = null
  }

  return {
    // State
    taskToEdit,

    // Actions
    clearTaskToEdit,
    $reset,
  }
})
