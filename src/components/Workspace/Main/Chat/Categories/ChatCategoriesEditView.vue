<script setup lang="ts">
import { computed, ref } from 'vue'
import ColumnsView from '@/components/Workspace/Main/ColumnsView.vue'
import { IChatMessage } from '@/interfaces/domain/IChatMessage'
import { ISingleUpdate } from '@/interfaces/domain/ISingleUpdate'
import { IParent } from '@/interfaces/IParent'
import ChatCategoryEdit from '../EntityEdit/ChatCategoryEdit.vue'
import { ICategory } from '@/interfaces/domain/ICategory'

export type BeforeAfterCategory = ISingleUpdate<ICategory> & {
  board: IParent
  workspace: IParent
  name: string
}

const props = defineProps<{
  message: IChatMessage
  before: BeforeAfterCategory[]
  after: BeforeAfterCategory[]
  isSelectable: boolean
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

const hasCheckbox = computed(() => (category: ICategory) => {
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
})

const beforeAfterArray = computed(() => {
  const beforeMap = new Map(props.before.map((item) => [item.id, item]))
  const afterMap = new Map(props.after.map((item) => [item.id, item]))

  const allIds = new Set([...beforeMap.keys(), ...afterMap.keys()])
  const result: BeforeAfterCategory[][] = []

  allIds.forEach((id) => {
    if (beforeMap.has(id) && afterMap.has(id)) {
      result.push([beforeMap.get(id)!, afterMap.get(id)!])
    } else if (beforeMap.has(id)) {
      result.push([beforeMap.get(id)!, null as any])
    } else if (afterMap.has(id)) {
      result.push([null as any, afterMap.get(id)!])
    }
  })

  return result
})
</script>

<template>
  <div
    class="flex gap-2 mt-3 w-full"
    :ref="
      (el) => {
        messagesContainerRefMap[message.id] = el as HTMLElement
      }
    "
  >
    <ColumnsView :items="beforeAfterArray" :containerRef="messagesContainerRefMap[message.id]">
      <template v-slot:default="slotProps">
        <ChatCategoryEdit
          v-for="[before, after] in slotProps.data"
          :key="before?.id ?? after?.id"
          :before="before"
          :after="after"
          :isSelectable="isSelectable"
          :hasCheckbox="hasCheckbox(before ?? after)"
          v-model:selectedIds="selectedIds"
        />
      </template>
    </ColumnsView>
  </div>
</template>
