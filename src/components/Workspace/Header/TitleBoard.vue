<script setup lang="ts">
import { SquarePen, SquareKanban } from 'lucide-vue-next'
import { useBoardStore } from '@/stores/board'
import { nextTick, ref, watch } from 'vue'
import Spinner from '@/components/ui/spinner/Spinner.vue'
import { Nullable } from '@/types/utils'
import { storeToRefs } from 'pinia'
import { useUpdateBoard } from '@/composables/boards/mutations/useUpdateBoard'
import { useWorkspaceStore } from '@/stores/workspace'
import { useBoardMutationStatus } from '@/composables/boards/mutations/useBoardMutationStatus'
import { useBoard } from '@/composables/boards/useBoard'
import { IBoard } from '@/interfaces/domain/IBoard'
import Input from '@/components/ui/input/Input.vue'
import Button from '@/components/ui/button/Button.vue'
import { useBoards } from '@/composables/boards/queries/useBoards'
import Skeleton from '@/components/ui/skeleton/Skeleton.vue'

const isInputVisible = ref(false)
const boardStore = useBoardStore()
const workspaceStore = useWorkspaceStore()

const name = ref('')

const { activeBoardId } = storeToRefs(boardStore)
const { activeWorkspaceId } = storeToRefs(workspaceStore)

const { isPending: areBoardsLoading } = useBoards(activeWorkspaceId)

const { mutate: updateBoard } = useUpdateBoard()
const board = useBoard(activeBoardId, activeWorkspaceId)

const { isBusy } = useBoardMutationStatus(activeBoardId)

function showInput() {
  isInputVisible.value = true
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
  <div class="flex gap-x-1 items-center min-w-0">
    <template v-if="!areBoardsLoading">
      <Button
        variant="secondary"
        class="px-1.5! group"
        size="sm"
        @click="showInput"
        v-if="!isInputVisible"
      >
        <div class="shrink-0 text-foreground">
          <Spinner class="size-4" v-if="isBusy" />
          <SquareKanban v-else class="size-4" />
        </div>
        <span>{{ name }}</span>
        <SquarePen class="size-3.5 text-muted-foreground opacity-0 group-hover:opacity-100" />
      </Button>

      <Input
        v-model="name"
        isFocused
        class="font-medium text-secondary-foreground px-2 h-8"
        @keydown.enter="updateBoardName"
        @keydown.esc="resetForm"
        @blur="resetForm"
        v-autowidth
        v-else
      />
    </template>
    <Skeleton class="h-8 w-32 rounded-md" v-else />
  </div>
</template>
