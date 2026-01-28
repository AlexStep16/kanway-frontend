<script setup lang="ts">
import { computed, ref } from 'vue'
import ChatTask from '@components/Workspace/Main/Chat/ChatTasks/ChatTask.vue'
import ColumnsView from '@/components/Workspace/Main/ColumnsView.vue'
import { ITaskState } from '@/stores/interfaces/ITaskState'
import ChatTaskStatic from './ChatTaskStatic.vue'

const props = defineProps<{
  message: {
    id: string
  }
  tasks?: (ITaskState & { isSelected?: boolean; tempId?: string })[]
}>()

const messagesContainerRefMap = ref<Record<string, HTMLElement | null>>({})

function handleToggleSelect(task: ITaskState) {
  const realTaskProp = props.tasks?.find((t) => t.id === task.id)
  const tempTaskProp = props.tasks?.find((t) => t.tempId === task.tempId)

  const taskProp = realTaskProp || tempTaskProp

  if (!taskProp) return

  taskProp.isSelected = !taskProp.isSelected
}

const staticTasks = computed(() => props.tasks?.filter((task) => !task.id) || [])
const realTasks = computed(() => props.tasks?.filter((task) => task.id) || [])
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
    <ColumnsView
      :items="realTasks"
      :containerRef="messagesContainerRefMap[message.id]"
      v-if="realTasks && realTasks.length > 0"
    >
      <template v-slot:default="slotProps">
        <ChatTask
          v-for="task in slotProps.data"
          :key="task.id"
          :task="task"
          @toggleSelect="handleToggleSelect"
        />
      </template>
    </ColumnsView>

    <ColumnsView
      :items="staticTasks"
      :containerRef="messagesContainerRefMap[message.id]"
      v-if="staticTasks && staticTasks.length > 0"
    >
      <template v-slot:default="slotProps">
        <ChatTaskStatic
          v-for="task in slotProps.data"
          :key="task.id"
          :task="task"
          @toggleSelect="handleToggleSelect"
        />
      </template>
    </ColumnsView>
  </div>
</template>
