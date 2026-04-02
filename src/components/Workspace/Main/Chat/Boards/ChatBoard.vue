<script setup lang="ts">
import ChatEntityWrapper from '../ChatEntityWrapper.vue'
import EntityCardSkeleton from '../../EntityCardSkeleton.vue'
import { IBoard } from '@/interfaces/domain/IBoard'
import { useBoard } from '@/composables/boards/queries/useBoard'
import BoardCard from '../../Board/BoardCard.vue'

const props = defineProps<{
  board: IBoard
  hasCheckbox?: boolean
}>()

const selectedIds = defineModel('selectedIds', {
  type: Array as () => string[],
  default: () => [],
})

const { data, isPending } = useBoard(props.board.id, props.board.workspace?.id)
</script>

<template>
  <ChatEntityWrapper
    :data="data"
    :is-pending="isPending"
    :entity-id="board.id"
    :has-checkbox="hasCheckbox"
    v-model:selected-ids="selectedIds"
  >
    <template #default="{ entity, hasCheckbox, selectedIds, toggleSelect }">
      <BoardCard
        :board="entity"
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
