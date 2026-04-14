import { defineStore } from 'pinia'
import type { HSOverlay } from 'preline'

import { computed, nextTick, ref, watch } from 'vue'
import Tabs from '@/enums/TabsEnum'
import { Nullable } from '@/types/utils'
import { useBoardStore } from '@stores/board'
import { ITaskState } from './interfaces/ITaskState'
import { ICategoryState } from './interfaces/ICategoryState'
import { IBoard } from '@/interfaces/domain/IBoard'
import { IWorkspace } from '@/interfaces/domain/IWorkspace'
import { useChatStore } from './chat'
import { SettingTabs } from '@/enums/SettingTabs'

export const useUIStore = defineStore('ui', () => {
  const boardStore = useBoardStore()
  const chatStore = useChatStore()

  const editableTaskId = ref<Nullable<string>>(null)
  const editableTaskBoardId = ref<Nullable<string>>(null)
  const isEditableTaskDeleted = ref<boolean>(false)

  const editableCategoryId = ref<Nullable<string>>(null)
  const editableCategoryBoardId = ref<Nullable<string>>(null)
  const isEditableCategoryDeleted = ref<boolean>(false)

  const editableBoardId = ref<Nullable<string>>(null)
  const editableBoardWorkspaceId = ref<Nullable<string>>(null)
  const isEditableBoardDeleted = ref<boolean>(false)

  const editableWorkspaceId = ref<Nullable<string>>(null)
  const isEditableWorkspaceDeleted = ref<boolean>(false)

  const editTaskModalRef = ref<Nullable<HTMLElement>>(null)
  const editTaskModalHSInstance = ref<Nullable<HSOverlay>>(null)

  const editCategoryModalRef = ref<Nullable<HTMLElement>>(null)
  const editCategoryModalHSInstance = ref<Nullable<HSOverlay>>(null)

  const editBoardModalRef = ref<Nullable<HTMLElement>>(null)
  const editBoardModalHSInstance = ref<Nullable<HSOverlay>>(null)

  const editWorkspaceModalRef = ref<Nullable<HTMLElement>>(null)
  const editWorkspaceModalHSInstance = ref<Nullable<HSOverlay>>(null)

  const isWorkspaceDialogOpen = ref(false)

  const createBoardButtonRef = ref<Nullable<HTMLElement>>(null)
  const settingsModalRef = ref<Nullable<HTMLElement>>(null)
  const settingsModalHSInstance = ref<Nullable<HSOverlay>>(null)
  const chatModalHSInstance = ref<Nullable<HSOverlay>>(null)
  const supportModalRef = ref<Nullable<HTMLElement>>(null)
  const supportModalHSInstance = ref<Nullable<HSOverlay>>(null)
  const plansModalRef = ref<Nullable<HTMLElement>>(null)
  const plansModalHSInstance = ref<Nullable<HSOverlay>>(null)
  const tipRef = ref<Nullable<HTMLElement>>(null)
  const sidebarRef = ref<Nullable<HTMLElement>>(null)

  const currentTab = ref<Tabs>(Tabs.Board)
  const currentSettingsTab = ref<SettingTabs>(SettingTabs.GENERAL)

  const modalStack = ref<string[]>([])
  const modalInstances = ref(new Map<string, HSOverlay>())

  const isSidebarOpen = ref(true)
  const isChatOpen = ref(false)
  const isSupportModalOpen = ref(false)

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
    settingsModalRef,
    (newVal) => {
      watchForBackdropClicks(newVal, 'settings', closeSettingsModal)
    },
    { once: true },
  )

  watch(
    supportModalRef,
    (newVal) => {
      watchForBackdropClicks(newVal, 'support', closeSupportModal)
    },
    { once: true },
  )

  watch(
    plansModalRef,
    (newVal) => {
      watchForBackdropClicks(newVal, 'plans', closePlansModal)
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
    supportModalHSInstance.value?.close()
    plansModalHSInstance.value?.close()
  }

  function openWorkspaceDialog() {
    isWorkspaceDialogOpen.value = true
  }

  function closeWorkspaceDialog() {
    isWorkspaceDialogOpen.value = false
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
      modalInstances.value.set('settingsModal', settingsModalHSInstance.value)

      nextTick(() => {
        if (settingsModalHSInstance.value) settingsModalHSInstance.value.open()
      })
    }
  }

  function closeSettingsModal() {
    if (settingsModalHSInstance.value) {
      settingsModalHSInstance.value.close()
    }
  }

  function openSupportModal() {
    if (supportModalHSInstance.value) {
      modalInstances.value.set('supportModal', supportModalHSInstance.value)

      nextTick(() => {
        if (supportModalHSInstance.value) supportModalHSInstance.value.open()
      })
    }
  }

  function closeSupportModal() {
    if (supportModalHSInstance.value) {
      supportModalHSInstance.value.close()
    }
  }

  function openPlansModal() {
    if (plansModalHSInstance.value) {
      modalInstances.value.set('plansModal', plansModalHSInstance.value)

      nextTick(() => {
        if (plansModalHSInstance.value) plansModalHSInstance.value.open()
      })
    }
  }

  function closePlansModal() {
    if (plansModalHSInstance.value) {
      plansModalHSInstance.value.close()
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
    isEditableTaskDeleted.value = false
  }

  function openTaskToEdit(task: ITaskState) {
    editableTaskId.value = task.id
    editableTaskBoardId.value = task.board.id
    isEditableTaskDeleted.value = task.isDeleted

    openEditTaskModal()
  }

  function clearCategoryToEdit() {
    editableCategoryId.value = null
    editableCategoryBoardId.value = null
    isEditableCategoryDeleted.value = false
  }

  function openCategoryToEdit(category: ICategoryState) {
    editableCategoryId.value = category.id
    editableCategoryBoardId.value = category.board.id
    isEditableCategoryDeleted.value = category.isDeleted

    openEditCategoryModal()
  }

  function clearBoardToEdit() {
    editableBoardId.value = null
    editableBoardWorkspaceId.value = null
    isEditableBoardDeleted.value = false
  }

  function openBoardToEdit(board: IBoard) {
    editableBoardId.value = board.id
    editableBoardWorkspaceId.value = board.workspace.id
    isEditableBoardDeleted.value = board.isDeleted

    openEditBoardModal()
  }

  function clearWorkspaceToEdit() {
    editableWorkspaceId.value = null
    isEditableWorkspaceDeleted.value = false
  }

  function openWorkspaceToEdit(workspace: IWorkspace) {
    editableWorkspaceId.value = workspace.id
    isEditableWorkspaceDeleted.value = workspace.isDeleted

    openEditWorkspaceModal()
  }

  function selectArchive() {
    currentTab.value = Tabs.Archive

    boardStore.resetBoardSelection()
  }

  const isArchiveTabSelected = computed(() => currentTab.value === Tabs.Archive)
  const isBoardTabSelected = computed(() => currentTab.value === Tabs.Board)
  const isChatTabSelected = computed(() => currentTab.value === Tabs.Chat)

  function selectBoard() {
    currentTab.value = Tabs.Board
  }

  function selectChat() {
    currentTab.value = Tabs.Chat
    if (!chatStore.activeChatId) {
      chatStore.newChat()
    }

    boardStore.resetBoardSelection()
  }

  function openSubscriptionSettings() {
    currentSettingsTab.value = SettingTabs.SUBSCRIPTION
    openSettingsModal()
  }

  function openGeneralSettings() {
    currentSettingsTab.value = SettingTabs.GENERAL
    openSettingsModal()
  }

  function openPaymentsSettings() {
    currentSettingsTab.value = SettingTabs.PAYMENTS
    openSettingsModal()
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
    chatModalHSInstance,
    isSidebarOpen,
    tipRef,
    currentTab,
    currentSettingsTab,
    sidebarRef,
    modalStack,
    isModalOnTop,
    isChatOpen,
    isWorkspaceDialogOpen,
    isArchiveTabSelected,
    isBoardTabSelected,
    isChatTabSelected,

    editableBoardId,
    editableBoardWorkspaceId,
    isEditableBoardDeleted,
    editableCategoryId,
    editableCategoryBoardId,
    isEditableCategoryDeleted,
    editableTaskId,
    editableTaskBoardId,
    isEditableTaskDeleted,
    editableWorkspaceId,
    isEditableWorkspaceDeleted,
    supportModalRef,
    supportModalHSInstance,
    isSupportModalOpen,
    plansModalRef,
    plansModalHSInstance,

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
    openSidebar,
    closeSidebar,
    selectArchive,
    selectBoard,
    selectChat,
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
    openSupportModal,
    closeSupportModal,
    openPlansModal,
    closePlansModal,
    openWorkspaceDialog,
    closeWorkspaceDialog,
    openSubscriptionSettings,
    openGeneralSettings,
    openPaymentsSettings,
  }
})
