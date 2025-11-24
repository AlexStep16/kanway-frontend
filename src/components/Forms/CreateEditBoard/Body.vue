<script setup lang="ts">
import Title from '@components/Forms/BasicCreateEditForm/Title.vue'
import SubmitButton from '@components/Forms/BasicCreateEditForm/SubmitButton.vue'
import { BoardValidationErrors } from '@/interfaces/BoardValidationErrors'

defineProps<{
  id: string
  name: string
  errors: BoardValidationErrors
  mode: 'create' | 'edit'
  isLoading: boolean
  isFormChanged: boolean
  dropdownMenuWidth?: number
}>()

defineEmits<{
  (e: 'submit'): void
  (e: 'update:name', name: string): void
  (e: 'resetErrors'): void
}>()
</script>

<template>
  <div
    class="flex flex-col gap-y-2 p-2"
    :style="{ width: dropdownMenuWidth ? dropdownMenuWidth + 'px' : 'auto' }"
  >
    <Title
      :id="id"
      :name="name"
      :errors="errors"
      @resetErrors="$emit('resetErrors')"
      @update:name="$emit('update:name', $event)"
      @submit="$emit('submit')"
    />

    <div class="flex justify-end gap-x-2 pt-2 border-t border-gray-200 relative">
      <SubmitButton
        :isLoading="isLoading"
        :isFormChanged="isFormChanged"
        @submit="$emit('submit')"
        :text="mode === 'create' ? 'Создать' : 'Сохранить'"
      />
    </div>
  </div>
</template>
