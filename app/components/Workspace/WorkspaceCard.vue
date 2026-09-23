<script setup lang="ts">
import EntityCard, { type EntityCardOptions } from './Main/EntityCard.vue'
import type { IWorkspace } from '~/interfaces/domain/IWorkspace'

const props = defineProps<{
  workspace: IWorkspace
  options?: EntityCardOptions
  selectedIds?: string[]
  classes?: string
}>()

// --- Mutations ---
const { mutate: archiveWorkspace } = useArchiveWorkspace()
const { mutate: cloneWorkspace } = useCloneWorkspace()

const status = useWorkspaceMutationStatus(computed(() => props.workspace.id))

const isArchiveConfirmOpen = ref(false)

function handleCopy() {
  if (props.options?.isStatic) return

  cloneWorkspace({ id: props.workspace.id })
}

function handleArchive() {
  if (props.options?.isStatic) return

  isArchiveConfirmOpen.value = true
}

function confirmArchive() {
  archiveWorkspace({ workspace: props.workspace })
}
</script>

<template>
  <EntityCard
    :entity="{
      ...workspace,
      color: undefined,
    }"
    :options="options"
    :classes="classes"
    :selected-ids="selectedIds"
    :status="status"
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
            Архивирование пространства
          </AlertDialogTitle>
          <AlertDialogDescription class="text-sm text-muted-foreground">
            Вы уверены, что хотите архивировать пространство
            <span class="font-medium text-foreground">{{ workspace.name }}</span
            >? Все доски, колонки и задачи будут перемещены в архив.
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
