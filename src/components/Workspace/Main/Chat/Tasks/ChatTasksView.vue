<script setup lang="ts">
import { computed, ref } from 'vue'
import ChatTask from '@components/Workspace/Main/Chat/Tasks/ChatTask.vue'
import ChatTaskTemp from '@components/Workspace/Main/Chat/Tasks/ChatTaskTemp.vue'
import ColumnsView from '@/components/Workspace/Main/ColumnsView.vue'
import { ITask } from '@/interfaces/domain/ITask'
import { IChatMessage } from '@/interfaces/domain/IChatMessage'

const props = defineProps<{
  message: IChatMessage
  items: ITask[]
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
  return true
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
    <ColumnsView :items="items" :containerRef="messagesContainerRefMap[message.id]">
      <template v-slot:default="slotProps">
        <template v-if="!isTemporary">
          <ChatTask
            v-for="task in slotProps.data"
            :key="task.id"
            :task="task"
            :hasCheckbox="hasCheckbox(task)"
            v-model:selectedIds="selectedIds"
          />
        </template>
        <template v-else>
          <ChatTaskTemp
            v-for="task in slotProps.data"
            :key="task.id"
            :task="task"
            :hasCheckbox="hasCheckbox(task)"
            v-model:selectedIds="selectedIds"
          />
        </template>
      </template>
    </ColumnsView>
  </div>
</template>
