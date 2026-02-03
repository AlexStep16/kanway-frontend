<script setup lang="ts">
import TaskSkeleton from '@/components/Workspace/Main/Task/TaskSkeleton.vue'
import { useCategory } from '@/composables/categories/queries/useCategory'
import EntityCard from '@/components/Workspace/Main/EntityCard.vue'
import { ICategoryState } from '@/stores/interfaces/ICategoryState'

const props = defineProps<{
  category: ICategoryState & { isSelected?: boolean }
}>()

const { data: realCategory, isPending: isLoading } = useCategory(
  props.category.id,
  props.category.board.id,
)
</script>

<template>
  <EntityCard
    :id="realCategory.id || (realCategory as any).tempId"
    :name="realCategory.name"
    :hasSelected="true"
    :isSelected="props.category.isSelected"
    :parentName="realCategory.board.name"
    :showInfo="true"
    v-if="realCategory && !isLoading"
  />

  <TaskSkeleton v-else />
</template>
