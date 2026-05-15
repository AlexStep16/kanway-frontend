<script setup lang="ts">
import ChatEntityTempWrapper from '../ChatEntityTempWrapper.vue'
import CategoryCard from '~/components/Workspace/Main/Category/CategoryCard.vue'
import type { ICategory } from '~/interfaces/domain/ICategory'

const props = defineProps<{
  category: ICategory
  hasCheckbox?: boolean
}>()

const selectedIds = defineModel('selectedIds', {
  type: Array as () => string[],
  default: () => [],
})
</script>

<template>
  <ChatEntityTempWrapper :entity="category" v-model:selected-ids="selectedIds">
    <template #default="{ entity }">
      <CategoryCard
        :category="entity"
        :options="{
          hasBorder: true,
          hasCheckbox: hasCheckbox,
          isStatic: true,
          showInfo: true,
        }"
        :selected-ids="selectedIds"
        classes="self-start"
      />
    </template>
  </ChatEntityTempWrapper>
</template>
