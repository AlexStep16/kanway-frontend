<script setup lang="ts">
import EntityCard, { type EntityCardOptions } from '../EntityCard.vue'
import type { IBoard } from '~/interfaces/domain/IBoard'

const props = defineProps<{
  board: IBoard
  options?: EntityCardOptions
  selectedIds?: string[]
  classes?: string
}>()

// --- Mutations ---
const { mutate: archiveBoard } = useArchiveBoard()
const { mutate: cloneBoard } = useCloneBoard()

const status = useBoardMutationStatus(computed(() => props.board.id))

const isArchiveConfirmOpen = ref(false)

function handleCopy() {
  if (props.options?.isStatic) return

  cloneBoard({ id: props.board.id })
}

function handleArchive() {
  if (props.options?.isStatic) return

  isArchiveConfirmOpen.value = true
}

function confirmArchive() {
  archiveBoard({ board: props.board })
}
</script>

<template>
  <EntityCard
    :entity="board"
    :options="options"
    :classes="classes"
    :status="status"
    :selected-ids="selectedIds"
    @copy="handleCopy"
    @archive="handleArchive"
  >
    <slot />
  </EntityCard>

  <AlertDialog
    :open="isArchiveConfirmOpen"
    @update:open="(val) => (isArchiveConfirmOpen = val)"
  >
    <AlertDialogContent
      class="max-w-sm p-0 overflow-hidden border-none shadow-2xl rounded-xl gap-0"
    >
      <div class="p-6">
        <AlertDialogHeader class="space-y-3 text-center">
          <AlertDialogTitle class="text-xl font-bold tracking-tight text-foreground m-0">
            Архивирование доски
          </AlertDialogTitle>
          <AlertDialogDescription class="text-sm text-muted-foreground">
            Вы уверены, что хотите архивировать доску
            <span class="font-medium text-foreground">{{ board.name }}</span
            >? Все колонки и связанные задачи будут перемещены в архив.
          </AlertDialogDescription>
        </AlertDialogHeader>
      </div>

      <div class="border-t border-border bg-muted/30 px-6 py-4">
        <AlertDialogFooter class="flex-row gap-3 sm:justify-center">
          <AlertDialogCancel
            @click="isArchiveConfirmOpen = false"
            class="mt-0 flex-1 bg-background hover:bg-accent border-border"
          >
            Отмена
          </AlertDialogCancel>
          <AlertDialogAction
            @click="confirmArchive"
            class="flex-1 bg-blue-500 text-white hover:bg-blue-600"
          >
            Архивировать
          </AlertDialogAction>
        </AlertDialogFooter>
      </div>
    </AlertDialogContent>
  </AlertDialog>
</template>
