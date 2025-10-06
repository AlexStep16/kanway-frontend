<script setup lang="ts">
import { onMounted } from 'vue'
import Sidebar from '@/components/Workspace/Sidebar/Sidebar.vue'
import Edit from '@/components/Workspace/Main/Task/Edit.vue'
import Board from '@/components/Workspace/Main/Board.vue'
import Archive from '@/components/Workspace/Main/Archive/Archive.vue'
import Start from '@/components/Workspace/Main/Start.vue'
import { useWorkspaceStore } from '@/stores/workspace'
import { useTaskStore } from '@/stores/task'
import { HSOverlay } from 'preline/dist'
import Settings from '@/components/Workspace/Settings/Settings.vue'
import Chat from '@/components/Workspace/Main/Chat/Chat.vue'
import Tip from '@/components/Tip/Tip.vue'

const WORKSPACE_STORE = useWorkspaceStore()
const TASK_STORE = useTaskStore()

function initEditTaskModal() {
  if (WORKSPACE_STORE.editTaskModalRef) {
    WORKSPACE_STORE.editTaskModalHSInstance = new HSOverlay(WORKSPACE_STORE.editTaskModalRef)

    WORKSPACE_STORE.editTaskModalHSInstance.on('close', () => {
      TASK_STORE.clearTaskToEdit()
    })
  }
}

function initSettingsModal() {
  if (WORKSPACE_STORE.settingsModalRef) {
    WORKSPACE_STORE.settingsModalHSInstance = new HSOverlay(WORKSPACE_STORE.settingsModalRef)
  }
}

function initChatModal() {
  if (WORKSPACE_STORE.chatModalRef) {
    WORKSPACE_STORE.chatModalHSInstance = new HSOverlay(WORKSPACE_STORE.chatModalRef)
  }
}

onMounted(() => {
  window.HSStaticMethods.autoInit()

  initEditTaskModal()
  initSettingsModal()
  initChatModal()
})
</script>

<template>
  <Sidebar />
  <main
    class="bg-gray-100 transition-all duration-300 fixed inset-0 py-3 px-3"
    :class="{ 'ps-70': WORKSPACE_STORE.isSidebarOpen }"
  >
    <div
      class="h-full overflow-hidden flex flex-col px-5 bg-white border border-gray-200 shadow-xs rounded-md"
    >
      <Board />
      <Archive v-if="false" />
      <Start v-if="false" />
    </div>

    <Teleport to="body">
      <Edit />
    </Teleport>

    <Teleport to="body">
      <Settings />
    </Teleport>

    <Teleport to="body">
      <Chat />
    </Teleport>

    <Teleport to="body">
      <Tip />
    </Teleport>
  </main>
</template>
