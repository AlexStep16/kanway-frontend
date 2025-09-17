<script setup lang="ts">
import { defineProps } from 'vue'
import Options from '@components/Options.vue'

defineProps<{
  item: {
    id: number
    name: string
  }
}>()
</script>

<template>
  <li
    class="flex items-center justify-between relative group/sidebar-item"
    :class="item.id === 1 ? 'text-blue-500 ' : 'text-gray-600'"
  >
    <a
      class="flex items-center w-full flex-grow py-2 pl-2.5 pr-8.5 rounded-lg text-sm focus:outline-none"
      :class="item.id === 1 ? 'bg-blue-100' : 'hover:bg-gray-200'"
      href="#"
    >
      <slot name="link"></slot>
      <span class="truncate">{{ item.name }}</span>
    </a>
    <Options
      :options="{
        edit: false,
        copy: true,
        move: true,
        favorite: true,
        archive: true,
      }"
      :item
      class="absolute right-2.5"
      group_name="sidebar-item"
    />
  </li>
</template>
