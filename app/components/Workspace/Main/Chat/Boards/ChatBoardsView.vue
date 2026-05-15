<script setup lang="ts">
import ChatBoard from '~/components/Workspace/Main/Chat/Boards/ChatBoard.vue'
import ChatBoardTemp from '~/components/Workspace/Main/Chat/Boards/ChatBoardTemp.vue'
import ColumnsView from '~/components/Workspace/Main/ColumnsView.vue'
import type { IBoard } from '~/interfaces/domain/IBoard'
import type { IChatMessage } from '~/interfaces/domain/IChatMessage'

const props = defineProps<{
  message: IChatMessage
  items: IBoard[]
  isSelectable?: boolean
  isTemporary?: boolean
  minSelect?: number
  maxSelect?: number
}>()

const selectedIds = defineModel('selectedIds', {
  type: Array as () => string[],
  default: () => [],
})

const messagesContainerRefMap = ref<Record<string, HTMLElement | null>>({})

const selectedBoardsCount = computed(() => {
  return selectedIds.value.length
})

function hasCheckbox(board: IBoard) {
  if (!props.isSelectable) return false
  if ((props.minSelect ?? 0) > 0 || (props.maxSelect ?? 0) > 0) {
    if ((props.minSelect ?? 0) > 0 && selectedBoardsCount.value < (props.minSelect ?? 0)) {
      return true
    }
    if ((props.maxSelect ?? 0) > 0 && selectedBoardsCount.value >= (props.maxSelect ?? 0)) {
      return selectedIds.value.includes(board.id)
    }
    return true
  }
  return true
}
</script>

<template>
  <div
    class="flex gap-2 w-full"
    :ref="
      (el) => {
        messagesContainerRefMap[message.id] = el as HTMLElement | null
      }
    "
  >
    <ColumnsView
      :initialCountShown="10"
      :items="items"
      :containerRef="messagesContainerRefMap[message.id]!"
    >
      <template v-slot:default="slotProps">
        <template v-if="!isTemporary">
          <ChatBoard
            v-for="board in slotProps.data"
            :key="board.id"
            :board="board"
            :hasCheckbox="hasCheckbox(board)"
            v-model:selectedIds="selectedIds"
          />
        </template>
        <template v-else>
          <ChatBoardTemp
            v-for="board in slotProps.data"
            :key="board.id"
            :board="board"
            :hasCheckbox="hasCheckbox(board)"
            v-model:selectedIds="selectedIds"
          />
        </template>
      </template>
    </ColumnsView>
  </div>
</template>
