<script setup lang="ts">
import ColumnsView from '~/components/Workspace/Main/ColumnsView.vue'
import type { IWorkspace } from '~/interfaces/domain/IWorkspace'
import ChatWorkspace from './ChatWorkspace.vue'
import ChatWorkspaceTemp from './ChatWorkspaceTemp.vue'

const props = defineProps<{
  items: IWorkspace[]
  isSelectable?: boolean
  isTemporary?: boolean
  minSelect?: number
  maxSelect?: number
}>()

const selectedIds = defineModel('selectedIds', {
  type: Array as () => string[],
  default: () => [],
})

const messagesContainerRef = ref<HTMLElement | null>(null)

const selectedWorkspacesCount = computed(() => {
  return selectedIds.value.length
})

function hasCheckbox(workspace: IWorkspace) {
  if (!props.isSelectable) return false
  if ((props.minSelect ?? 0) > 0 || (props.maxSelect ?? 0) > 0) {
    if ((props.minSelect ?? 0) > 0 && selectedWorkspacesCount.value < (props.minSelect ?? 0)) {
      return true
    }
    if ((props.maxSelect ?? 0) > 0 && selectedWorkspacesCount.value >= (props.maxSelect ?? 0)) {
      return selectedIds.value.includes(workspace.id)
    }
    return true
  }
  return true
}
</script>

<template>
  <div
    class="flex gap-2 w-full"
    ref="messagesContainerRef"
  >
    <ColumnsView
      :initialCountShown="10"
      :items="items"
      :containerRef="messagesContainerRef"
    >
      <template v-slot:default="slotProps">
        <template v-if="!isTemporary">
          <ChatWorkspace
            v-for="workspace in slotProps.data"
            :key="workspace.id"
            :workspace="workspace"
            :hasCheckbox="hasCheckbox(workspace)"
            v-model:selectedIds="selectedIds"
        /></template>
        <template v-else>
          <ChatWorkspaceTemp
            v-for="workspace in slotProps.data"
            :key="workspace.id"
            :workspace="workspace"
            :hasCheckbox="hasCheckbox(workspace)"
            v-model:selectedIds="selectedIds"
          />
        </template>
      </template>
    </ColumnsView>
  </div>
</template>
