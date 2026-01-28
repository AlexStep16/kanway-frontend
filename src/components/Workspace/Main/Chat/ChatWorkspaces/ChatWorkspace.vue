<script setup lang="ts">
import TaskSkeleton from '@/components/Workspace/Main/Task/TaskSkeleton.vue'
import EntityCard from '@/components/Workspace/Main/EntityCard.vue'
import { useWorkspaces } from '@/composables/workspaces/queries/useWorkspaces'
import { IWorkspace } from '@/interfaces/domain/IWorkspace'
import { computed } from 'vue'

const props = defineProps<{
  workspace: IWorkspace & { isSelected?: boolean }
}>()

const { data: workspaces, isPending: isLoading } = useWorkspaces(!!props.workspace.id)

const realWorkspace = computed(() => {
  return workspaces.value?.find((ws) => ws.id === props.workspace.id)
})

const realWorkspaceExtended = computed(() => {
  if (!realWorkspace.value) return null

  return {
    ...realWorkspace.value,
    isSelected: props.workspace.isSelected,
  }
})
</script>

<template>
  <EntityCard
    :id="realWorkspaceExtended.id || (realWorkspaceExtended as any).tempId"
    :isSelected="realWorkspaceExtended.isSelected"
    :name="realWorkspaceExtended.name"
    v-if="realWorkspaceExtended && !isLoading"
  />

  <TaskSkeleton v-else />
</template>
