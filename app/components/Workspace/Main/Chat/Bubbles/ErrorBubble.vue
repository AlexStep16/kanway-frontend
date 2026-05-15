<script setup lang="ts">
import { CircleX } from 'lucide-vue-next'

defineProps<{
  text?: string
}>()
</script>

<template>
  <div class="flex items-start gap-1 text-red-500 bg-red-100 p-2 rounded-md text-xs">
    <CircleX class="size-3.5 shrink-0 mt-px" />
    <span>{{ text || 'Возникла ошибка при отправке сообщения. Попробуйте снова.' }}</span>
  </div>
</template>
