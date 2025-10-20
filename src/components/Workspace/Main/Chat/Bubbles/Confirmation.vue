<script setup lang="ts">
import Assistant from '@components/Workspace/Main/Chat/Bubbles/Assistant.vue'

defineProps<{
  text?: string
}>()
</script>

<template>
  <Assistant :text />
  <ul class="text-sm text-gray-700 mt-2">
    <!-- <li
      class="relative before:content-['•'] before:absolute before:left-0 before:inline-block ps-4"
    >
      <span class="font-semibold">Имя: </span>Сходить в парк
    </li>
    <li
      class="relative before:content-['•'] before:absolute before:left-0 before:inline-block ps-4"
    >
      <span class="font-semibold">Описание: </span>Выбрать день и спланировать прогулку в парке
    </li>
    <li
      class="relative before:content-['•'] before:absolute before:left-0 before:inline-block ps-4"
    >
      <span class="font-semibold">Дата: </span>Завтра в 19:00
    </li> -->
    <li
      class="relative before:content-['•'] before:absolute before:left-0 before:inline-block ps-4"
    >
      <span class="font-semibold">Цвет: </span>Синий
    </li>
    <li
      class="relative before:content-['•'] before:absolute before:left-0 before:inline-block ps-4"
    >
      <span class="font-semibold">Категория: </span>Срочное
    </li>
  </ul>
</template>
