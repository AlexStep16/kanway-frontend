<script setup lang="ts">
import { ITask } from '@/interfaces/domain/ITask'
import Task from '@/components/Workspace/Main/Task/Task.vue'

defineProps<{
  task: ITask
}>()
</script>

<template>
  <Task
    :task
    :hasBorder="true"
    :hasCheckbox="true"
    :showInfo="true"
    taskClasses="self-start"
    :isStatic="true"
  />
</template>
