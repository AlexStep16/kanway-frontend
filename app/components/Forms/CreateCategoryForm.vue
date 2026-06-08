<script setup lang="ts">
const props = defineProps<{
  boardId: string
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const { mutate: createColumn, isPending: isColumnAdding } = useCreateColumn()

const name = ref('')
const nameInputRef = ref<HTMLInputElement | null>(null)

function create() {
  if (name.value.trim() === '') {
    return emit('close')
  }

  createColumn(
    {
      payload: {
        name: name.value.trim(),
        boardId: props.boardId,
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
    class="bg-gray-100 flex flex-col shrink-0 gap-y-3 py-3 px-4 rounded-md h-full w-70 sm:w-75 group/column select-none undraggable"
  >
    <!-- Header -->
    <div class="flex w-full justify-between items-center">
      <div
        class="flex gap-x-2 items-center h-8 min-w-0 text-sm text-gray-800 cursor-pointer transition-colors duration-100 group"
      >
        <template v-if="isColumnAdding">
          <div class="flex items-center justify-center">
            <Spinner class="size-3.5 text-gray-600" />
          </div>
          <span class="font-semibold group-hover:text-gray-600 truncate">{{ name }}</span>
        </template>

        <div
          class="grow"
          v-else
        >
          <input
            type="text"
            class="text-sm h-full font-semibold p-0 text-gray-800 bg-transparent border-none focus:outline-none focus:ring-0 transition-colors duration-100"
            v-model="name"
            @blur="create"
            @keydown.enter="(event: any) => event.target?.blur()"
            @keydown.esc="$emit('close')"
            :disabled="isColumnAdding"
            ref="nameInputRef"
            placeholder="Название категории"
          />
        </div>
      </div>
    </div>
  </div>
</template>
