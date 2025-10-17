<script setup lang="ts">
defineProps<{
  isLoading?: boolean
  date?: string
  hideAvatar?: boolean
  hideBackground?: boolean
  fastQuestions?: string[]
}>()
</script>

<template>
  <div class="w-full flex flex-col justify-start gap-y-1 group/bubble">
    <div class="flex items-end gap-x-2" :class="{ 'items-stretch! w-full': hideBackground }">
      <div
        class="size-8 shrink-0 rounded-full hidden sm:inline-flex"
        :class="{ 'bg-[url(/src/assets/logo_circle.svg)] bg-center bg-cover': !hideAvatar }"
      ></div>
      <div
        class="rounded-lg bg-gray-100 p-3 max-w-[90%] sm:max-w-lg"
        :class="{
          'rounded-bl-none': !hideAvatar,
          'bg-transparent inline-flex items-center p-0! ps-2! grow-1': hideBackground,
        }"
      >
        <slot></slot>
      </div>
    </div>

    <div
      class="flex flex-wrap items-center sm:ps-10 justify-start gap-1"
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
      class="flex items-center sm:ps-10 justify-start opacity-0 group-hover/bubble:opacity-100 transition-opacity duration-100 gap-x-1"
      v-if="!hideAvatar && !hideBackground"
    >
      <span class="text-xs text-gray-500">{{ date }}</span>
    </div>
  </div>
</template>
