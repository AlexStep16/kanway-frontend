import { defineStore } from 'pinia'
import { HSOverlay } from 'preline/dist'
import { ref } from 'vue'

export const useWorkspaceStore = defineStore('workspace', () => {
  const editTaskModalRef = ref<HTMLElement | null>(null)
  const editTaskModalHSInstance = ref<HSOverlay | null>(null)
  const isSidebarOpen = ref(true)

  function openEditTaskModal() {
    if (editTaskModalHSInstance.value) {
      editTaskModalHSInstance.value.open()
    }
  }

  function closeEditTaskModal() {
    if (editTaskModalHSInstance.value) {
      editTaskModalHSInstance.value.close()
    }
  }

  function $reset() {}

  return {
    // State
    editTaskModalRef,
    isSidebarOpen,
    editTaskModalHSInstance,

    // Actions
    openEditTaskModal,
    closeEditTaskModal,
    $reset,
  }
})
