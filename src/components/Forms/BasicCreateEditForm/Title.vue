<script setup lang="ts">
import { WorkspaceValidationErrors } from '@interfaces/WorkspaceValidationErrors'

defineProps<{
  id: string
  errors: WorkspaceValidationErrors
  name: string
}>()

defineEmits<{
  (e: 'update:name', name: string): void
  (e: 'resetErrors'): void
}>()
</script>

<template>
  <div class="flex flex-col gap-y-1">
    <label :for="id + '-name-input'" class="text-xs font-bold text-gray-500">Заголовок</label>
    <input
      type="text"
      :id="id + '-name-input'"
      class="py-1.5 block w-full border border-gray-200 bg-gray-100 rounded-lg text-gray-800 placeholder:text-gray-300 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
      :class="{ 'border-red-400': !errors.name.isValid }"
      placeholder="Введите заголовок"
      :name="id + '-name-input'"
      autocomplete="off"
      @keydown.stop=""
      @keypress.stop=""
      aria-expanded="false"
      :value="name"
      @focus="$emit('resetErrors')"
      @input="$emit('update:name', ($event.target as HTMLInputElement).value)"
    />
  </div>
</template>
