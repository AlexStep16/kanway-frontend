<script setup lang="ts">
import { Plus } from 'lucide-vue-next'

defineProps<{
  text?: string
}>()

const emit = defineEmits<{
  (e: 'refEvent', el: HTMLElement): void
}>()
</script>

<template>
  <button
    type="button"
    :ref="
      (el) => {
        if (el) emit('refEvent', el as HTMLElement)
      }
    "
    class="text-xs text-blue-500 inline-flex justify-center gap-x-1 py-2 px-3 items-center w-full font-semibold rounded-md bg-blue-100 hover:bg-blue-200"
  >
    <Plus class="size-4" />
    {{ text || 'Создать' }}
  </button>
</template>
