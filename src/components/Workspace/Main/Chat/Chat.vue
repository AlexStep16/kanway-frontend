<script setup lang="ts">
import { useWorkspaceStore } from '@/stores/workspace'
import { X } from 'lucide-vue-next'
import UserBubble from '@/components/Workspace/Main/Chat/Bubbles/UserBubble.vue'
import AIBubble from '@/components/Workspace/Main/Chat/Bubbles/AIBubble.vue'
import Confirmation from '@/components/Workspace/Main/Chat/Bubbles/Confirmation.vue'
import AIInput from '@/components/Workspace/Main/Chat/AIInput.vue'
import Assistant from '@/components/Workspace/Main/Chat/Bubbles/Assistant.vue'
import Status from '@/components/Workspace/Main/Chat/Bubbles/Status.vue'
import { computed, ref } from 'vue'
import Task from '@/components/Workspace/Main/Task/Task.vue'
import EntityCard from '@/components/Workspace/Main/Archive/EntityCard.vue'

const WORKSPACE_STORE = useWorkspaceStore()

const tasks = ref([
  { id: 1, name: 'Задача 1', is_completed: false, tags: ['важно'] },
  { id: 2, name: 'Задача 2', color: '#FFEEAA', is_completed: false },
  {
    id: 3,
    name: 'Задача 3',
    color: '#EEAABB',
    description: 'Описание задачи',
    due_date: '2025-09-15T14:14:00',
    is_completed: false,
    tags: ['отчеты', 'встречи'],
  },
  {
    id: 4,
    name: 'Задача 4',
    due_date: '2025-09-16T14:14:00',
    is_completed: false,
  },
  {
    id: 5,
    name: 'Задача 3',
    color: '#EEAABB',
    due_date: '2025-09-15T14:14:00',
    is_completed: false,
    tags: ['отчеты', 'встречи'],
  },
  { id: 6, name: 'Задача 1', is_completed: false, tags: ['важно'] },
  { id: 7, name: 'Задача 2', color: '#FFEEAA', is_completed: false },
  {
    id: 8,
    name: 'Задача 4',
    due_date: '2025-09-16T14:14:00',
    is_completed: false,
  },
])

const categories = ref([
  { id: 1, name: 'Категория 1' },
  { id: 2, name: 'Категория 2' },
  { id: 3, name: 'Категория 3' },
  { id: 4, name: 'Категория 4' },
])

const toolStatuses = ['Удаляю категории', 'Создаю задачи', 'Назначаю даты', 'Создаю категории']
const currentToolStatusesIndex = ref(0)
const currentToolStatus = computed(() => toolStatuses[currentToolStatusesIndex.value])

setInterval(() => {
  currentToolStatusesIndex.value = (currentToolStatusesIndex.value + 1) % toolStatuses.length
}, 3000)

const taskColumns = computed(() => {
  const numCols = 2
  const result: any = Array.from({ length: numCols }, () => [])
  tasks.value.forEach((task, index) => {
    result[index % numCols].push(task)
  })
  return result
})

const categoryColumns = computed(() => {
  const numCols = 2
  const result: any = Array.from({ length: numCols }, () => [])
  categories.value.forEach((category, index) => {
    result[index % numCols].push(category)
  })
  return result
})
</script>

<template>
  <div
    id="hs-chat"
    :ref="
      (el) => {
        if (el) WORKSPACE_STORE.chatModalRef = el as HTMLElement
      }
    "
    class="hs-overlay hs-overlay-open:opacity-100 hs-overlay-open:duration-500 hidden size-full fixed top-0 start-0 z-80 opacity-0 overflow-x-hidden transition-all overflow-y-auto pointer-events-none"
    role="dialog"
    tabindex="-1"
    aria-labelledby="hs-chat-label"
  >
    <div class="size-full flex items-center justify-center p-4">
      <div
        class="flex flex-col size-full max-w-4xl max-h-160 bg-white rounded-md pointer-events-auto px-4 py-3 overflow-auto"
      >
        <!-- Header -->
        <div class="flex justify-between items-center gap-x-2 pb-2 border-b border-gray-200">
          <h5 id="hs-task-edit-label" class="text-base font-semibold text-gray-900">Чат с ИИ</h5>
          <button
            class="transition-colors duration-100 text-gray-500 hover:bg-gray-200 p-1 rounded-full"
            type="button"
            @click="WORKSPACE_STORE.closeChatModal()"
          >
            <X class="size-5" />
          </button>
        </div>

        <!-- Body -->
        <div class="flex flex-col grow-1 gap-2 min-h-0 overflow-y-auto py-2 px-1">
          <UserBubble />

          <AIBubble :hideBackground="true">
            <Status :currentToolStatus="currentToolStatus" />
          </AIBubble>

          <AIBubble
            date="18 ноября в 15:00"
            :fastQuestions="['Создать задачу', 'Запланировать встречу', 'Показать отчёт']"
          >
            <Assistant
              text="Привет! Конечно! Я создал задачу 'Сходить в магазин' и назначил ей дату на 17 июля 2026
          года. Если тебе нужно что-то еще, просто скажи!"
            />
          </AIBubble>

          <AIBubble :hideAvatar="true">
            <Confirmation text="Следующим задачам будут присвоены значения:" />

            <div class="flex gap-2 mt-3">
              <div
                v-for="(columnTasks, colIndex) in taskColumns"
                :key="colIndex"
                class="flex flex-col gap-2"
              >
                <Task
                  v-for="task in columnTasks"
                  :key="task.id"
                  :task="task"
                  :hasBorder="true"
                  :hasCheckbox="true"
                  :isEditable="true"
                  :showInfo="true"
                  taskClasses="self-start"
                ></Task>
              </div>
            </div>

            <div class="flex gap-x-2 max-w-lg mt-3 pt-3 border-t border-gray-200">
              <button
                type="button"
                class="text-xs rounded-md text-white py-1.5 px-2.5 bg-blue-500 hover:opacity-90 transition-opacity duration-100"
              >
                Подтвердить
              </button>

              <button
                type="button"
                class="text-xs rounded-md text-red-500 py-1.5 px-2.5 bg-red-100 hover:bg-red-200 transition-colors duration-100"
              >
                Отклонить
              </button>
            </div>
          </AIBubble>

          <AIBubble
            date="18 ноября в 15:00"
            :fastQuestions="['Создать задачу', 'Запланировать встречу', 'Показать отчёт']"
          >
            <Assistant text="Следующие категории будут удалены:" />

            <div class="flex gap-2 mt-3">
              <div
                v-for="(columnCategories, colIndex) in categoryColumns"
                :key="colIndex"
                class="flex flex-col gap-2"
              >
                <EntityCard
                  v-for="category in columnCategories"
                  :key="category.id"
                  :name="category.name"
                  :hideButtons="true"
                  :showInfo="true"
                ></EntityCard>
              </div>
            </div>

            <div class="flex gap-x-2 max-w-lg mt-3 pt-3 border-t border-gray-200">
              <button
                type="button"
                class="text-xs rounded-md text-white py-1.5 px-2.5 bg-blue-500 hover:opacity-90 transition-opacity duration-100"
              >
                Подтвердить
              </button>

              <button
                type="button"
                class="text-xs rounded-md text-red-500 py-1.5 px-2.5 bg-red-100 hover:bg-red-200 transition-colors duration-100"
              >
                Отклонить
              </button>
            </div>
          </AIBubble>
        </div>
        <!-- Footer -->
        <AIInput :no-input-margin="true" />
      </div>
    </div>
  </div>
</template>
