<script setup lang="ts">
const props = defineProps<{
  categoryId: string
  boardId: string
  workspaceId: string
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

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
        categoryId: props.categoryId,
        boardId: props.boardId,
        workspaceId: props.workspaceId,
      },
    },
    {
      onSuccess: () => {
        name.value = ''
        emit('close')
      },
      onError: () => {
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
    class="flex flex-col shrink-0 rounded-md min-w-60 cursor-pointer max-w-75 w-full shadow-gray-200 bg-white transition-shadow duration-100 overflow-hidden shadow-sm undraggable"
  >
    <div class="flex gap-x-2 p-3 relative">
      <div
        class="flex items-center gap-x-2 shrink min-w-0 text-gray-800"
        v-if="isTaskAdding"
      >
        <div class="flex items-center justify-center">
          <Spinner class="size-3.5 text-gray-600" />
        </div>
        <span class="text-sm overflow-hidden wrap-break-word">
          {{ name }}
        </span>
      </div>

      <input
        type="text"
        class="text-gray-800 w-full text-sm border-none ring-0 p-0"
        v-model="name"
        @blur="create"
        @keydown.enter="(event: any) => event.target?.blur()"
        @keydown.esc="$emit('close')"
        :disabled="isTaskAdding"
        ref="nameInputRef"
        placeholder="Название задачи"
        v-else
      />
    </div>
  </div>
</template>
