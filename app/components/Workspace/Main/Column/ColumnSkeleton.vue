<script setup lang="ts">
import ButtonCreateSkeleton from '~/components/Buttons/ButtonCreateSkeleton.vue'
import EntityCardSkeleton from '~/components/Workspace/Main/EntityCardSkeleton.vue'

function getRandomTasksNumber() {
  const randomNumber = Math.floor(Math.random() * 4) + 1

  return randomNumber
}
</script>

<template>
  <div
    class="bg-gray-200 animate-pulse flex py-3 px-4 flex-col shrink-0 gap-y-3 rounded-md h-full w-70 sm:w-75"
  >
    <!-- Header -->
    <div class="flex w-full justify-between gap-x-2 items-center">
      <div class="h-8 w-full bg-gray-300 rounded-lg animate-pulse"></div>
      <div class="size-8 bg-gray-300 rounded-lg animate-pulse"></div>
    </div>

    <!-- Tasks -->
    <div class="flex grow flex-col min-h-0 gap-y-2 mb-3">
      <ButtonCreateSkeleton />

      <EntityCardSkeleton
        v-for="number in getRandomTasksNumber()"
        :key="number + '_skeleton_task'"
      />
    </div>
  </div>
</template>
