import { defineStore } from 'pinia'
import type { HSOverlay } from 'preline'

import { computed, nextTick, ref, watch } from 'vue'
import Tabs from '@/enums/TabsEnum'
import { Nullable } from '@/types/utils'
import { useBoardStore } from '@stores/board'

export const useUIStore = defineStore('ui', () => {
  const boardStore = useBoardStore()

  const editableTaskId = ref<Nullable<string>>(null)
  const editableTaskBoardId = ref<Nullable<string>>(null)

  const editableCategoryId = ref<Nullable<string>>(null)
  const editableCategoryBoardId = ref<Nullable<string>>(null)

  const editableBoardId = ref<Nullable<string>>(null)
  const editableBoardWorkspaceId = ref<Nullable<string>>(null)

  const editableWorkspaceId = ref<Nullable<string>>(null)

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

  const modalStack = ref<string[]>([])
  const modalInstances = ref(new Map<string, HSOverlay>())

  const isSidebarOpen = ref(true)
  const isChatModalOpen = ref(false)

  function watchForBackdropClicks(
    newVal: Nullable<HTMLElement>,
    id: string,
    closeCallback: () => void,
  ) {
    if (newVal)
      document.addEventListener('click', (event) => {
        const target = event.target as HTMLElement

        if (target.id === `hs-${id}-backdrop`) {
          closeCallback()
        }
      })
  }

  watch(
    editTaskModalRef,
    (newVal) => {
      watchForBackdropClicks(newVal, 'task-edit', closeEditTaskModal)
    },
    { once: true },
  )

  watch(
    editCategoryModalRef,
    (newVal) => {
      watchForBackdropClicks(newVal, 'category-edit', closeEditCategoryModal)
    },
    { once: true },
  )

  watch(
    editBoardModalRef,
    (newVal) => {
      watchForBackdropClicks(newVal, 'board-edit', closeEditBoardModal)
    },
    { once: true },
  )

  watch(
    editWorkspaceModalRef,
    (newVal) => {
      watchForBackdropClicks(newVal, 'workspace-edit', closeEditWorkspaceModal)
    },
    { once: true },
  )

  watch(
    chatModalRef,
    (newVal) => {
      watchForBackdropClicks(newVal, 'chat', closeChatModal)
    },
    { once: true },
  )

  watch(
    settingsModalRef,
    (newVal) => {
      watchForBackdropClicks(newVal, 'settings', closeSettingsModal)
    },
    { once: true },
  )

  function addToModalStack(id: string) {
    modalStack.value.push(id)

    closeAllModals()
  }

  function removeFromModalStack(id: string) {
    const index = modalStack.value.indexOf(id)

    if (index > -1) {
      modalStack.value.splice(index, 1)
    }

    openTopModal()
  }

  function openTopModal() {
    const topModalId = modalStack.value[modalStack.value.length - 1]
    modalInstances.value.get(topModalId)?.open()
  }

  const isModalOnTop = computed(() => (id: string) => {
    return modalStack.value.length > 0 && modalStack.value[modalStack.value.length - 1] === id
  })

  function closeAllModals() {
    editTaskModalHSInstance.value?.close()
    editCategoryModalHSInstance.value?.close()
    editBoardModalHSInstance.value?.close()
    editWorkspaceModalHSInstance.value?.close()
    settingsModalHSInstance.value?.close()
    chatModalHSInstance.value?.close()
  }

  function openEditTaskModal() {
    if (editTaskModalHSInstance.value) {
      addToModalStack('editTaskModal')
      modalInstances.value.set('editTaskModal', editTaskModalHSInstance.value)

      nextTick(() => {
        if (editTaskModalHSInstance.value) editTaskModalHSInstance.value.open()
      })
    }
  }

  function closeEditTaskModal() {
    if (editTaskModalHSInstance.value) {
      editTaskModalHSInstance.value.close()

      clearTaskToEdit()

      removeFromModalStack('editTaskModal')
    }
  }

  function openEditCategoryModal() {
    if (editCategoryModalHSInstance.value) {
      addToModalStack('editCategoryModal')
      modalInstances.value.set('editCategoryModal', editCategoryModalHSInstance.value)

      nextTick(() => {
        if (editCategoryModalHSInstance.value) editCategoryModalHSInstance.value.open()
      })
    }
  }

  function closeEditCategoryModal() {
    if (editCategoryModalHSInstance.value) {
      editCategoryModalHSInstance.value.close()

      clearCategoryToEdit()

      removeFromModalStack('editCategoryModal')
    }
  }

  function openEditBoardModal() {
    if (editBoardModalHSInstance.value) {
      addToModalStack('editBoardModal')
      modalInstances.value.set('editBoardModal', editBoardModalHSInstance.value)

      nextTick(() => {
        if (editBoardModalHSInstance.value) editBoardModalHSInstance.value.open()
      })
    }
  }

  function closeEditBoardModal() {
    if (editBoardModalHSInstance.value) {
      editBoardModalHSInstance.value.close()

      clearBoardToEdit()

      removeFromModalStack('editBoardModal')
    }
  }

  function openEditWorkspaceModal() {
    if (editWorkspaceModalHSInstance.value) {
      addToModalStack('editWorkspaceModal')

      modalInstances.value.set('editWorkspaceModal', editWorkspaceModalHSInstance.value)

      nextTick(() => {
        if (editWorkspaceModalHSInstance.value) editWorkspaceModalHSInstance.value.open()
      })
    }
  }

  function closeEditWorkspaceModal() {
    if (editWorkspaceModalHSInstance.value) {
      editWorkspaceModalHSInstance.value.close()

      clearWorkspaceToEdit()

      removeFromModalStack('editWorkspaceModal')
    }
  }

  function openSettingsModal() {
    if (settingsModalHSInstance.value) {
      addToModalStack('settingsModal')

      modalInstances.value.set('settingsModal', settingsModalHSInstance.value)

      nextTick(() => {
        if (settingsModalHSInstance.value) settingsModalHSInstance.value.open()
      })
    }
  }

  function closeSettingsModal() {
    if (settingsModalHSInstance.value) {
      settingsModalHSInstance.value.close()

      removeFromModalStack('settingsModal')
    }
  }

  function openChatModal() {
    if (chatModalHSInstance.value) {
      addToModalStack('chatModal')

      modalInstances.value.set('chatModal', chatModalHSInstance.value)

      nextTick(() => {
        if (chatModalHSInstance.value) chatModalHSInstance.value.open()
      })
    }
  }

  function closeChatModal() {
    if (chatModalHSInstance.value) {
      chatModalHSInstance.value.close()

      removeFromModalStack('chatModal')
    }
  }

  function openSidebar() {
    isSidebarOpen.value = true
  }

  function closeSidebar() {
    isSidebarOpen.value = false
  }

  function clearTaskToEdit() {
    editableTaskId.value = null
    editableTaskBoardId.value = null
  }

  function openTaskToEdit(taskId: string, boardId: string) {
    editableTaskId.value = taskId
    editableTaskBoardId.value = boardId

    openEditTaskModal()
  }

  function clearCategoryToEdit() {
    editableCategoryId.value = null
    editableCategoryBoardId.value = null
  }

  function openCategoryToEdit(categoryId: string, boardId: string) {
    editableCategoryId.value = categoryId
    editableCategoryBoardId.value = boardId

    openEditCategoryModal()
  }

  function clearBoardToEdit() {
    editableBoardId.value = null
    editableBoardWorkspaceId.value = null
  }

  function openBoardToEdit(boardId: string, workspaceId: string) {
    editableBoardId.value = boardId
    editableBoardWorkspaceId.value = workspaceId

    openEditBoardModal()
  }

  function clearWorkspaceToEdit() {
    editableWorkspaceId.value = null
  }

  function openWorkspaceToEdit(workspaceId: string) {
    editableWorkspaceId.value = workspaceId

    openEditWorkspaceModal()
  }

  function selectArchive() {
    currentTab.value = Tabs.Archive

    boardStore.resetBoardSelection()
  }

  function selectBoard() {
    currentTab.value = Tabs.Board
  }

  function selectStart() {
    currentTab.value = Tabs.Start
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
    modalStack,
    isModalOnTop,
    isChatModalOpen,

    editableBoardId,
    editableBoardWorkspaceId,
    editableCategoryId,
    editableCategoryBoardId,
    editableTaskId,
    editableTaskBoardId,
    editableWorkspaceId,

    // Actions
    openEditTaskModal,
    closeEditTaskModal,
    openEditCategoryModal,
    closeEditCategoryModal,
    openEditBoardModal,
    closeEditBoardModal,
    openEditWorkspaceModal,
    closeEditWorkspaceModal,
    openSettingsModal,
    closeSettingsModal,
    openChatModal,
    closeChatModal,
    openSidebar,
    closeSidebar,
    selectArchive,
    selectBoard,
    selectStart,
    addToModalStack,
    removeFromModalStack,
    openTaskToEdit,
    clearTaskToEdit,
    openCategoryToEdit,
    clearCategoryToEdit,
    openBoardToEdit,
    clearBoardToEdit,
    openWorkspaceToEdit,
    clearWorkspaceToEdit,
  }
})
