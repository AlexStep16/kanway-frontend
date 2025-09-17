import { defineStore } from 'pinia'
import { ref } from 'vue'
import { Task } from '../Interfaces/Task'

export const useTaskStore = defineStore('task', () => {
  const taskToEdit = ref<Task | null>(null)

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
