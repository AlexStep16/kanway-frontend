<script setup lang="ts">
import Title from '@components/Forms/BasicCreateEditForm/Title.vue'
import Color from '@components/Forms/BasicCreateEditForm/Color.vue'
import SubmitButton from '@components/Forms/BasicCreateEditForm/SubmitButton.vue'
import { WorkspaceValidationErrors } from '@interfaces/WorkspaceValidationErrors'

defineProps<{
  id: string
  name: string
  color: string
  errors: WorkspaceValidationErrors
  mode: 'create' | 'edit'
  isLoading: boolean
  dropdownMenuWidth?: number
}>()

defineEmits<{
  (e: 'submit'): void
  (e: 'update:name', name: string): void
  (e: 'update:color', color: string): void
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

    <Color :color="color" @update:color="$emit('update:color', $event)" />

    <SubmitButton
      :isLoading="isLoading"
      @submit="$emit('submit')"
      :text="mode === 'create' ? 'Создать' : 'Сохранить'"
    />
  </div>
</template>
