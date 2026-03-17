<script setup lang="ts">
import ChatEntityWrapper from '../ChatEntityWrapper.vue'
import Task from '@/components/Workspace/Main/Task/Task.vue'
import EntityCardSkeleton from '../../EntityCardSkeleton.vue'
import { useTask } from '@/composables/tasks/queries/useTask'
import { ITask } from '@/interfaces/domain/ITask'

const props = defineProps<{
  task: ITask
  hasCheckbox?: boolean
}>()

const selectedIds = defineModel('selectedIds', {
  type: Array as () => string[],
  default: () => [],
})

const taskQuery = useTask(props.task.id, props.task.board.id)
</script>

<template>
  <ChatEntityWrapper
    :query-result="taskQuery"
    :entity-id="task.id"
    :has-checkbox="hasCheckbox"
    v-model:selected-ids="selectedIds"
  >
    <template #default="{ entity, hasCheckbox, selectedIds, toggleSelect }">
      <Task
        :task="entity"
        :options="{
          hasBorder: true,
          hasCheckbox: hasCheckbox,
          showInfo: true,
        }"
        :selected-ids="selectedIds"
        @toggleSelect="toggleSelect"
        classes="self-start"
      />
    </template>

    <template #skeleton>
      <EntityCardSkeleton />
    </template>
  </ChatEntityWrapper>
</template>
