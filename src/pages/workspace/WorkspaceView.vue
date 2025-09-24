<script setup lang="ts">
import { onMounted } from 'vue'
import Sidebar from '@/components/Workspace/Sidebars/Sidebar.vue'
import Edit from '@/components/Workspace/Main/Task/Edit.vue'
import Board from '@/components/Workspace/Main/Board.vue'
import Archive from '@/components/Workspace/Main/Archive/Archive.vue'
import Start from '@/components/Workspace/Main/Start.vue'
import { useWorkspaceStore } from '@/stores/workspace'
import { useTaskStore } from '@/stores/task'
import { HSOverlay } from 'preline/dist'

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

onMounted(() => {
  window.HSStaticMethods.autoInit()

  initEditTaskModal()
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
      <Board v-if="false" />
      <Archive />
      <Start v-if="false" />
    </div>

    <Teleport to="body">
      <Edit />
    </Teleport>
  </main>
</template>
