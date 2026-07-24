<script setup lang="ts">
import { Search, X } from '@lucide/vue'
defineProps<{ modelValue: string; placeholder?: string }>()
defineEmits(['update:modelValue', 'clear', 'focus'])
const inputRef = ref<HTMLInputElement | null>(null)
defineExpose({ focus: () => inputRef.value?.focus(), inputRef })
</script>

<template>
  <div class="relative w-full">
    <div class="absolute inset-y-0 left-0 flex items-center ps-3.5 pointer-events-none">
      <Search class="size-4 text-gray-400" />
    </div>

    <input
      ref="inputRef"
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      type="search"
      class="w-full py-1.5 h-9 ps-10 pe-8.5 block outline-none border border-gray-200 bg-gray-100 hover:bg-gray-200 transition-colors focus:bg-white rounded-lg text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
      :placeholder="placeholder"
      @focus="$emit('focus')"
      autocomplete="off"
    />

    <button
      v-if="modelValue"
      @click="$emit('clear')"
      class="absolute inset-y-0 right-0 pe-2.5 flex items-center group"
    >
      <X class="size-4 text-gray-400 group-hover:text-gray-600" />
    </button>
  </div>
</template>

<style lang="css" scoped>
input[type='search']::-webkit-search-decoration,
input[type='search']::-webkit-search-cancel-button,
input[type='search']::-webkit-search-results-button,
input[type='search']::-webkit-search-results-decoration {
  -webkit-appearance: none;
}
</style>
