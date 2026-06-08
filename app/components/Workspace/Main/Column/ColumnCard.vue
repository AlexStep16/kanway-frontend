<script setup lang="ts">
import EntityCard, { type EntityCardOptions } from '../EntityCard.vue'
import type { IColumnState } from '~/stores/interfaces/IColumnState'

const props = defineProps<{
  column: IColumnState
  options?: EntityCardOptions
  selectedIds?: string[]
  classes?: string
}>()

// --- Mutations ---
const { mutate: archiveColumn } = useArchiveColumn()
const { mutate: cloneColumn } = useCloneColumn()

const status = useColumnMutationStatus(computed(() => props.column.id))

function handleCopy() {
  if (props.options?.isStatic) return

  cloneColumn({ id: props.column.id })
}

function handleArchive() {
  if (props.options?.isStatic) return

  archiveColumn({ column: props.column })
}
</script>

<template>
  <EntityCard
    :entity="column"
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
