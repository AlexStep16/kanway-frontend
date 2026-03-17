<script setup lang="ts">
import ChatEntityTempWrapper from '../ChatEntityTempWrapper.vue'
import WorkspaceCard from '@/components/Workspace/WorkspaceCard.vue'
import { IWorkspace } from '@/interfaces/domain/IWorkspace'

const props = defineProps<{
  workspace: IWorkspace
  hasCheckbox?: boolean
}>()

const selectedIds = defineModel('selectedIds', {
  type: Array as () => string[],
  default: () => [],
})
</script>

<template>
  <ChatEntityTempWrapper :entity="workspace" v-model:selected-ids="selectedIds">
    <template #default="{ entity }">
      <WorkspaceCard
        :workspace="entity"
        :options="{
          hasBorder: true,
          hasCopy: false,
          hasCheckbox: hasCheckbox,
          hasDelete: false,
          isStatic: true,
          showInfo: true,
        }"
        :selected-ids="selectedIds"
        classes="self-start"
      />
    </template>
  </ChatEntityTempWrapper>
</template>
