<script setup lang="ts">
import { SquarePen, SquareKanban } from 'lucide-vue-next'
import { useBoardStore } from '@/stores/board'
import { nextTick, ref, watch } from 'vue'
import Spinner from '@/components/Loader/Spinner.vue'
import { Nullable } from '@/types/utils'
import { storeToRefs } from 'pinia'
import { useUpdateBoard } from '@/composables/boards/mutations/useUpdateBoard'
import { useWorkspaceStore } from '@/stores/workspace'
import { useBoardMutationStatus } from '@/composables/boards/mutations/useBoardMutationStatus'
import { useBoard } from '@/composables/boards/useBoard'
import { IBoard } from '@/interfaces/domain/IBoard'

const isInputVisible = ref(false)
const inputRef = ref<Nullable<HTMLInputElement>>(null)
const boardStore = useBoardStore()
const workspaceStore = useWorkspaceStore()

const name = ref('')

const { activeBoardId } = storeToRefs(boardStore)
const { activeWorkspaceId } = storeToRefs(workspaceStore)

const { mutate: updateBoard } = useUpdateBoard()
const board = useBoard(activeBoardId, activeWorkspaceId)

const { isBusy } = useBoardMutationStatus(activeBoardId)

function showInput() {
  isInputVisible.value = true

  nextTick(() => {
    if (inputRef.value) {
      inputRef.value.focus()
    }
  })
}

function updateBoardName(event: Event) {
  if (!activeWorkspaceId.value) return

  const target = event.target as HTMLInputElement
  const newName = target.value.trim()

  if (newName && activeBoardId.value) {
    updateBoard({
      payload: { id: activeBoardId.value, name: newName },
      workspaceId: activeWorkspaceId.value,
    })
  }

  isInputVisible.value = false
}

function resetForm() {
  isInputVisible.value = false

  name.value = board.value?.name || 'Без названия'
}

watch(
  board,
  (newBoard: IBoard | null) => {
    name.value = newBoard?.name || 'Без названия'
  },
  { immediate: true },
)
</script>

<template>
  <div class="flex gap-x-1 items-center min-w-0 text-gray-800 focus:outline-hidden">
    <div class="shrink-0">
      <div v-if="isBusy" class="size-5 flex items-center justify-center">
        <Spinner class="size-4 text-gray-500" />
      </div>
      <SquareKanban v-else class="size-5" />
    </div>

    <button
      type="button"
      class="flex gap-x-2 h-9 items-center text-lg font-semibold rounded-sm text-gray-800 px-2 hover:bg-gray-100 transition-colors duration-100 group"
      @click="showInput"
      v-show="!isInputVisible"
    >
      {{ name }}
      <SquarePen
        class="size-4 text-gray-400 group-hover:text-gray-500 transition-colors duration-100"
      />
    </button>

    <input
      type="text"
      class="text-lg h-9 rounded-sm font-semibold px-2 text-gray-800 bg-transparent border-none focus:outline-none focus:ring-2 focus:bg-gray-100 hover:bg-gray-100 transition-colors duration-100"
      v-model="name"
      @keydown.enter="updateBoardName"
      @keydown.esc="resetForm"
      @blur="resetForm"
      v-autowidth
      ref="inputRef"
      v-show="isInputVisible"
    />
  </div>
</template>
