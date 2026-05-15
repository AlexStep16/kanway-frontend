<script setup lang="ts">
import type { IBoard } from '~/interfaces/domain/IBoard'
import { SquareKanban } from 'lucide-vue-next'
import Title from './Title.vue'

const boardStore = useBoardStore()
const workspaceStore = useWorkspaceStore()

const name = ref('')

const activeBoardId = computed(() => boardStore.activeBoardId)
const activeWorkspaceId = computed(() => workspaceStore.activeWorkspaceId)

const { isPending: areBoardsLoading } = useBoards(activeWorkspaceId)

const { mutate: updateBoard } = useUpdateBoard()
const board = useBoardSelector(activeBoardId, activeWorkspaceId)

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
