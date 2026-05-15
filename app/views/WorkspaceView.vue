<script setup lang="ts">
import Settings from '~/components/Workspace/Settings/Settings.vue'
import Tip from '~/components/Tip/Tip.vue'
import MobileSearch from '~/components/Workspace/MobileSearch.vue'
import Support from '~/components/Workspace/Main/Support/Support.vue'
import Plans from '~/components/Workspace/Main/Subscription/Plans.vue'
import TaskEdit from '~/components/Workspace/Main/Task/Edit/TaskEdit.vue'
import SidebarMain from '~/components/Workspace/Sidebar/SidebarMain.vue'
import WorkspaceDialog from '~/components/Workspace/WorkspaceDialog.vue'

const uiStore = useUIStore()
const boardStore = useBoardStore()
const workspaceStore = useWorkspaceStore()

const route = useRoute()

const { data: workspacesData } = useWorkspaces()
const { data: boardsData } = useBoards(
  route.params.workspaceId as string,
  !!route.params.workspaceId,
)

const workspaces = computed(() => workspacesData.value || [])
const boards = computed(() => boardsData.value || [])

onMounted(() => {
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
  <SidebarMain />
  <WorkspaceDialog />

  <TaskEdit v-if="uiStore.isEditTaskModalOpen" />
  <Settings v-if="uiStore.isSettingsModalOpen" />
  <Tip />
  <MobileSearch v-if="uiStore.isMobileSearchOpen" />
  <Support v-if="uiStore.isSupportModalOpen" />
  <Plans v-if="uiStore.isPlansModalOpen" />
</template>
