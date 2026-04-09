<script setup lang="ts">
import { computed, ref } from 'vue'
import ChatCategory from '@components/Workspace/Main/Chat/Categories/ChatCategory.vue'
import ChatCategoryTemp from '@components/Workspace/Main/Chat/Categories/ChatCategoryTemp.vue'
import ColumnsView from '@/components/Workspace/Main/ColumnsView.vue'
import { ICategory } from '@/interfaces/domain/ICategory'
import { IChatMessage } from '@/interfaces/domain/IChatMessage'

const props = defineProps<{
  message: IChatMessage
  items: ICategory[]
  isSelectable?: boolean
  isTemporary?: boolean
  minSelect?: number
  maxSelect?: number
}>()

const selectedIds = defineModel('selectedIds', {
  type: Array as () => string[],
  default: () => [],
})

const messagesContainerRefMap = ref<Record<string, HTMLElement | null>>({})

const selectedCategoriesCount = computed(() => {
  return selectedIds.value.length
})

function hasCheckbox(category: ICategory) {
  if (!props.isSelectable) return false
  if ((props.minSelect ?? 0) > 0 || (props.maxSelect ?? 0) > 0) {
    if ((props.minSelect ?? 0) > 0 && selectedCategoriesCount.value < (props.minSelect ?? 0)) {
      return true
    }
    if ((props.maxSelect ?? 0) > 0 && selectedCategoriesCount.value >= (props.maxSelect ?? 0)) {
      return selectedIds.value.includes(category.id)
    }
    return true
  }
  return true
}
</script>

<template>
  <div
    class="flex gap-2 w-full"
    :ref="
      (el) => {
        messagesContainerRefMap[message.id] = el as HTMLElement
      }
    "
  >
    <ColumnsView
      :initialCountShown="10"
      :items="items"
      :containerRef="messagesContainerRefMap[message.id]"
    >
      <template v-slot:default="slotProps">
        <template v-if="!isTemporary">
          <ChatCategory
            v-for="category in slotProps.data"
            :key="category.id"
            :category="category"
            :hasCheckbox="hasCheckbox(category)"
            v-model:selectedIds="selectedIds"
          />
        </template>
        <template v-else>
          <ChatCategoryTemp
            v-for="category in slotProps.data"
            :key="category.id"
            :category="category"
            :hasCheckbox="hasCheckbox(category)"
            v-model:selectedIds="selectedIds"
          />
        </template>
      </template>
    </ColumnsView>
  </div>
</template>
