<script setup lang="ts">
import { defineProps } from 'vue'
import Options from '@/components/Options/Options.vue'
import { Workspace } from '@interfaces/Workspace'
import { Board } from '@interfaces/Board'

defineProps<{
  item: Workspace | Board
  type: 'board' | 'workspace' | 'chat'
  selected?: boolean
}>()
</script>

<template>
  <li
    class="flex items-center justify-between relative group/sidebar-item"
    :class="selected ? 'text-blue-500 ' : 'text-gray-600'"
  >
    <a
      class="flex items-center w-full flex-grow py-2 pl-2.5 pr-8.5 rounded-lg text-sm focus:outline-none transition-colors duration-100"
      :class="selected ? 'bg-blue-100' : 'hover:bg-gray-200'"
      href="#"
    >
      <slot name="link"></slot>
      <span class="truncate">{{ item.name }}</span>
    </a>
    <Options
      :options="{
        edit: type === 'chat' ? false : true,
        copy: true,
        move: type === 'chat' ? false : true,
        favorite: true,
        archive: true,
      }"
      :item
      class="absolute right-2.5"
      group_name="sidebar-item"
      :hover_class="selected ? 'lg:hover:bg-blue-200' : 'lg:hover:bg-gray-200'"
      :edit_type="type"
    />
  </li>
</template>
