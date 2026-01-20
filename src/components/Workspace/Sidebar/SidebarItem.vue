<script setup lang="ts">
import { MaybeRef, ref } from 'vue'
import Options, { ItemStatus } from '@/components/Options/Options.vue'
import WorkspaceModel from '@/models/WorkspaceModel'
import BoardModel from '@/models/BoardModel'
import { Nullable } from '@/types/utils'
import ChatModel from '@/models/ChatModel'

const optionsRef = ref<Nullable<InstanceType<typeof Options>>>(null)

defineProps<{
  item: WorkspaceModel | BoardModel | ChatModel
  type: 'board' | 'workspace' | 'chat'
  resetForm?: () => void
  status: (id: MaybeRef<string | null>) => ItemStatus
  selected?: boolean
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
      class="flex items-center w-full cursor-pointer flex-grow py-2 pl-2.5 pr-8.5 rounded-lg text-sm focus:outline-none transition-colors duration-100"
      :class="selected ? 'bg-blue-100' : 'hover:bg-gray-200'"
      @click="$emit('select')"
    >
      <slot name="link"></slot>
      <span class="truncate">{{ item.name }}</span>
    </a>
    <Options
      :options="{
        edit: type === 'chat' ? false : true,
        copy: true,
        move: ['chat', 'workspace'].includes(type) ? false : true,
        favorite: true,
        archive: true,
      }"
      :status
      :item
      class="absolute right-2.5"
      :resetForm="resetForm"
      groupName="sidebar-item"
      :hoverClass="selected ? 'lg:hover:bg-blue-200' : 'lg:hover:bg-gray-200'"
      :editType="type"
      ref="optionsRef"
    >
      <template v-for="(value, key) in $slots" #[key]="slotProps">
        <slot :name="key" v-bind="slotProps" />
      </template>
    </Options>
  </li>
</template>
