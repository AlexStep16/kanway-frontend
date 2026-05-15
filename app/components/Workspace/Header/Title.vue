<script setup lang="ts">
import { SquarePen } from 'lucide-vue-next'

const props = defineProps<{
  isLoading: boolean
  isBusy?: boolean
  initialName: string
}>()

const name = ref(props.initialName)

const emit = defineEmits<{
  (e: 'updateName', newName: string): void
}>()

const isInputVisible = ref(false)

function showInput() {
  isInputVisible.value = true
}

function handleResetForm() {
  name.value = props.initialName
  isInputVisible.value = false
}

function handleUpdateName() {
  const trimmedName = name.value.trim()

  if (trimmedName) {
    emit('updateName', trimmedName)

    isInputVisible.value = false
  } else {
    handleResetForm()
  }
}

watch(
  () => props.initialName,
  (newName) => {
    if (!isInputVisible.value) {
      name.value = newName
    }
  },
)
</script>

<template>
  <div class="flex gap-x-1 items-center min-w-0 overflow-hidden">
    <template v-if="!isLoading">
      <Button
        variant="secondary"
        class="px-1.5! group max-w-full"
        size="sm"
        @click="showInput"
        v-if="!isInputVisible"
      >
        <div class="shrink-0 size-4 relative flex items-center justify-center">
          <Spinner class="size-4 absolute" v-if="isBusy" />
          <slot v-else></slot>
        </div>
        <span class="truncate">{{ name }}</span>
        <SquarePen class="size-3.5 text-muted-foreground opacity-0 group-hover:opacity-100" />
      </Button>

      <Input
        v-model="name"
        isFocused
        class="font-medium text-secondary-foreground px-2 h-8 focus-visible:ring-0 focus-visible:outline-none"
        @keydown.enter="handleUpdateName"
        @keydown.esc="handleResetForm"
        @blur="handleResetForm"
        v-autowidth
        v-else
      />
    </template>
    <Skeleton class="h-8 w-32 rounded-md" v-else />
  </div>
</template>
