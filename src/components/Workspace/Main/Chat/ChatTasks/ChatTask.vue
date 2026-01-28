<script setup lang="ts">
import Task from '@/components/Workspace/Main/Task/Task.vue'
import { useTask } from '@/composables/tasks/queries/useTask'
import TaskSkeleton from '@/components/Workspace/Main/Task/TaskSkeleton.vue'
import DeletedEntity from '@/components/Workspace/Main/DeletedEntity.vue'
import { computed } from 'vue'
import { ITaskState } from '@/stores/interfaces/ITaskState'

const props = defineProps<{
  task: ITaskState & { isSelected?: boolean }
}>()

const { data: realTask, isPending: isLoading } = useTask(props.task.id, props.task.board.id)

const hasCheckbox = computed(() => {
  return props.task.isSelected !== undefined
})
</script>

<template>
  <Task
    :task="realTask"
    :isSelected="task.isSelected"
    :hasBorder="true"
    :hasCheckbox
    :showInfo="true"
    taskClasses="self-start"
    v-if="realTask && !isLoading"
  />

  <TaskSkeleton v-else-if="isLoading" />
  <DeletedEntity v-else />
</template>
