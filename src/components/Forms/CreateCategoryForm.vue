<script setup lang="ts">
import { useCreateCategory } from '@/composables/categories/mutations/useCreateCategory'
import { useBoardStore } from '@stores/board'
import { useWorkspaceStore } from '@stores/workspace'
import { storeToRefs } from 'pinia'
import { onMounted, ref } from 'vue'

defineProps<{
  isFormShown: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const boardStore = useBoardStore()
const workspaceStore = useWorkspaceStore()

const boardId = storeToRefs(boardStore).activeBoardId
const workspaceId = storeToRefs(workspaceStore).activeWorkspaceId

const { mutate: createCategory, isPending: isCategoryAdding } = useCreateCategory()

const name = ref('')
const nameInputRef = ref<HTMLInputElement | null>(null)

function create() {
  if (name.value.trim() === '') {
    return emit('close')
  }

  createCategory(
    {
      payload: {
        name: name.value.trim(),
      },
      boardId: boardId.value,
      workspaceId: workspaceId.value,
    },
    {
      onSuccess: () => {
        name.value = ''
        emit('close')
      },
    },
  )
}

onMounted(() => {
  const nameInput = nameInputRef.value

  if (nameInput) {
    nameInput.focus()
  }
})
</script>

<template>
  <div
    class="bg-gray-100 flex flex-col shrink-0 gap-y-3 py-3 px-4 rounded-md h-full w-70 sm:w-75 group/category select-none"
    v-if="isFormShown"
  >
    <!-- Header -->
    <div class="flex w-full justify-between items-center">
      <div
        class="flex gap-x-2 items-center h-8 min-w-0 text-sm text-gray-800 cursor-pointer transition-colors duration-100 group"
      >
        <template v-if="isCategoryAdding">
          <div class="flex items-center justify-center">
            <Spinner class="size-3.5 text-gray-600" />
          </div>
          <span class="font-semibold group-hover:text-gray-600 truncate">{{ name }}</span>
        </template>

        <div class="grow-1" v-show="!isCategoryAdding">
          <input
            type="text"
            class="text-sm h-full font-semibold p-0 text-gray-800 bg-transparent border-none focus:outline-none focus:ring-0 transition-colors duration-100"
            :value="name"
            @blur="$emit('close')"
            @keydown.enter="create"
            @keydown.esc="$emit('close')"
            :disabled="isCategoryAdding"
            ref="nameInputRef"
            placeholder="Название категории"
          />
        </div>
      </div>
    </div>
  </div>
</template>
