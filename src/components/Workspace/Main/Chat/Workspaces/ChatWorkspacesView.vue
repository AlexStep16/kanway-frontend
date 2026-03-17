<script setup lang="ts">
import { computed, ref } from 'vue'
import ColumnsView from '@/components/Workspace/Main/ColumnsView.vue'
import { IWorkspace } from '@/interfaces/domain/IWorkspace'
import ChatWorkspace from './ChatWorkspace.vue'
import ChatWorkspaceTemp from './ChatWorkspaceTemp.vue'
import { IChatMessage } from '@/interfaces/domain/IChatMessage'

const props = defineProps<{
  message: IChatMessage
  items: IWorkspace[]
  isSelectable: boolean
  isTemporary?: boolean
  minSelect?: number
  maxSelect?: number
}>()

const selectedIds = defineModel('selectedIds', {
  type: Array as () => string[],
  default: () => [],
})

const messagesContainerRefMap = ref<Record<string, HTMLElement | null>>({})

const selectedWorkspacesCount = computed(() => {
  return selectedIds.value.length
})

const hasCheckbox = computed(() => (workspace: IWorkspace) => {
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
})
</script>

<template>
  <div
    class="flex gap-2 mt-3 w-full"
    :ref="
      (el) => {
        messagesContainerRefMap[message.id] = el as HTMLElement
      }
    "
  >
    <ColumnsView :items="items" :containerRef="messagesContainerRefMap[message.id]">
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
