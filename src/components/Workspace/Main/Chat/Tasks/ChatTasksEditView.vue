<script setup lang="ts">
import { computed, ref } from 'vue'
import ColumnsView from '@/components/Workspace/Main/ColumnsView.vue'
import { ITask } from '@/interfaces/domain/ITask'
import { IChatMessage } from '@/interfaces/domain/IChatMessage'
import { ISingleUpdate } from '@/interfaces/domain/ISingleUpdate'
import { IParent } from '@/interfaces/IParent'
import ChatTaskEdit from '../EntityEdit/ChatTaskEdit.vue'

export type BeforeAfterTask = ISingleUpdate<ITask> & {
  category: IParent
  board: IParent
  workspace: IParent
  name: string
}

const props = defineProps<{
  message: IChatMessage
  before: BeforeAfterTask[]
  after: BeforeAfterTask[]
  isSelectable: boolean
  minSelect?: number
  maxSelect?: number
}>()

const selectedIds = defineModel('selectedIds', {
  type: Array as () => string[],
  default: () => [],
})

const messagesContainerRefMap = ref<Record<string, HTMLElement | null>>({})

const selectedTasksCount = computed(() => {
  return selectedIds.value.length
})

const hasCheckbox = computed(() => (task: ITask) => {
  if (!props.isSelectable) return false
  if ((props.minSelect ?? 0) > 0 || (props.maxSelect ?? 0) > 0) {
    if ((props.minSelect ?? 0) > 0 && selectedTasksCount.value < (props.minSelect ?? 0)) {
      return true
    }
    if ((props.maxSelect ?? 0) > 0 && selectedTasksCount.value >= (props.maxSelect ?? 0)) {
      return selectedIds.value.includes(task.id)
    }
    return true
  }
})

const beforeAfterArray = computed(() => {
  const beforeMap = new Map(props.before.map((item) => [item.id, item]))
  const afterMap = new Map(props.after.map((item) => [item.id, item]))

  const allIds = new Set([...beforeMap.keys(), ...afterMap.keys()])
  const result: BeforeAfterTask[][] = []

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
        <ChatTaskEdit
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
