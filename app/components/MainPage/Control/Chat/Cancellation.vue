<script setup lang="ts">
import dayjs from 'dayjs'
import type { ITaskState } from '~/stores/interfaces/ITaskState'
import UserBubble from '~/components/Workspace/Main/Chat/Bubbles/UserBubble.vue'
import AIBubble from '~/components/Workspace/Main/Chat/Bubbles/AIBubble.vue'
import MarkdownContent from '~/components/Workspace/Main/Chat/Bubbles/MarkdownContent.vue'
import AIInput from '~/components/Workspace/Main/Chat/AIInput.vue'

defineProps<{
  tasks: (ITaskState & { isSelected: boolean })[]
}>()

const getFormattedDate = (date: Date) => {
  return dayjs(date).calendar() + ' в ' + dayjs(date).format('HH:mm')
}
</script>

<template>
  <div
    class="max-w-130 w-full flex flex-1 flex-col overflow-y-auto overflow-x-hidden justify-between"
  >
    <div
      class="flex flex-col-reverse items-center overflow-y-auto overflow-x-hidden min-h-0 max-h-full py-6 px-4 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300"
      style="scrollbar-gutter: stable both-edges"
    >
      <div class="w-full flex flex-col items-start gap-2">
        <UserBubble
          text="Привет, перемести все задачи из колонки Бэклог в колонку В работе"
          :date="getFormattedDate(new Date())"
        />
        <AIBubble
          :hideAvatar="true"
          :isContentFullWidth="true"
          :date="getFormattedDate(new Date())"
        >
          <MarkdownContent text="Операция была отменена. Ни одна из задач не была изменена." />
        </AIBubble>
      </div>
    </div>
    <footer class="w-full flex justify-center p-4">
      <div class="w-full max-w-4xl">
        <AIInput />
      </div>
    </footer>
  </div>
</template>
