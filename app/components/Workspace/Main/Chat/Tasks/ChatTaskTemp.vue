<script setup lang="ts">
import ChatEntityTempWrapper from '../ChatEntityTempWrapper.vue'
import Task from '~/components/Workspace/Main/Task/Task.vue'
import type { ITask } from '~/interfaces/domain/ITask'

const props = defineProps<{
  task: ITask
  hasCheckbox?: boolean
}>()

const selectedIds = defineModel('selectedIds', {
  type: Array as () => string[],
  default: () => [],
})
</script>

<template>
  <ChatEntityTempWrapper :entity="task" v-model:selected-ids="selectedIds">
    <template #default="{ entity }">
      <Task
        :task="entity"
        :options="{
          hasBorder: true,
          isCompletable: true,
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
