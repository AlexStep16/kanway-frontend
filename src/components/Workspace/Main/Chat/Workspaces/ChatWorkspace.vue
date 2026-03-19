<script setup lang="ts">
import ChatEntityWrapper from '../ChatEntityWrapper.vue'
import EntityCardSkeleton from '../../EntityCardSkeleton.vue'
import { IWorkspace } from '@/interfaces/domain/IWorkspace'
import { useWorkspace } from '@/composables/workspaces/queries/useWorkspace'
import WorkspaceCard from '@/components/Workspace/WorkspaceCard.vue'

const props = defineProps<{
  workspace: IWorkspace
  hasCheckbox?: boolean
}>()

const selectedIds = defineModel('selectedIds', {
  type: Array as () => string[],
  default: () => [],
})

const { data, isPending } = useWorkspace(props.workspace.id)
</script>

<template>
  <ChatEntityWrapper
    :data="data"
    :is-pending="isPending"
    :entity-id="workspace.id"
    :has-checkbox="hasCheckbox"
    v-model:selected-ids="selectedIds"
  >
    <template #default="{ entity, hasCheckbox, selectedIds, toggleSelect }">
      <WorkspaceCard
        :workspace="entity"
        :options="{
          hasBorder: true,
          hasCheckbox: hasCheckbox,
          showInfo: true,
        }"
        :selected-ids="selectedIds"
        @toggleSelect="toggleSelect"
        classes="self-start"
      />
    </template>

    <template #skeleton>
      <EntityCardSkeleton />
    </template>
  </ChatEntityWrapper>
</template>
