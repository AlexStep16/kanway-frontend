<script setup lang="ts">
import { SquarePen, SquareKanban } from 'lucide-vue-next'
import { useBoardStore } from '@/stores/board'
import { computed, nextTick, ref } from 'vue'
import Spinner from '@/components/Loader/Spinner.vue'
import { Nullable } from '@/types/utils'
import { storeToRefs } from 'pinia'
import { useUpdateBoard } from '@/composables/boards/mutations/useUpdateBoard'
import { useWorkspaceStore } from '@/stores/workspace'
import { useBoardMutationStatus } from '@/composables/boards/mutations/useBoardMutationStatus'
import { useBoard } from '@/composables/boards/queries/useBoard'

const isInputVisible = ref(false)
const inputRef = ref<Nullable<HTMLInputElement>>(null)
const boardStore = useBoardStore()
const workspaceStore = useWorkspaceStore()

const { activeBoardId } = storeToRefs(boardStore)
const { activeWorkspaceId } = storeToRefs(workspaceStore)

const { mutate: updateBoard } = useUpdateBoard()
const { data: board } = useBoard(activeBoardId)
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

const boardName = computed(() => {
  return board.value?.name || 'Без названия'
})
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
      {{ boardName }}
      <SquarePen
        class="size-4 text-gray-400 group-hover:text-gray-500 transition-colors duration-100"
      />
    </button>

    <input
      type="text"
      class="text-lg h-9 rounded-sm font-semibold px-2 text-gray-800 bg-transparent border-none focus:outline-none focus:ring-2 focus:bg-gray-100 hover:bg-gray-100 transition-colors duration-100"
      :value="boardName"
      @keydown.enter="updateBoardName"
      @keydown.esc="isInputVisible = false"
      @blur="isInputVisible = false"
      v-autowidth
      ref="inputRef"
      v-show="isInputVisible"
    />
  </div>
</template>
