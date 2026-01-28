<script setup lang="ts">
import { useWorkspace } from '@/composables/workspaces/useWorkspace'
import { useWorkspaceStore } from '@/stores/workspace'
import { storeToRefs } from 'pinia'

const workspaceStore = useWorkspaceStore()

const { activeWorkspaceId } = storeToRefs(workspaceStore)

const activeWorkspace = useWorkspace(activeWorkspaceId)

defineProps<{
  size?: string
}>()
</script>

<template>
  <div
    class="shrink-0 rounded-md flex items-center justify-center font-semibold text-white"
    :class="'size-' + (size || 7)"
    :style="{ backgroundColor: activeWorkspace?.color || '#3B82F6' }"
  >
    {{ activeWorkspace?.name.charAt(0).toUpperCase() }}
  </div>
</template>
