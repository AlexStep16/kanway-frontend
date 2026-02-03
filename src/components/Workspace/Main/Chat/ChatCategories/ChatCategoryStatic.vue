<script setup lang="ts">
import EntityCard from '@/components/Workspace/Main/EntityCard.vue'
import { ICategoryState } from '@/stores/interfaces/ICategoryState'

defineProps<{
  category: ICategoryState & { isSelected?: boolean }
}>()
</script>

<template>
  <EntityCard
    :id="category.tempId || category.id"
    :name="category.name"
    :hasSelected="true"
    :isSelected="category.isSelected"
    :parentName="category.board.name"
    :isStatic="true"
    :showInfo="true"
  />
</template>
