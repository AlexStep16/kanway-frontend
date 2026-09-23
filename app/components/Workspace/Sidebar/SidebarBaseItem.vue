<script setup lang="ts">
defineProps<{
  name: string
  selected: boolean
}>()

defineEmits<{
  (e: 'select'): void
}>()
</script>

<template>
  <li
    class="flex items-center justify-between relative group/sidebar-item"
    :class="selected ? 'text-blue-500 ' : 'text-gray-600'"
  >
    <a
      class="flex items-center w-full cursor-pointer grow py-2 pl-2.5 pr-8.5 rounded-lg text-sm focus:outline-none transition-colors duration-100"
      :class="selected ? 'bg-blue-100' : 'hover:bg-gray-200'"
      @click="$emit('select')"
    >
      <slot name="link"></slot>
      <span class="truncate">{{ name }}</span>
    </a>
    <slot name="options" />
  </li>
</template>
