<script setup lang="ts">
import ChatEntityTempWrapper from '../ChatEntityTempWrapper.vue'
import BoardCard from '~/components/Workspace/Main/Board/BoardCard.vue'
import type { IBoard } from '~/interfaces/domain/IBoard'

const props = defineProps<{
  board: IBoard
  hasCheckbox?: boolean
}>()

const selectedIds = defineModel('selectedIds', {
  type: Array as () => string[],
  default: () => [],
})
</script>

<template>
  <ChatEntityTempWrapper :entity="board" v-model:selected-ids="selectedIds">
    <template #default="{ entity }">
      <BoardCard
        :board="entity"
        :options="{
          hasBorder: true,
          hasCheckbox: hasCheckbox,
          isStatic: true,
          showInfo: true,
        }"
        :selected-ids="selectedIds"
        classes="self-start"
      />
    </template>
  </ChatEntityTempWrapper>
</template>
