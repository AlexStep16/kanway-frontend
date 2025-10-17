import { defineStore } from 'pinia'
import { ICollectionItem } from 'preline'
import { HSOverlay } from 'preline/dist'
import { ref } from 'vue'
import Tabs from '@/enums/TabsEnum'

export const useWorkspaceStore = defineStore('workspace', () => {
  const editTaskModalRef = ref<HTMLElement | null>(null)
  const editTaskModalHSInstance = ref<HSOverlay | null>(null)
  const createBoardButtonRef = ref<HTMLElement | null>(null)
  const settingsModalRef = ref<HTMLElement | null>(null)
  const settingsModalHSInstance = ref<HSOverlay | null>(null)
  const chatModalRef = ref<HTMLElement | null>(null)
  const chatModalHSInstance = ref<HSOverlay | null>(null)
  const tipRef = ref<HTMLElement | null>(null)

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

  function openMobileSearch() {
    const mobileSearch = document.getElementById('hs-mobile-search')

    if (mobileSearch) {
      const { element } = HSOverlay.getInstance(mobileSearch, true) as ICollectionItem<HSOverlay>
      element.open()
    }
  }

  function openSidebar() {
    isSidebarOpen.value = true
  }

  function closeSidebar() {
    isSidebarOpen.value = false
  }

  function $reset() {}

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
    openMobileSearch,
    $reset,
  }
})
