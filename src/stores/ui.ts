import { defineStore } from 'pinia'
import type { HSOverlay } from 'preline'

import { ref } from 'vue'
import Tabs from '@/enums/TabsEnum'
import { Nullable } from '@/types/utils'
import { useBoardDataStore } from '@stores/boardData'
import { useTaskDataStore } from '@stores/taskData'
import { useCategoryDataStore } from '@stores/categoryData'
import { useWorkspaceDataStore } from '@stores/workspaceData'

export const useUIStore = defineStore('ui', () => {
  const editTaskModalRef = ref<Nullable<HTMLElement>>(null)
  const editTaskModalHSInstance = ref<Nullable<HSOverlay>>(null)

  const editCategoryModalRef = ref<Nullable<HTMLElement>>(null)
  const editCategoryModalHSInstance = ref<Nullable<HSOverlay>>(null)

  const editBoardModalRef = ref<Nullable<HTMLElement>>(null)
  const editBoardModalHSInstance = ref<Nullable<HSOverlay>>(null)

  const editWorkspaceModalRef = ref<Nullable<HTMLElement>>(null)
  const editWorkspaceModalHSInstance = ref<Nullable<HSOverlay>>(null)

  const createBoardButtonRef = ref<Nullable<HTMLElement>>(null)
  const settingsModalRef = ref<Nullable<HTMLElement>>(null)
  const settingsModalHSInstance = ref<Nullable<HSOverlay>>(null)
  const chatModalRef = ref<Nullable<HTMLElement>>(null)
  const chatModalHSInstance = ref<Nullable<HSOverlay>>(null)
  const tipRef = ref<Nullable<HTMLElement>>(null)
  const sidebarRef = ref<Nullable<HTMLElement>>(null)

  const currentTab = ref<Tabs>(Tabs.Board)

  const WORKSPACE_STORE = useWorkspaceDataStore()
  const BOARD_STORE = useBoardDataStore()
  const TASK_STORE = useTaskDataStore()
  const CATEGORY_STORE = useCategoryDataStore()

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

  function openEditCategoryModal() {
    if (editCategoryModalHSInstance.value) {
      editCategoryModalHSInstance.value.open()
    }
  }

  function closeEditCategoryModal() {
    if (editCategoryModalHSInstance.value) {
      editCategoryModalHSInstance.value.close()
    }
  }

  function openEditBoardModal() {
    if (editBoardModalHSInstance.value) {
      editBoardModalHSInstance.value.open()
    }
  }

  function closeEditBoardModal() {
    if (editBoardModalHSInstance.value) {
      editBoardModalHSInstance.value.close()
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

  function selectArchive() {
    TASK_STORE.loadArchivedTasks()
    CATEGORY_STORE.loadArchivedCategories()
    BOARD_STORE.loadArchivedBoards()
    WORKSPACE_STORE.loadArchivedWorkspaces()

    currentTab.value = Tabs.Archive

    BOARD_STORE.resetBoardSelection()
  }

  function selectBoard() {
    currentTab.value = Tabs.Board
  }

  function $reset() {
    //...
  }

  return {
    // State
    editTaskModalRef,
    editTaskModalHSInstance,
    editCategoryModalRef,
    editCategoryModalHSInstance,
    editBoardModalRef,
    editBoardModalHSInstance,
    editWorkspaceModalRef,
    editWorkspaceModalHSInstance,
    createBoardButtonRef,
    settingsModalRef,
    settingsModalHSInstance,
    chatModalRef,
    chatModalHSInstance,
    isSidebarOpen,
    tipRef,
    currentTab,
    sidebarRef,

    // Actions
    openEditTaskModal,
    closeEditTaskModal,
    openEditCategoryModal,
    closeEditCategoryModal,
    openEditBoardModal,
    closeEditBoardModal,
    openSettingsModal,
    closeSettingsModal,
    openChatModal,
    closeChatModal,
    openSidebar,
    closeSidebar,
    selectArchive,
    selectBoard,
    $reset,
  }
})
