<script setup lang="ts">
import Spinner from '@/components/Loader/Spinner.vue'

defineProps<{
  isLoading: boolean
  text?: string
}>()

defineEmits<{
  (e: 'submit'): void
}>()
</script>

<template>
  <div class="flex justify-end gap-x-2 pt-2 border-t border-gray-200 relative">
    <button
      type="button"
      :disabled="isLoading"
      class="flex items-center justify-center px-2.5 py-1.5 w-full bg-blue-500 text-custom-sm text-white rounded-md hover:opacity-90 transition-opacity duration-100 disabled:opacity-70"
      @click="$emit('submit')"
    >
      <div class="flex items-center justify-center absolute" v-if="isLoading">
        <Spinner class="size-4" />
      </div>
      <span :class="{ 'opacity-0': isLoading }">{{ text || 'Сохранить' }}</span>
    </button>
  </div>
</template>
