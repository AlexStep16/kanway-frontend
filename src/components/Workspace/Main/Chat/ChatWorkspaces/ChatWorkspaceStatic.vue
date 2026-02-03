<script setup lang="ts">
import EntityCard from '@/components/Workspace/Main/EntityCard.vue'
import { IWorkspace } from '@/interfaces/domain/IWorkspace'

defineProps<{
  workspace: IWorkspace & { isSelected?: boolean; tempId: string }
}>()
</script>

<template>
  <EntityCard
    :id="workspace.tempId || workspace.id"
    :hasSelected="true"
    :isSelected="workspace.isSelected"
    :isStatic="true"
    :name="workspace.name"
  />
</template>
