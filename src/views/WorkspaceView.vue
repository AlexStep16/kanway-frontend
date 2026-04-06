<script setup lang="ts">
import { computed, onMounted } from 'vue'
import TaskEdit from '@components/Workspace/Main/Task/Edit/Edit.vue'
import CategoryEdit from '@components/Workspace/Main/Category/Edit.vue'
import BoardEdit from '@components/Workspace/Main/Board/Edit.vue'
import WorkspaceEdit from '@components/Workspace/Edit.vue'
import { useUIStore } from '@stores/ui'
import { HSOverlay } from 'preline/dist'
import Settings from '@components/Workspace/Settings/Settings.vue'
import Tip from '@components/Tip/Tip.vue'
import MobileSearch from '@components/Workspace/MobileSearch.vue'
import { useChatStore } from '@stores/chat'
import { useAgentStatusStore } from '@stores/agentStatus'
import { storeToRefs } from 'pinia'
import { useStopAgent } from '@/composables/chat/mutations/useStopAgent'
import { useChat } from '@/composables/chat/queries/useChat'
import { useRootStore } from '@/stores/root'
import Support from '@/components/Workspace/Main/Support/Support.vue'
import Plans from '@/components/Workspace/Main/Subscription/Plans.vue'
import Sidebar from '@/components/Workspace/Sidebar/Sidebar.vue'
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

onMounted(() => {
  window.HSStaticMethods.autoInit()

  initEditTaskModal()
  initCategoryEditModal()
  initBoardEditModal()
  initWorkspaceEditModal()
  initSettingsModal()
  initSupportModal()
  initPlansModal()

  rootStore.updateWorkspaceFromRoute()
})
</script>

<template>
  <Sidebar />
  <WorkspaceDialog />

  <Teleport to="body">
    <TaskEdit />
    <CategoryEdit />
    <BoardEdit />
    <WorkspaceEdit />
    <Settings />
    <Tip />
    <MobileSearch />
    <Support />
    <Plans />
  </Teleport>
</template>
