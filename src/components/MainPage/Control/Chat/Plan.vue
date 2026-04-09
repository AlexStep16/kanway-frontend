<script setup lang="ts">
import AIBubble from '@components/Workspace/Main/Chat/Bubbles/AIBubble.vue'
import UserBubble from '@components/Workspace/Main/Chat/Bubbles/UserBubble.vue'
import Confirmation from '@components/Workspace/Main/Chat/Bubbles/Confirmation.vue'
import AIInput from '@components/Workspace/Main/Chat/AIInput.vue'
import Task from '@components/Workspace/Main/Task/Task.vue'
import ColumnsView from '@components/Workspace/Main/ColumnsView.vue'
import { onMounted, ref } from 'vue'
import { ITaskState } from '@/stores/interfaces/ITaskState'

defineProps<{
  tasks: (ITaskState & { isSelected: boolean })[]
}>()

const containerRef = ref<HTMLElement | null>(null)

onMounted(() => {
  if (window.HSStaticMethods) {
    window.HSStaticMethods.autoInit()
  }
})
</script>

<template>
  <div class="flex flex-col grow gap-2 h-160 overflow-y-auto py-2 px-1">
    <!-- Body -->
    <div
      class="flex flex-col grow gap-2 min-h-0 overflow-y-auto py-2 px-1 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300"
      ref="containerRef"
    >
      <UserBubble
        text="Поменяй цвет всех задач с #работа на синий и перенеси их в категорию 'Срочное'."
        date="18 ноября в 14:59"
      />

      <AIBubble date="18 ноября в 15:00">
        <Confirmation text="Следующим задачам будут присвоены значения:" />

        <ColumnsView :items="tasks" :containerRef="containerRef" class="mt-3">
          <template v-slot:default="slotProps">
            <Task
              v-for="task in slotProps.data"
              :key="task.id"
              :task="task"
              :hasBorder="true"
              :hasCheckbox="true"
              :isSelected="task.isSelected"
              :showInfo="true"
              :isStatic="true"
              @toggleSelect="task.isSelected = !task.isSelected"
              taskClasses="self-start"
            ></Task>
          </template>
        </ColumnsView>

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
    <AIInput :isDisabled="true" />
  </div>
</template>
