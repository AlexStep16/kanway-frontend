<script setup lang="ts">
import { useCreateTask } from '@/composables/tasks/mutations/useCreateTask'
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

const { mutate: createTask, isPending: isTaskAdding } = useCreateTask()

const name = ref('')
const nameInputRef = ref<HTMLInputElement | null>(null)

function create() {
  if (name.value.trim() === '') {
    return emit('close')
  }

  createTask(
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
    class="flex flex-col shrink-0 rounded-md min-w-60 cursor-pointer hover:shadow-md hover:shadow-gray-300 max-w-75 w-full shadow-gray-200 bg-white transition-shadow duration-100 overflow-hidden select-none"
  >
    <div class="h-3 w-full" />
    <div class="flex gap-x-2 p-3 relative">
      <div class="flex items-center" v-if="isTaskAdding">
        <Spinner class="size-3.5 text-gray-600" />
      </div>
      <input
        type="text"
        class="text-sm h-full font-semibold p-0 text-gray-800 bg-transparent border-none focus:outline-none focus:ring-0 transition-colors duration-100"
        :value="name"
        @blur="$emit('close')"
        @keydown.enter="create"
        @keydown.esc="$emit('close')"
        :disabled="isTaskAdding"
        ref="nameInputRef"
        placeholder="Название задачи"
      />
    </div>
  </div>
</template>
