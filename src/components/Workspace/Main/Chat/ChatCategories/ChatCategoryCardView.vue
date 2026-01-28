<script setup lang="ts">
import { computed, ref } from 'vue'
import ColumnsView from '@/components/Workspace/Main/ColumnsView.vue'
import ChatCategory from '@/components/Workspace/Main/Chat/ChatCategories/ChatCategory.vue'
import { ICategoryState } from '@/stores/interfaces/ICategoryState'
import ChatCategoryStatic from './ChatCategoryStatic.vue'

const props = defineProps<{
  message: {
    id: string
  }
  entities?: (ICategoryState & { isSelected?: boolean; tempId?: string })[]
}>()

const messagesContainerRefMap = ref<Record<string, HTMLElement | null>>({})

function handleToggleSelect(categoryId: string) {
  const realCategoryProp = props.entities?.find((t) => t.id === categoryId)
  const tempCategoryProp = props.entities?.find((t) => t.tempId === categoryId)

  const categoryProp = realCategoryProp || tempCategoryProp

  if (categoryProp) {
    categoryProp.isSelected = !categoryProp.isSelected
  }
}

const staticCategories = computed(() => props.entities?.filter((category) => !category.id) || [])
const realCategories = computed(() => props.entities?.filter((category) => category.id) || [])
</script>

<template>
  <div
    class="flex gap-2 mt-3 w-full"
    :ref="
      (el) => {
        messagesContainerRefMap[message.id] = el as HTMLElement
      }
    "
    v-if="entities && entities.length > 0"
  >
    <ColumnsView
      :items="realCategories"
      :containerRef="messagesContainerRefMap[message.id]"
      v-if="realCategories && realCategories.length > 0"
    >
      <template v-slot:default="slotProps">
        <ChatCategory
          v-for="item in slotProps.data"
          :key="item.id"
          :category="item"
          @toggle-select="handleToggleSelect"
        />
      </template>
    </ColumnsView>

    <ColumnsView
      :items="staticCategories"
      :containerRef="messagesContainerRefMap[message.id]"
      v-else
    >
      <template v-slot:default="slotProps">
        <ChatCategoryStatic
          v-for="item in slotProps.data"
          :key="item.id"
          :category="item"
          @toggle-select="handleToggleSelect"
        />
      </template>
    </ColumnsView>
  </div>
</template>
