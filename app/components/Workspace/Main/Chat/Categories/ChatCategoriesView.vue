<script setup lang="ts">
import { computed, ref } from 'vue'
import ChatColumn from '~/components/Workspace/Main/Chat/Columns/ChatColumn.vue'
import ChatColumnTemp from '~/components/Workspace/Main/Chat/Columns/ChatColumnTemp.vue'
import ColumnsView from '~/components/Workspace/Main/ColumnsView.vue'
import type { IColumn } from '~/interfaces/domain/IColumn'

const props = defineProps<{
  items: IColumn[]
  isSelectable?: boolean
  isTemporary?: boolean
  minSelect?: number
  maxSelect?: number
}>()

const selectedIds = defineModel('selectedIds', {
  type: Array as () => string[],
  default: () => [],
})

const messagesContainerRef = ref<HTMLElement | null>(null)

const selectedColumnsCount = computed(() => {
  return selectedIds.value.length
})

function hasCheckbox(column: IColumn) {
  if (!props.isSelectable) return false
  if ((props.minSelect ?? 0) > 0 || (props.maxSelect ?? 0) > 0) {
    if ((props.minSelect ?? 0) > 0 && selectedColumnsCount.value < (props.minSelect ?? 0)) {
      return true
    }
    if ((props.maxSelect ?? 0) > 0 && selectedColumnsCount.value >= (props.maxSelect ?? 0)) {
      return selectedIds.value.includes(column.id)
    }
    return true
  }
  return true
}
</script>

<template>
  <div
    class="flex gap-2 w-full"
    ref="messagesContainerRef"
  >
    <ColumnsView
      :initialCountShown="10"
      :items="items"
      :containerRef="messagesContainerRef"
    >
      <template v-slot:default="slotProps">
        <template v-if="!isTemporary">
          <ChatColumn
            v-for="column in slotProps.data"
            :key="column.id"
            :column="column"
            :hasCheckbox="hasCheckbox(column)"
            v-model:selectedIds="selectedIds"
          />
        </template>
        <template v-else>
          <ChatColumnTemp
            v-for="column in slotProps.data"
            :key="column.id"
            :column="column"
            :hasCheckbox="hasCheckbox(column)"
            v-model:selectedIds="selectedIds"
          />
        </template>
      </template>
    </ColumnsView>
  </div>
</template>
