<script setup lang="ts">
import { onMounted } from 'vue'
import Sidebar from '@components/Workspace/Sidebar/Sidebar.vue'
import Edit from '@components/Workspace/Main/Task/Edit.vue'
import Board from '@components/Workspace/Main/Board.vue'
import Archive from '@components/Workspace/Main/Archive/Archive.vue'
import Start from '@components/Workspace/Main/Start.vue'
import { useUIStore } from '@/stores/ui'
import { useTaskStore } from '@/stores/task'
import { HSOverlay } from 'preline/dist'
import Settings from '@components/Workspace/Settings/Settings.vue'
import Chat from '@components/Workspace/Main/Chat/Chat.vue'
import Tip from '@components/Tip/Tip.vue'
import MobileSearch from '@components/Workspace/MobileSearch.vue'
import Tabs from '@/enums/TabsEnum'
import { useRootStore } from '@stores/root'

const UI_STORE = useUIStore()
const TASK_STORE = useTaskStore()
const ROOT_STORE = useRootStore()

function initEditTaskModal() {
  if (UI_STORE.editTaskModalRef) {
    UI_STORE.editTaskModalHSInstance = new HSOverlay(UI_STORE.editTaskModalRef)

    UI_STORE.editTaskModalHSInstance.on('close', () => {
      TASK_STORE.clearTaskToEdit()
    })
  }
}

function initSettingsModal() {
  if (UI_STORE.settingsModalRef) {
    UI_STORE.settingsModalHSInstance = new HSOverlay(UI_STORE.settingsModalRef)
  }
}

function initChatModal() {
  if (UI_STORE.chatModalRef) {
    UI_STORE.chatModalHSInstance = new HSOverlay(UI_STORE.chatModalRef)
  }
}

onMounted(() => {
  window.HSStaticMethods.autoInit()

  initEditTaskModal()
  initSettingsModal()
  initChatModal()

  ROOT_STORE.updateWorkspaceFromRoute()
})
</script>

<template>
  <Sidebar />
  <main
    class="bg-gray-100 transition-all duration-300 fixed inset-0 lg:py-3 lg:px-3 lg:ps-70"
    :class="{
      'lg:ps-3!': !UI_STORE.isSidebarOpen,
    }"
  >
    <div
      class="h-full overflow-hidden flex flex-col px-3 sm:px-5 bg-white lg:border lg:border-gray-200 lg:shadow-xs lg:rounded-md"
    >
      <Board v-if="UI_STORE.currentTab === Tabs.Board" />
      <Archive v-if="UI_STORE.currentTab === Tabs.Archive" />
      <Start v-if="UI_STORE.currentTab === Tabs.Start" />
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

    <Teleport to="body">
      <MobileSearch />
    </Teleport>
  </main>
</template>
