<script setup lang="ts">
import { SquarePen, SquareKanban } from 'lucide-vue-next'
import { useBoardDataStore } from '@/stores/boardData'
import { computed, nextTick, ref } from 'vue'
import Spinner from '@/components/Loader/Spinner.vue'

const isInputVisible = ref(false)
const inputRef = ref<HTMLInputElement | null>(null)

function toggleInputVisibility() {
  isInputVisible.value = !isInputVisible.value

  nextTick(() => {
    if (isInputVisible.value && inputRef.value) {
      inputRef.value.focus()
    }
  })
}

function updateBoardName(event: FocusEvent) {
  const target = event.target as HTMLInputElement
  const newName = target.value.trim()

  if (newName && BOARD_STORE.activeBoard) {
    BOARD_STORE.updateBoard({ ...BOARD_STORE.activeBoard, name: newName })
  }

  isInputVisible.value = false
}

const getName = computed(() => {
  return BOARD_STORE.activeBoard?.name || 'Без названия'
})

const getBoardId = computed(() => {
  return BOARD_STORE.activeBoard?._id || ''
})

const BOARD_STORE = useBoardDataStore()
</script>

<template>
  <div class="flex gap-x-1 items-center min-w-0 text-gray-800 focus:outline-hidden">
    <div class="shrink-0">
      <div
        v-if="BOARD_STORE.isBoardEditing(getBoardId)"
        class="size-5 flex items-center justify-center"
      >
        <Spinner class="size-4 text-gray-500" />
      </div>
      <SquareKanban v-else class="size-5" />
    </div>

    <button
      type="button"
      class="flex gap-x-2 h-9 items-center text-lg font-semibold rounded-sm text-gray-800 px-1 hover:bg-gray-100 transition-colors duration-100 group"
      @click="toggleInputVisibility"
      v-show="!isInputVisible"
    >
      {{ getName }}
      <SquarePen
        class="size-4 text-gray-400 group-hover:text-gray-500 transition-colors duration-100"
      />
    </button>

    <input
      type="text"
      class="text-lg h-9 rounded-sm font-semibold px-2 text-gray-800 bg-transparent border-none focus:outline-none focus:ring-2 focus:bg-gray-100 hover:bg-gray-100 transition-colors duration-100"
      :class="{ hidden: !isInputVisible }"
      :value="getName"
      @blur="updateBoardName"
      v-autowidth
      ref="inputRef"
      v-show="isInputVisible"
    />
  </div>
</template>
