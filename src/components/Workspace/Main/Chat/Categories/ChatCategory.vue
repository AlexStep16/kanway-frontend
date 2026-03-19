<script setup lang="ts">
import ChatEntityWrapper from '../ChatEntityWrapper.vue'
import EntityCardSkeleton from '../../EntityCardSkeleton.vue'
import { ICategory } from '@/interfaces/domain/ICategory'
import { useCategory } from '@/composables/categories/queries/useCategory'
import CategoryCard from '../../Category/CategoryCard.vue'

const props = defineProps<{
  category: ICategory
  hasCheckbox?: boolean
}>()

const selectedIds = defineModel('selectedIds', {
  type: Array as () => string[],
  default: () => [],
})

const { data, isPending } = useCategory(props.category.id, props.category.board.id)
</script>

<template>
  <ChatEntityWrapper
    :data="data"
    :is-pending="isPending"
    :entity-id="category.id"
    :has-checkbox="hasCheckbox"
    v-model:selected-ids="selectedIds"
  >
    <template #default="{ entity, hasCheckbox, selectedIds, toggleSelect }">
      <CategoryCard
        :category="entity"
        :options="{
          hasBorder: true,
          hasCheckbox: hasCheckbox,
          showInfo: true,
        }"
        :selected-ids="selectedIds"
        @toggleSelect="toggleSelect"
        classes="self-start"
      />
    </template>

    <template #skeleton>
      <EntityCardSkeleton />
    </template>
  </ChatEntityWrapper>
</template>
