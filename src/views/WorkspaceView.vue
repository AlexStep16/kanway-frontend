<script setup lang="ts">
import { onMounted } from 'vue'
import Sidebar from '@components/Workspace/Sidebar/Sidebar.vue'
import TaskEdit from '@components/Workspace/Main/Task/Edit/Edit.vue'
import CategoryEdit from '@components/Workspace/Main/Category/Edit.vue'
import BoardEdit from '@components/Workspace/Main/Board/Edit.vue'
import WorkspaceEdit from '@components/Workspace/Edit.vue'
import Board from '@/components/Workspace/Main/Board/Board.vue'
import Archive from '@components/Workspace/Main/Archive/Archive.vue'
import Start from '@components/Workspace/Main/Start.vue'
import { useUIStore } from '@stores/ui'
import { HSOverlay } from 'preline/dist'
import Settings from '@components/Workspace/Settings/Settings.vue'
import Chat from '@components/Workspace/Main/Chat/Chat.vue'
import Tip from '@components/Tip/Tip.vue'
import MobileSearch from '@components/Workspace/MobileSearch.vue'
import Tabs from '@/enums/TabsEnum'
import { useWorkspaceStore } from '@/stores/workspace'
import { useChatStore } from '@stores/chat'
import { useAgentStatusStore } from '@stores/agentStatus'
import { storeToRefs } from 'pinia'
import { useWorkspace } from '@/composables/workspaces/queries/useWorkspace'
import { useStopAgent } from '@/composables/chat/mutations/useStopAgent'
import { useChat } from '@/composables/chat/queries/useChat'
import { useRootStore } from '@/stores/root'
import { useBoards } from '@/composables/boards/queries/useBoards'

const rootStore = useRootStore()
const uiStore = useUIStore()
const chatStore = useChatStore()
const workspaceStore = useWorkspaceStore()
const agentStatusStore = useAgentStatusStore()

const { activeWorkspaceId } = storeToRefs(workspaceStore)
const { activeChatId } = storeToRefs(chatStore)

const { data: activeWorkspace } = useWorkspace(activeWorkspaceId)
const { data: chat } = useChat(activeChatId)
const { data: boards } = useBoards(activeWorkspaceId)

const { mutate: stopAgent } = useStopAgent()

function initEditTaskModal() {
  if (uiStore.editTaskModalRef) {
    uiStore.editTaskModalHSInstance = new HSOverlay(uiStore.editTaskModalRef)
  }
}

function initCategoryEditModal() {
  if (uiStore.editCategoryModalRef) {
    uiStore.editCategoryModalHSInstance = new HSOverlay(uiStore.editCategoryModalRef)
  }
}

function initBoardEditModal() {
  if (uiStore.editBoardModalRef) {
    uiStore.editBoardModalHSInstance = new HSOverlay(uiStore.editBoardModalRef)
  }
}

function initWorkspaceEditModal() {
  if (uiStore.editWorkspaceModalRef) {
    uiStore.editWorkspaceModalHSInstance = new HSOverlay(uiStore.editWorkspaceModalRef)
  }
}

function initSettingsModal() {
  if (uiStore.settingsModalRef) {
    uiStore.settingsModalHSInstance = new HSOverlay(uiStore.settingsModalRef)
  }
}

function initChatModal() {
  if (uiStore.chatModalRef) {
    uiStore.chatModalHSInstance = new HSOverlay(uiStore.chatModalRef)

    uiStore.chatModalHSInstance.on('close', () => {
      uiStore.isChatModalOpen = false

      if (agentStatusStore.isSSEActive())
        stopAgent({
          chatId: chat.value?.id || '',
          threadId: chat.value?.threadId || '',
        })
    })

    uiStore.chatModalHSInstance.on('open', () => {
      uiStore.isChatModalOpen = true
    })
  }
}

onMounted(() => {
  window.HSStaticMethods.autoInit()

  initEditTaskModal()
  initCategoryEditModal()
  initBoardEditModal()
  initWorkspaceEditModal()
  initSettingsModal()
  initChatModal()

  rootStore.updateWorkspaceFromRoute()
})
</script>

<template>
  <Sidebar v-if="activeWorkspace" />
  <main
    class="bg-gray-100 transition-all duration-300 fixed inset-0 lg:py-3 lg:px-3 lg:ps-70"
    :class="{
      'lg:ps-3!': !uiStore.isSidebarOpen,
    }"
  >
    <div
      class="h-full overflow-hidden flex flex-col px-3 sm:px-5 bg-white lg:border lg:border-gray-200 lg:shadow-xs lg:rounded-md"
    >
      <Board v-if="uiStore.currentTab === Tabs.Board && boards.length > 0" />
      <Start v-else-if="uiStore.currentTab === Tabs.Board" />
      <Archive v-else-if="uiStore.currentTab === Tabs.Archive" />
    </div>

    <Teleport to="body">
      <TaskEdit />
      <CategoryEdit />
      <BoardEdit />
      <WorkspaceEdit />
      <Settings />
      <Chat />
      <Tip />
      <MobileSearch />
    </Teleport>
  </main>
</template>
