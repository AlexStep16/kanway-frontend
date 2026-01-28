<script setup lang="ts">
import EntityCard from '@/components/Workspace/Main/EntityCard.vue'
import { IBoard } from '@/interfaces/domain/IBoard'

defineProps<{
  board: IBoard & { isSelected?: boolean; tempId: string }
}>()
</script>

<template>
  <EntityCard
    :id="board.tempId"
    :isSelected="board.isSelected"
    :name="board.name"
    :parentName="board.workspace.name"
    :isStatic="true"
    :showInfo="true"
  />
</template>
