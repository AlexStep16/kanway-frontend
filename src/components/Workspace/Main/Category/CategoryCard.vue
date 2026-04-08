<script setup lang="ts">
import { computed, ref } from 'vue'
import { useUIStore } from '@/stores/ui'
import EntityCard, { EntityCardOptions } from '../EntityCard.vue'
import { ICategoryState } from '@/stores/interfaces/ICategoryState'
import { useArchiveCategory } from '@/composables/categories/mutations/useArchiveCategory'
import { useCloneCategory } from '@/composables/categories/mutations/useCloneCategory'
import { useCategoryMutationStatus } from '@/composables/categories/mutations/useCategoryMutationStatus'

const props = defineProps<{
  category: ICategoryState
  options?: EntityCardOptions
  selectedIds?: string[]
  classes?: string
}>()

const uiStore = useUIStore()

// --- Mutations ---
const { mutate: archiveCategory } = useArchiveCategory()
const { mutate: cloneCategory } = useCloneCategory()

const status = useCategoryMutationStatus(computed(() => props.category.id))

function handleEdit() {
  if (props.options?.isStatic) return

  uiStore.openCategoryToEdit(props.category)
}

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
    @edit="handleEdit"
    @copy="handleCopy"
    @archive="handleArchive"
  >
    <slot />
  </EntityCard>
</template>
