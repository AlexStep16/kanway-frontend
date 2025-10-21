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
    />

    <SubmitButton
      :isLoading="isLoading"
      @submit="$emit('submit')"
      :text="mode === 'create' ? 'Создать' : 'Сохранить'"
    />
  </div>
</template>
