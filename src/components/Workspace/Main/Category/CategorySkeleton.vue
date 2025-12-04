<script setup lang="ts">
import ButtonCreateSkeleton from '@components/Buttons/ButtonCreateSkeleton.vue'
import TaskSkeleton from '@components/Workspace/Main/Task/TaskSkeleton.vue'

function getRandomTasksNumber() {
  const randomNumber = Math.floor(Math.random() * 4) + 1

  return randomNumber
}

const randomTasksNumber = getRandomTasksNumber()
</script>

<template>
  <div
    class="bg-gray-300 animate-pulse flex py-3 px-4 flex-col shrink-0 gap-y-3 rounded-md h-full w-70 sm:w-75"
  >
    <!-- Header -->
    <div class="flex w-full justify-between gap-x-2 items-center">
      <div class="h-8 w-full bg-gray-400 rounded-lg animate-pulse"></div>
      <div class="size-8 bg-gray-400 rounded-lg animate-pulse"></div>
    </div>

    <!-- Tasks -->
    <div class="flex grow-1 flex-col min-h-0 gap-y-2 mb-3">
      <ButtonCreateSkeleton />

      <TaskSkeleton v-for="number in randomTasksNumber" :key="number + '_skeleton_task'" />
    </div>
  </div>
</template>
