<script setup lang="ts">
import { computed, ref } from 'vue'
import { useUIStore } from '@/stores/ui'
import EntityCard from '../EntityCard.vue'
import { useArchiveCategory } from '@/composables/categories/mutations/useArchiveCategory'
import { useCloneCategory } from '@/composables/categories/mutations/useCloneCategory'
import { useCategoryMutationStatus } from '@/composables/categories/mutations/useCategoryMutationStatus'
import { IBoard } from '@/interfaces/domain/IBoard'
import { useArchiveBoard } from '@/composables/boards/mutations/useArchiveBoard'
import { useCloneBoard } from '@/composables/boards/mutations/useCloneBoard'
import { useBoardMutationStatus } from '@/composables/boards/mutations/useBoardMutationStatus'

const props = defineProps<{
  board: IBoard
  options?: {
    hasBorder?: boolean
    hasCheckbox?: boolean
    hasCopy?: boolean
    hasDelete?: boolean
    showInfo?: boolean
    isStatic?: boolean
  }
  selectedIds?: string[]
  classes?: string
}>()

const uiStore = useUIStore()

// --- Mutations ---
const { mutate: archiveBoard } = useArchiveBoard()
const { mutate: cloneBoard } = useCloneBoard()

const status = useBoardMutationStatus(computed(() => props.board.id))

function handleEdit() {
  if (props.options?.isStatic) return

  uiStore.openBoardToEdit(props.board)
}

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
    @edit="handleEdit"
    @copy="handleCopy"
    @archive="handleArchive"
  />
</template>
