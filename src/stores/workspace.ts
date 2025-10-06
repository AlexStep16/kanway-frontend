import { defineStore } from 'pinia'
import { HSOverlay } from 'preline/dist'
import { ref } from 'vue'

export const useWorkspaceStore = defineStore('workspace', () => {
  const editTaskModalRef = ref<HTMLElement | null>(null)
  const editTaskModalHSInstance = ref<HSOverlay | null>(null)
  const createBoardButtonRef = ref<HTMLElement | null>(null)
  const settingsModalRef = ref<HTMLElement | null>(null)
  const settingsModalHSInstance = ref<HSOverlay | null>(null)
  const chatModalRef = ref<HTMLElement | null>(null)
  const chatModalHSInstance = ref<HSOverlay | null>(null)
  const tipRef = ref<HTMLElement | null>(null)

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

  function openSettingsModal() {
    if (settingsModalHSInstance.value) {
      settingsModalHSInstance.value.open()
    }
  }

  function closeSettingsModal() {
    if (settingsModalHSInstance.value) {
      settingsModalHSInstance.value.close()
    }
  }

  function openChatModal() {
    if (chatModalHSInstance.value) {
      chatModalHSInstance.value.open()
    }
  }

  function closeChatModal() {
    if (chatModalHSInstance.value) {
      chatModalHSInstance.value.close()
    }
  }

  function $reset() {}

  return {
    // State
    editTaskModalRef,
    isSidebarOpen,
    editTaskModalHSInstance,
    createBoardButtonRef,
    settingsModalRef,
    settingsModalHSInstance,
    chatModalRef,
    chatModalHSInstance,
    tipRef,

    // Actions
    openEditTaskModal,
    closeEditTaskModal,
    openSettingsModal,
    closeSettingsModal,
    openChatModal,
    closeChatModal,
    $reset,
  }
})
