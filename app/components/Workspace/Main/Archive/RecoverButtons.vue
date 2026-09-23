<script setup lang="ts">
const props = defineProps<{
  type: 'task' | 'column' | 'board' | 'workspace'
}>()

const emit = defineEmits<{
  (e: 'recover'): void
  (e: 'delete'): void
}>()

const isDeleteConfirmOpen = ref(false)

const deleteModalContent = computed(() => {
  switch (props.type) {
    case 'task':
      return {
        title: 'Удаление задачи',
        description: 'Задача будет удалена навсегда. Это действие необратимо.',
      }
    case 'column':
      return {
        title: 'Удаление колонки',
        description:
          'Колонка и все входящие задачи будут удалены навсегда. Это действие необратимо.',
      }
    case 'board':
      return {
        title: 'Удаление доски',
        description:
          'Доска, все колонки и связанные задачи будут удалены навсегда. Это действие необратимо.',
      }
    case 'workspace':
      return {
        title: 'Удаление пространства',
        description:
          'Пространство, все доски, колонки и задачи будут удалены навсегда. Это действие необратимо.',
      }
  }
})

function recoverEntity(event: Event) {
  emit('recover')
  event.stopPropagation()
}

function openDeleteConfirm(event: Event) {
  event.stopPropagation()
  isDeleteConfirmOpen.value = true
}

function confirmDelete() {
  emit('delete')
}
</script>

<template>
  <div class="flex items-center gap-x-2">
    <button
      type="button"
      class="text-gray-500 hover:text-blue-500 transition-all duration-100 hover:underline font-medium text-xs"
      @click="recoverEntity"
    >
      Восстановить
    </button>
    <button
      type="button"
      class="text-gray-500 hover:text-red-400 transition-all duration-100 hover:underline font-medium text-xs"
      @click="openDeleteConfirm"
    >
      Удалить
    </button>
  </div>

  <AlertDialog
    :open="isDeleteConfirmOpen"
    @update:open="(val) => (isDeleteConfirmOpen = val)"
  >
    <AlertDialogContent
      class="max-w-sm p-0 overflow-hidden border-none shadow-2xl rounded-xl gap-0"
    >
      <div class="p-6">
        <AlertDialogHeader class="space-y-3 text-center">
          <AlertDialogTitle class="text-xl font-bold tracking-tight text-foreground m-0">
            {{ deleteModalContent?.title }}
          </AlertDialogTitle>
          <AlertDialogDescription class="text-sm text-muted-foreground">
            {{ deleteModalContent?.description }}
          </AlertDialogDescription>
        </AlertDialogHeader>
      </div>

      <div class="border-t border-border bg-muted/30 px-6 py-4">
        <AlertDialogFooter class="flex-row gap-3 sm:justify-center">
          <AlertDialogCancel
            @click="isDeleteConfirmOpen = false"
            class="mt-0 flex-1 bg-background hover:bg-accent border-border"
          >
            Отмена
          </AlertDialogCancel>
          <AlertDialogAction
            @click="confirmDelete"
            class="flex-1 bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Удалить
          </AlertDialogAction>
        </AlertDialogFooter>
      </div>
    </AlertDialogContent>
  </AlertDialog>
</template>
