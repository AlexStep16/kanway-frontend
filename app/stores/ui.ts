import Tabs from '~/enums/TabsEnum'
import type { ITaskState } from './interfaces/ITaskState'
import { SettingTabs } from '~/enums/SettingTabs'
import type { IWorkspace } from '~/interfaces/domain/IWorkspace'

export const useUIStore = defineStore('ui', () => {
  const isMobileSearchOpen = ref(false)
  const isPlansModalOpen = ref(false)
  const isSupportModalOpen = ref(false)
  const isEditTaskModalOpen = ref(false)
  const isDeleteUserModalOpen = ref(false)

  const boardStore = useBoardStore()
  const chatStore = useChatStore()

  const editableTask = ref<ITaskState | null>(null)
  const editableWorkspace = ref<IWorkspace | null>(null)

  const isWorkspaceDialogOpen = ref(false)

  const currentTab = ref<Tabs>(Tabs.Board)
  const currentSettingsTab = ref<SettingTabs>(SettingTabs.GENERAL)

  const isSidebarOpen = ref(true)
  const isChatOpen = ref(false)

  function openWorkspaceDialog(workspace?: IWorkspace | null) {
    editableWorkspace.value = workspace ?? null
    isWorkspaceDialogOpen.value = true
  }

  function closeWorkspaceDialog() {
    isWorkspaceDialogOpen.value = false
    editableWorkspace.value = null
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

  function updateEditableTask(task: ITaskState | null) {
    editableTask.value = task
  }

  function selectArchive() {
    currentTab.value = Tabs.Archive
    isChatOpen.value = false

    boardStore.clearBoard()
  }

  function selectSettings() {
    currentTab.value = Tabs.Settings
    isChatOpen.value = false

    boardStore.clearBoard()
  }

  const isArchiveTabSelected = computed(() => currentTab.value === Tabs.Archive)
  const isSettingsTabSelected = computed(() => currentTab.value === Tabs.Settings)
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

  return {
    // State
    isMobileSearchOpen,
    isPlansModalOpen,
    isSupportModalOpen,
    isEditTaskModalOpen,
    isDeleteUserModalOpen,

    isSidebarOpen,
    currentTab,
    currentSettingsTab,
    isChatOpen,
    isWorkspaceDialogOpen,
    isArchiveTabSelected,
    isSettingsTabSelected,
    isBoardTabSelected,
    isChatTabSelected,

    editableTask,
    editableWorkspace,

    // Actions
    openSidebar,
    closeSidebar,
    selectArchive,
    selectSettings,
    selectBoard,
    selectChat,
    openTaskToEdit,
    updateEditableTask,
    clearTaskToEdit,
    openWorkspaceDialog,
    closeWorkspaceDialog,
  }
})
