import { defineStore } from 'pinia'
import type { HSOverlay } from 'preline'

import { ref } from 'vue'
import Tabs from '@/enums/TabsEnum'
import { Nullable } from '@/types/utils'

export const useUIStore = defineStore('ui', () => {
  const editTaskModalRef = ref<Nullable<HTMLElement>>(null)
  const editTaskModalHSInstance = ref<Nullable<HSOverlay>>(null)
  const createBoardButtonRef = ref<Nullable<HTMLElement>>(null)
  const settingsModalRef = ref<Nullable<HTMLElement>>(null)
  const settingsModalHSInstance = ref<Nullable<HSOverlay>>(null)
  const chatModalRef = ref<Nullable<HTMLElement>>(null)
  const chatModalHSInstance = ref<Nullable<HSOverlay>>(null)
  const tipRef = ref<Nullable<HTMLElement>>(null)

  const currentTab = ref<Tabs>(Tabs.Board)

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

  function openSidebar() {
    isSidebarOpen.value = true
  }

  function closeSidebar() {
    isSidebarOpen.value = false
  }

  function $reset() {
    editTaskModalRef.value = null
    editTaskModalHSInstance.value = null
    createBoardButtonRef.value = null
    settingsModalRef.value = null
    settingsModalHSInstance.value = null
    chatModalRef.value = null
    chatModalHSInstance.value = null
    isSidebarOpen.value = true
    tipRef.value = null
    currentTab.value = Tabs.Board
  }

  return {
    // State
    editTaskModalRef,
    editTaskModalHSInstance,
    createBoardButtonRef,
    settingsModalRef,
    settingsModalHSInstance,
    chatModalRef,
    chatModalHSInstance,
    isSidebarOpen,
    tipRef,
    currentTab,

    // Actions
    openEditTaskModal,
    closeEditTaskModal,
    openSettingsModal,
    closeSettingsModal,
    openChatModal,
    closeChatModal,
    openSidebar,
    closeSidebar,
    $reset,
  }
})
