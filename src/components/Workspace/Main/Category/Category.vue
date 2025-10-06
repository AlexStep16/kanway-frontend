<script setup lang="ts">
import ButtonCreate from '@/components/Buttons/ButtonCreate.vue'
import Options from '@components/Options.vue'
import Task from '../Task/Task.vue'

defineProps<{
  category: {
    id: number
    name: string
    tasks: Array<any>
  }
}>()
</script>

<template>
  <div
    class="bg-gray-100 flex flex-col shrink-0 gap-y-3 py-3 px-4 rounded-md h-full w-75 group/category"
  >
    <!-- Header -->
    <div class="flex w-full justify-between items-center">
      <span class="text-sm font-semibold text-gray-800">{{ category.name }}</span>

      <Options
        :options="{
          edit: false,
          copy: true,
          move: true,
          favorite: false,
          archive: true,
        }"
        :item="category"
        :is_always_visible="true"
        group_name="category"
        class="text-gray-600"
      />
    </div>

    <!-- Tasks -->
    <div class="flex flex-col gap-y-2 mb-3">
      <ButtonCreate text="Добавить задачу" />

      <Task
        v-for="task in category.tasks"
        :key="task.id"
        :task="task"
        :isEditable="true"
        :hasCopy="true"
        :hasDelete="true"
      />
    </div>
  </div>
</template>
