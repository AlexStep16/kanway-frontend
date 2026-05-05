<script setup lang="ts">
import { computed, onMounted } from 'vue'
import TaskEdit from '@components/Workspace/Main/Task/Edit/Edit.vue'
import CategoryEdit from '@components/Workspace/Main/Category/Edit.vue'
import BoardEdit from '@components/Workspace/Main/Board/Edit.vue'
import WorkspaceEdit from '@components/Workspace/Edit.vue'
import { useUIStore } from '@stores/ui'
import { HSOverlay, HSStaticMethods } from 'preline/dist'
import Settings from '@components/Workspace/Settings/Settings.vue'
import Tip from '@components/Tip/Tip.vue'
import MobileSearch from '@components/Workspace/MobileSearch.vue'
import Support from '@/components/Workspace/Main/Support/Support.vue'
import Plans from '@/components/Workspace/Main/Subscription/Plans.vue'
import Sidebar from '@/components/Workspace/Sidebar/Sidebar.vue'
import WorkspaceDialog from '@/components/Workspace/WorkspaceDialog.vue'
import { useBoardStore } from '@/stores/board'
import { useWorkspaces } from '@/composables/workspaces/queries/useWorkspaces'
import { useWorkspaceStore } from '@/stores/workspace'
import { useBoards } from '@/composables/boards/queries/useBoards'
import { useRoute } from 'vue-router'

const uiStore = useUIStore()
const boardStore = useBoardStore()
const workspaceStore = useWorkspaceStore()

const route = useRoute()

const { data: workspacesData } = useWorkspaces()
const { data: boardsData } = useBoards(route.params.workspaceId as string)

const workspaces = computed(() => workspacesData.value || [])
const boards = computed(() => boardsData.value || [])

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
  HSStaticMethods.autoInit()

  initEditTaskModal()
  initCategoryEditModal()
  initBoardEditModal()
  initWorkspaceEditModal()
  initSettingsModal()
  initSupportModal()
  initPlansModal()
  console.log(route.params)
  const targetWorkspace = workspaces.value.find((w) => w.id === route.params.workspaceId)

  if (targetWorkspace) {
    workspaceStore.selectWorkspace(targetWorkspace, false, false)

    const board = boards.value.find((b) => b.id === route.params.boardId)

    if (board) {
      boardStore.selectBoard(board)
    }
  }
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
