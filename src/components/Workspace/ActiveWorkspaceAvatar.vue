<script setup lang="ts">
import { useWorkspaceDataStore } from '@stores/workspaceData'

defineProps<{
  size?: string
}>()

const WORKSPACE_STORE = useWorkspaceDataStore()
</script>

<template>
  <div
    class="shrink-0 rounded-md flex items-center justify-center font-semibold text-white"
    :class="'size-' + (size || 7)"
    :style="{ backgroundColor: WORKSPACE_STORE.activeWorkspace?.color || '#3B82F6' }"
  >
    {{ WORKSPACE_STORE.getFirstLetterOfActiveWorkspace }}
  </div>
</template>
