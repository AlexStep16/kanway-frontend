<script setup lang="ts">
import { useBoardStore } from '@/stores/board'
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useUpdateBoard } from '@/composables/boards/mutations/useUpdateBoard'
import { useWorkspaceStore } from '@/stores/workspace'
import { useBoardMutationStatus } from '@/composables/boards/mutations/useBoardMutationStatus'
import { useBoard } from '@/composables/boards/useBoard'
import { IBoard } from '@/interfaces/domain/IBoard'
import { useBoards } from '@/composables/boards/queries/useBoards'
import { SquareKanban } from 'lucide-vue-next'
import Title from './Title.vue'

const boardStore = useBoardStore()
const workspaceStore = useWorkspaceStore()

const name = ref('')

const { activeBoardId } = storeToRefs(boardStore)
const { activeWorkspaceId } = storeToRefs(workspaceStore)

const { isPending: areBoardsLoading } = useBoards(activeWorkspaceId)

const { mutate: updateBoard } = useUpdateBoard()
const board = useBoard(activeBoardId, activeWorkspaceId)

const { isBusy } = useBoardMutationStatus(activeBoardId)

function updateBoardName(newName: string) {
  if (!activeWorkspaceId.value) return

  if (newName && activeBoardId.value) {
    updateBoard({
      payload: { id: activeBoardId.value, name: newName },
      workspaceId: activeWorkspaceId.value,
    })
  }
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
  <Title
    :initialName="name"
    :isLoading="areBoardsLoading"
    :isBusy="isBusy"
    @updateName="updateBoardName"
  >
    <SquareKanban class="size-4" />
  </Title>
</template>
