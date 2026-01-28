<script setup lang="ts">
import { computed, ref } from 'vue'
import ColumnsView from '@/components/Workspace/Main/ColumnsView.vue'
import { IBoard } from '@/interfaces/domain/IBoard'
import ChatBoard from '@/components/Workspace/Main/Chat/ChatBoards/ChatBoard.vue'
import ChatBoardStatic from '@/components/Workspace/Main/Chat/ChatBoards/ChatBoardStatic.vue'

const props = defineProps<{
  message: {
    id: string
  }
  entities?: (IBoard & { isSelected?: boolean; tempId: string })[]
}>()

const messagesContainerRefMap = ref<Record<string, HTMLElement | null>>({})

function handleToggleSelect(boardId: string) {
  const realBoardProp = props.entities?.find((t) => t.id === boardId)
  const tempBoardProp = props.entities?.find((t) => t.tempId === boardId)

  const boardProp = realBoardProp || tempBoardProp

  if (boardProp) {
    boardProp.isSelected = !boardProp.isSelected
  }
}

const staticBoards = computed(() => props.entities?.filter((board) => !board.id) || [])
const realBoards = computed(() => props.entities?.filter((board) => board.id) || [])
</script>

<template>
  <div
    class="flex gap-2 mt-3 w-full"
    :ref="
      (el) => {
        messagesContainerRefMap[message.id] = el as HTMLElement
      }
    "
    v-if="entities && entities.length > 0"
  >
    <ColumnsView
      :items="realBoards"
      :containerRef="messagesContainerRefMap[message.id]"
      v-if="realBoards && realBoards.length > 0"
    >
      <template v-slot:default="slotProps">
        <ChatBoard
          v-for="item in slotProps.data"
          :key="item.id"
          :board="item"
          @toggle-select="handleToggleSelect"
        />
      </template>
    </ColumnsView>

    <ColumnsView
      :items="staticBoards"
      :containerRef="messagesContainerRefMap[message.id]"
      v-if="staticBoards && staticBoards.length > 0"
    >
      <template v-slot:default="slotProps">
        <ChatBoardStatic
          v-for="item in slotProps.data"
          :key="item.id"
          :board="item"
          @toggle-select="handleToggleSelect"
        />
      </template>
    </ColumnsView>
  </div>
</template>
