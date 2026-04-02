<script setup lang="ts">
import AIBubble from '@components/Workspace/Main/Chat/Bubbles/AIBubble.vue'
import UserBubble from '@components/Workspace/Main/Chat/Bubbles/UserBubble.vue'
import Assistant from '@components/Workspace/Main/Chat/Bubbles/Assistant.vue'
import AIInput from '@components/Workspace/Main/Chat/AIInput.vue'
import { onMounted } from 'vue'
import dayjs from 'dayjs'

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
    >
      <UserBubble
        text="Поменяй цвет всех задач с #работа на синий и перенеси их в категорию 'Срочное'."
        :date="dayjs(new Date()).calendar() + ' в ' + dayjs(new Date()).format('HH:mm')"
      />

      <AIBubble date="18 ноября в 15:00">
        <Assistant text="Я успешно обновил задачи. Если тебе нужно что-то еще, просто скажи!" />
      </AIBubble>

      <UserBubble
        text="Я передумал, верни всё как было."
        :date="dayjs(new Date()).calendar() + ' в ' + dayjs(new Date()).format('HH:mm')"
      />

      <AIBubble date="18 ноября в 15:00">
        <Assistant text="Изменения отменены. Я вернул задачам исходный цвет и категорию!" />
      </AIBubble>
    </div>

    <!-- Footer -->
    <AIInput :no-input-margin="true" />
  </div>
</template>
