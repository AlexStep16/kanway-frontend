<script setup lang="ts">
import { onMounted } from 'vue'
import { ITaskState } from '@/stores/interfaces/ITaskState'
import UserBubble from '@/components/Workspace/Main/Chat/Bubbles/UserBubble.vue'
import AIBubble from '@/components/Workspace/Main/Chat/Bubbles/AIBubble.vue'
import dayjs from 'dayjs'
import CategoryChange from '@/components/Workspace/Main/Chat/EntityEdit/Changes/CategoryChange.vue'
import Assistant from '@/components/Workspace/Main/Chat/Bubbles/Assistant.vue'
import AIInput from '@/components/Workspace/Main/Chat/AIInput.vue'

defineProps<{
  tasks: (ITaskState & { isSelected: boolean })[]
}>()

const getFormattedDate = (date: Date) => {
  return dayjs(date).calendar() + ' в ' + dayjs(date).format('HH:mm')
}

const baseBlockBeforeClasses = 'text-red-500 bg-red-200 py-1 px-2 self-start rounded-sm'
const baseBlockAfterClasses = 'text-green-600 bg-green-200 py-1 px-2 self-start rounded-sm'

onMounted(() => {
  if (window.HSStaticMethods) {
    window.HSStaticMethods.autoInit()
  }
})
</script>

<template>
  <div class="min-w-130 flex flex-1 flex-col justify-between overflow-y-auto overflow-x-hidden">
    <div
      class="flex flex-col-reverse items-center overflow-y-auto overflow-x-hidden min-h-0 max-h-full py-6 px-4 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300"
      style="scrollbar-gutter: stable both-edges"
    >
      <div class="w-full flex flex-col items-start gap-2">
        <UserBubble
          text="Привет, перемести все задачи из категории Бэклог в категорию В работе"
          :date="getFormattedDate(new Date())"
        />
        <AIBubble :hideAvatar="true" :isContentFullWidth="true">
          <Assistant class="mb-2" text="Будут изменены следующие задачи:" />

          <div class="flex flex-col gap-2">
            <div
              class="flex flex-col shrink-0 shadow-sm rounded-md min-w-60 cursor-pointer border border-gray-200 hover:shadow-md hover:shadow-gray-300 max-w-75 w-full shadow-gray-200 bg-white transition-shadow duration-100 overflow-hidden select-none"
            >
              <div class="flex flex-col gap-y-2 p-3 group/task relative">
                <!-- Info -->
                <div class="flex items-center flex-wrap gap-1">
                  <CategoryChange
                    :beforeСategory="{
                      id: 'cat-1',
                      name: 'Бэклог',
                    }"
                    :afterСategory="{
                      id: 'cat-2',
                      name: 'В работе',
                    }"
                    :baseBlockBeforeClasses="baseBlockBeforeClasses"
                    :baseBlockAfterClasses="baseBlockAfterClasses"
                  />
                </div>
                <div class="flex flex-col gap-y-1">
                  <div
                    class="flex items-center gap-x-1 shrink overflow-hidden min-w-0 text-gray-800"
                  >
                    <span class="text-sm overflow-hidden wrap-break-word"
                      >Определение объёма MVP</span
                    >
                  </div>
                </div>
              </div>
            </div>

            <div
              class="flex flex-col shrink-0 shadow-sm rounded-md min-w-60 cursor-pointer border border-gray-200 hover:shadow-md hover:shadow-gray-300 max-w-75 w-full shadow-gray-200 bg-white transition-shadow duration-100 overflow-hidden select-none"
            >
              <div class="flex flex-col gap-y-2 p-3 group/task relative">
                <!-- Info -->
                <div class="flex items-center flex-wrap gap-1">
                  <CategoryChange
                    :beforeСategory="{
                      id: 'cat-1',
                      name: 'Бэклог',
                    }"
                    :afterСategory="{
                      id: 'cat-2',
                      name: 'В работе',
                    }"
                    :baseBlockBeforeClasses="baseBlockBeforeClasses"
                    :baseBlockAfterClasses="baseBlockAfterClasses"
                  />
                </div>
                <div class="flex flex-col gap-y-1">
                  <div
                    class="flex items-center gap-x-1 shrink overflow-hidden min-w-0 text-gray-800"
                  >
                    <span class="text-sm overflow-hidden wrap-break-word">Создание прототипа</span>
                  </div>
                </div>
              </div>
            </div>

            <div
              class="flex flex-col shrink-0 shadow-sm rounded-md min-w-60 cursor-pointer border border-gray-200 hover:shadow-md hover:shadow-gray-300 max-w-75 w-full shadow-gray-200 bg-white transition-shadow duration-100 overflow-hidden select-none"
            >
              <div class="flex flex-col gap-y-2 p-3 group/task relative">
                <!-- Info -->
                <div class="flex items-center flex-wrap gap-1">
                  <CategoryChange
                    :beforeСategory="{
                      id: 'cat-1',
                      name: 'Бэклог',
                    }"
                    :afterСategory="{
                      id: 'cat-2',
                      name: 'В работе',
                    }"
                    :baseBlockBeforeClasses="baseBlockBeforeClasses"
                    :baseBlockAfterClasses="baseBlockAfterClasses"
                  />
                </div>
                <div class="flex flex-col gap-y-1">
                  <div
                    class="flex items-center gap-x-1 shrink overflow-hidden min-w-0 text-gray-800"
                  >
                    <span class="text-sm overflow-hidden wrap-break-word"
                      >Проработка технической архитектуры</span
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="max-w-lg mt-3 flex">
            <div class="flex gap-x-2 bg-muted p-3 rounded-xl">
              <button
                type="button"
                class="flex items-center justify-center text-xs rounded-md text-white py-1.5 px-2.5 bg-blue-500 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:pointer-events-none duration-100 relative"
              >
                <span> Подтвердить </span>
              </button>

              <button
                type="button"
                class="flex items-center justify-center text-xs rounded-md text-red-500 py-1.5 px-2.5 bg-red-100 hover:bg-red-200 transition-colors duration-100 disabled:opacity-50 disabled:pointer-events-none relative"
              >
                <span> Отменить </span>
              </button>
            </div>
          </div>
        </AIBubble>
        <!--
        <AIBubble
          :hideAvatar="true"
          :isContentFullWidth="true"
          :date="getFormattedDate(new Date())"
        >
          <Assistant
            text="Готово! Все задачи из колонки <b>Бэклог</b> перемещены в колонку <b>В работе</b>"
          />
        </AIBubble>
        -->
      </div>
    </div>
    <footer class="w-full flex justify-center p-4">
      <div class="w-full max-w-4xl">
        <AIInput />
      </div>
    </footer>
  </div>
</template>
