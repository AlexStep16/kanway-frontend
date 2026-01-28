<script setup lang="ts">
import TaskSkeleton from '@/components/Workspace/Main/Task/TaskSkeleton.vue'
import EntityCard from '@/components/Workspace/Main/EntityCard.vue'
import { IBoard } from '@/interfaces/domain/IBoard'
import { useBoard } from '@/composables/boards/queries/useBoard'
import { computed } from 'vue'

const props = defineProps<{
  board: IBoard & { isSelected?: boolean }
}>()

const { data: realBoard, isPending: isLoading } = useBoard(props.board.id, props.board.workspace.id)

const realBoardExtended = computed(() => {
  if (!realBoard.value) return null

  return {
    ...realBoard.value,
    isSelected: props.board.isSelected,
  }
})
</script>

<template>
  <EntityCard
    :id="realBoardExtended.id || (realBoardExtended as any).tempId"
    :isSelected="realBoardExtended.isSelected"
    :name="realBoardExtended.name"
    :parentName="realBoardExtended.workspace.name"
    :showInfo="true"
    v-if="realBoardExtended && !isLoading"
  />

  <TaskSkeleton v-else />
</template>
