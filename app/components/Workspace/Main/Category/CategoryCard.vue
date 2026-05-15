<script setup lang="ts">
import EntityCard, { type EntityCardOptions } from '../EntityCard.vue'
import type { ICategoryState } from '~/stores/interfaces/ICategoryState'

const props = defineProps<{
  category: ICategoryState
  options?: EntityCardOptions
  selectedIds?: string[]
  classes?: string
}>()

// --- Mutations ---
const { mutate: archiveCategory } = useArchiveCategory()
const { mutate: cloneCategory } = useCloneCategory()

const status = useCategoryMutationStatus(computed(() => props.category.id))

function handleCopy() {
  if (props.options?.isStatic) return

  cloneCategory({ id: props.category.id })
}

function handleArchive() {
  if (props.options?.isStatic) return

  archiveCategory({ category: props.category })
}
</script>

<template>
  <EntityCard
    :entity="category"
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
