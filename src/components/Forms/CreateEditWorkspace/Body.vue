<script setup lang="ts">
import Title from '@components/Forms/BasicCreateEditForm/Title.vue'
import Color from '@components/Forms/BasicCreateEditForm/Color.vue'
import SubmitButton from '@components/Forms/BasicCreateEditForm/SubmitButton.vue'
import { WorkspaceValidationErrors } from '@interfaces/WorkspaceValidationErrors'
import { AvailableColors } from '@/enums/AvailableColors'

defineProps<{
  id: string
  name: string
  color: AvailableColors
  errors: WorkspaceValidationErrors
  mode: 'create' | 'edit'
  isLoading: boolean
  isFormChanged: boolean
  dropdownMenuWidth?: number
}>()

defineEmits<{
  (e: 'submit'): void
  (e: 'update:name', name: string): void
  (e: 'update:color', color: AvailableColors): void
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

    <Color :color="color" @update:color="$emit('update:color', $event)" />

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
