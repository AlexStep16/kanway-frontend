<script setup lang="ts">
defineProps<{
  currentToolStatus: string
}>()
</script>

<template>
  <div class="relative overflow-hidden w-full">
    <TransitionGroup tag="div" name="slide-up">
      <div
        class="flex items-center justify-start gap-x-2"
        v-for="status in [currentToolStatus]"
        :key="status"
      >
        <div
          class="animate-spin inline-block size-4 shrink-0 border-2 border-current border-t-transparent text-gray-500 rounded-full"
          role="status"
          aria-label="Загрузка"
        >
          <span class="sr-only">Загрузка...</span>
        </div>
        <span class="text-sm text-gray-700">{{ currentToolStatus }}...</span>
      </div>
    </TransitionGroup>
  </div>
</template>
