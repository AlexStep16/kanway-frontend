<script setup lang="ts" generic="T extends { isDeleted: boolean }">
import { X, Copy, Archive } from 'lucide-vue-next'

defineProps<{
  editableEntity: T
  isEntityCopying?: boolean
  isEntityArchiving?: boolean
  isEntityUpdating?: boolean
}>()

defineEmits<{
  (e: 'copy', entity: T): Promise<void>
  (e: 'archive', entity: T): Promise<void>
}>()
</script>

<template>
  <div class="flex shrink-0 gap-x-2 sm:gap-x-3 min-w-0">
    <div class="flex items-center transition-all duration-100">
      <div
        class="flex text-gray-400 p-1.5 bg-white"
        v-if="isEntityUpdating"
      >
        <Spinner class="size-4" />
      </div>

      <template v-if="!editableEntity.isDeleted">
        <button
          type="button"
          class="flex text-gray-400 hover:text-gray-500 p-1.5 rounded-full bg-white hover:bg-gray-100"
          title="Копировать"
          @click.stop="$emit('copy', editableEntity)"
        >
          <Spinner
            v-if="isEntityCopying"
            class="size-4"
          />
          <Copy
            v-else
            class="size-4"
          />
        </button>
        <button
          type="button"
          class="flex text-gray-400 hover:text-gray-500 p-1.5 rounded-full bg-white hover:bg-gray-100"
          title="Архивировать"
          @click.stop="$emit('archive', editableEntity)"
        >
          <Spinner
            v-if="isEntityArchiving"
            class="size-4"
          />
          <Archive
            v-else
            class="size-4"
          />
        </button>
      </template>
    </div>

    <DialogClose
      data-slot="dialog-close"
      class="transition-colors duration-100 text-secondary-foreground hover:bg-gray-200 p-1 rounded-full shrink-0"
    >
      <X class="size-5" />
      <span class="sr-only">Close</span>
    </DialogClose>
  </div>
</template>
