<script setup lang="ts">
import { RotateCcw } from 'lucide-vue-next'

defineEmits<{
  (e: 'tryAgain'): void
}>()

defineProps<{
  isError?: boolean
  date?: string
  isContentFullWidth?: boolean
  fastQuestions?: string[]
}>()
</script>

<template>
  <div class="w-full flex flex-col justify-start gap-y-1 group/bubble">
    <div class="flex items-end w-full">
      <div
        class="w-full"
        :class="{
          'sm:w-full max-w-[90%]': isContentFullWidth,
          'max-w-[90%] sm:max-w-lg': !isContentFullWidth,
        }"
      >
        <slot></slot>
      </div>
    </div>

    <div class="flex flex-wrap items-center justify-start gap-1" v-if="isError">
      <button
        type="button"
        class="text-xs flex items-center gap-x-1 rounded-md text-gray-500 py-1.5 px-2.5 bg-gray-100 hover:bg-gray-200 transition-colors duration-100"
        @click="$emit('tryAgain')"
      >
        <RotateCcw class="size-3" />
        <span>Попробовать еще раз</span>
      </button>
    </div>

    <div
      class="flex flex-wrap items-center justify-start gap-1"
      v-if="fastQuestions && fastQuestions.length"
    >
      <button
        type="button"
        class="text-xs rounded-md text-gray-500 py-1.5 px-2.5 bg-gray-100 hover:bg-gray-200 transition-colors duration-100"
        v-for="question in fastQuestions"
        :key="question"
      >
        {{ question }}
      </button>
    </div>

    <div
      class="flex items-center justify-start opacity-0 group-hover/bubble:opacity-100 transition-opacity duration-100 gap-x-1"
      v-if="date"
    >
      <span class="text-xs text-gray-500">{{ date }}</span>
    </div>
  </div>
</template>
