<script setup lang="ts">
import EntityCard, { type EntityCardOptions } from '../EntityCard.vue'
import type { IBoard } from '~/interfaces/domain/IBoard'

const props = defineProps<{
  board: IBoard
  options?: EntityCardOptions
  selectedIds?: string[]
  classes?: string
}>()

// --- Mutations ---
const { mutate: archiveBoard } = useArchiveBoard()
const { mutate: cloneBoard } = useCloneBoard()

const status = useBoardMutationStatus(computed(() => props.board.id))

function handleCopy() {
  if (props.options?.isStatic) return

  cloneBoard({ id: props.board.id })
}

function handleArchive() {
  if (props.options?.isStatic) return

  archiveBoard({ board: props.board })
}
</script>

<template>
  <EntityCard
    :entity="board"
    :options="options"
    :classes="classes"
    :status="status"
    :selected-ids="selectedIds"
    @copy="handleCopy"
    @archive="handleArchive"
  >
    <slot />
  </EntityCard>
</template>
