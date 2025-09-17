import { defineStore } from 'pinia'
import { HSOverlay } from 'preline/dist'
import { ref } from 'vue'
import { useTaskStore } from './task'

export const useWorkspaceStore = defineStore('workspace', () => {
  const isEditTaskModalOpen = ref(false)
  const editTaskModalRef = ref<HTMLElement | null>(null)
  const editTaskModalHSInstance = ref<HSOverlay | null>(null)
  const isSidebarOpen = ref(true)

  // Stores
  const TASK_STORE = useTaskStore()

  function openEditTaskModal() {
    if (editTaskModalRef.value) {
      editTaskModalHSInstance.value = new HSOverlay(editTaskModalRef.value)

      if (editTaskModalHSInstance.value) {
        editTaskModalHSInstance.value.on('open', () => {
          isEditTaskModalOpen.value = true
        })

        editTaskModalHSInstance.value.on('close', () => {
          isEditTaskModalOpen.value = false

          TASK_STORE.clearTaskToEdit()
        })

        editTaskModalHSInstance.value.open()
      }
    }
  }

  function closeEditTaskModal() {
    if (editTaskModalHSInstance.value) {
      isEditTaskModalOpen.value = false

      editTaskModalHSInstance.value.close()
    }
  }

  function $reset() {
    isEditTaskModalOpen.value = false
  }

  return {
    // State
    isEditTaskModalOpen,
    editTaskModalRef,
    isSidebarOpen,

    // Actions
    openEditTaskModal,
    closeEditTaskModal,
    $reset,
  }
})
