import Tabs from '~/enums/TabsEnum'
import type { ITaskState } from './interfaces/ITaskState'
import { SettingTabs } from '~/enums/SettingTabs'

export const useUIStore = defineStore('ui', () => {
  const isMobileSearchOpen = ref(false)
  const isPlansModalOpen = ref(false)
  const isSupportModalOpen = ref(false)
  const isEditTaskModalOpen = ref(false)
  const isSettingsModalOpen = ref(false)
  const isDeleteUserModalOpen = ref(false)

  const boardStore = useBoardStore()
  const chatStore = useChatStore()

  const editableTask = ref<ITaskState | null>(null)

  const isWorkspaceDialogOpen = ref(false)

  const currentTab = ref<Tabs>(Tabs.Board)
  const currentSettingsTab = ref<SettingTabs>(SettingTabs.GENERAL)

  const isSidebarOpen = ref(true)
  const isChatOpen = ref(false)

  function openWorkspaceDialog() {
    isWorkspaceDialogOpen.value = true
  }

  function closeWorkspaceDialog() {
    isWorkspaceDialogOpen.value = false
  }

  function openSidebar() {
    isSidebarOpen.value = true
  }

  function closeSidebar() {
    isSidebarOpen.value = false
  }

  function clearTaskToEdit() {
    editableTask.value = null
  }

  function openTaskToEdit(task: ITaskState) {
    editableTask.value = task

    isEditTaskModalOpen.value = true
  }

  function selectArchive() {
    currentTab.value = Tabs.Archive

    boardStore.clearBoard()
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

    boardStore.clearBoard()
  }

  function openSubscriptionSettings() {
    currentSettingsTab.value = SettingTabs.SUBSCRIPTION
    isSettingsModalOpen.value = true
  }

  function openGeneralSettings() {
    currentSettingsTab.value = SettingTabs.GENERAL
    isSettingsModalOpen.value = true
  }

  function openPaymentsSettings() {
    currentSettingsTab.value = SettingTabs.PAYMENTS
    isSettingsModalOpen.value = true
  }

  return {
    // State
    isMobileSearchOpen,
    isPlansModalOpen,
    isSupportModalOpen,
    isEditTaskModalOpen,
    isSettingsModalOpen,
    isDeleteUserModalOpen,

    isSidebarOpen,
    currentTab,
    currentSettingsTab,
    isChatOpen,
    isWorkspaceDialogOpen,
    isArchiveTabSelected,
    isBoardTabSelected,
    isChatTabSelected,

    editableTask,

    // Actions
    openSidebar,
    closeSidebar,
    selectArchive,
    selectBoard,
    selectChat,
    openTaskToEdit,
    clearTaskToEdit,
    openWorkspaceDialog,
    closeWorkspaceDialog,
    openSubscriptionSettings,
    openGeneralSettings,
    openPaymentsSettings,
  }
})
