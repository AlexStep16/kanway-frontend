<script setup lang="ts">
import { computed, onMounted } from 'vue'
import Sidebar from '@components/Workspace/Sidebar/Sidebar.vue'
import TaskEdit from '@components/Workspace/Main/Task/Edit/Edit.vue'
import CategoryEdit from '@components/Workspace/Main/Category/Edit.vue'
import BoardEdit from '@components/Workspace/Main/Board/Edit.vue'
import WorkspaceEdit from '@components/Workspace/Edit.vue'
import { useUIStore } from '@stores/ui'
import { HSOverlay } from 'preline/dist'
import Settings from '@components/Workspace/Settings/Settings.vue'
import Chat from '@components/Workspace/Main/Chat/Chat.vue'
import Tip from '@components/Tip/Tip.vue'
import MobileSearch from '@components/Workspace/MobileSearch.vue'
import Tabs from '@/enums/TabsEnum'
import { useChatStore } from '@stores/chat'
import { useAgentStatusStore } from '@stores/agentStatus'
import { storeToRefs } from 'pinia'
import { useStopAgent } from '@/composables/chat/mutations/useStopAgent'
import { useChat } from '@/composables/chat/queries/useChat'
import { useRootStore } from '@/stores/root'
import Support from '@/components/Workspace/Main/Support/Support.vue'
import Plans from '@/components/Workspace/Main/Subscription/Plans.vue'
import SidebarNew from '@/components/Workspace/Sidebar/SidebarNew.vue'
import WorkspaceDialog from '@/components/Workspace/WorkspaceDialog.vue'

const rootStore = useRootStore()
const uiStore = useUIStore()
const chatStore = useChatStore()
const agentStatusStore = useAgentStatusStore()

const { activeChat } = storeToRefs(chatStore)

const activeChatId = computed(() => activeChat.value?.id || null)
const activeChatWorkspaceId = computed(() => activeChat.value?.workspaceId || null)

const chat = useChat(activeChatId, activeChatWorkspaceId)

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

function initSupportModal() {
  if (uiStore.supportModalRef) {
    uiStore.supportModalHSInstance = new HSOverlay(uiStore.supportModalRef)
  }
}

function initPlansModal() {
  if (uiStore.plansModalRef) {
    uiStore.plansModalHSInstance = new HSOverlay(uiStore.plansModalRef)
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
  initSupportModal()
  initPlansModal()

  rootStore.updateWorkspaceFromRoute()
})
</script>

<template>
  <SidebarNew />
  <WorkspaceDialog />

  <Teleport to="body">
    <TaskEdit />
    <CategoryEdit />
    <BoardEdit />
    <WorkspaceEdit />
    <Settings />
    <Chat />
    <Tip />
    <MobileSearch />
    <Support />
    <Plans />
  </Teleport>
</template>
