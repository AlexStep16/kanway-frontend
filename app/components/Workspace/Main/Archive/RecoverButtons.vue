<script setup lang="ts">
const emit = defineEmits<{
  (e: 'recover'): void
  (e: 'delete'): void
}>()

function recoverEntity(event: Event) {
  emit('recover')

  event.stopPropagation()
}

function deleteEntity(event: Event) {
  emit('delete')

  event.stopPropagation()
}
</script>

<template>
  <div class="flex items-center gap-x-2">
    <button
      type="button"
      class="text-gray-500 hover:text-blue-500 transition-all duration-100 hover:underline font-medium text-xs"
      @click="recoverEntity"
    >
      Восстановить
    </button>
    <button
      type="button"
      class="text-gray-500 hover:text-red-400 transition-all duration-100 hover:underline font-medium text-xs"
      @click="deleteEntity"
    >
      Удалить
    </button>
  </div>
</template>
