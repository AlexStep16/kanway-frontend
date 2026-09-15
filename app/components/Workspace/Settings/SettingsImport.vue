<script setup lang="ts">
import ImportBoards from '~/components/Import/ImportBoards.vue'

const workspaceStore = useWorkspaceStore()

const workspaceId = computed(() => workspaceStore.activeWorkspaceId ?? '')
</script>

<template>
  <div class="flex flex-col gap-y-5">
    <h3 class="text-lg font-bold text-gray-800">Импорт</h3>

    <div class="max-w-100">
      <ImportBoards
        v-if="workspaceId"
        :workspace-id="workspaceId"
        :show-back-button="false"
      />
    </div>
  </div>
</template>
