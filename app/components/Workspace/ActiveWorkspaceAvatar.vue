<script setup lang="ts">
const workspaceStore = useWorkspaceStore()

const activeWorkspaceId = computed(() => workspaceStore.activeWorkspaceId)

const activeWorkspace = useWorkspaceSelector(activeWorkspaceId)

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
