<script setup lang="ts">
import { Copy, Star, StarOff, Archive, Pen } from '@lucide/vue'
import type { IWorkspace } from '~/interfaces/domain/IWorkspace'

const props = defineProps<{
  workspace: IWorkspace
  isMobile?: boolean
}>()

const uiStore = useUIStore()

const emits = defineEmits<{
  (e: 'close'): void
}>()

const { mutate: archiveWorkspace, isPending: isArchiving } = useArchiveWorkspace()
const { mutate: cloneWorkspace, isPending: isCloning } = useCloneWorkspace()
const { mutate: makeFavorite } = useFavoriteWorkspace()

const isArchiveConfirmOpen = ref(false)

function handleArchive() {
  emits('close')
  isArchiveConfirmOpen.value = true
}

function confirmArchive() {
  archiveWorkspace({
    workspace: props.workspace,
  })
}

function handleCopy() {
  cloneWorkspace(
    {
      id: props.workspace.id,
    },
    {
      onSettled() {
        emits('close')
      },
    },
  )
}

const isFavorite = computed(() => props.workspace.isFavorite)

function handleFavorite() {
  makeFavorite({
    workspace: props.workspace,
  })
}

function handleEdit() {
  emits('close')
  uiStore.openWorkspaceDialog(props.workspace)
}
</script>

<template>
  <DropdownMenuContent
    class="w-56 rounded-lg"
    :side="isMobile ? 'bottom' : 'right'"
    :align="isMobile ? 'end' : 'start'"
  >
    <DropdownMenuItem
      @click="handleEdit"
      @select.prevent
    >
      <Pen />
      <span>Редактировать</span>
    </DropdownMenuItem>
    <DropdownMenuSeparator />
    <template v-if="!toValue(isCloning)">
      <DropdownMenuItem
        @click="handleCopy"
        @select.prevent
      >
        <Copy />
        <span>Копировать</span>
      </DropdownMenuItem>
    </template>
    <template v-else>
      <DropdownMenuItem disabled>
        <Spinner />
        <span>Копирование</span>
      </DropdownMenuItem>
    </template>
    <DropdownMenuItem
      v-if="isFavorite"
      @click="handleFavorite"
      @select.prevent
    >
      <StarOff />
      <span>Удалить из избранного</span>
    </DropdownMenuItem>

    <DropdownMenuItem
      v-else
      @click="handleFavorite"
      @select.prevent
    >
      <Star />
      <span>Добавить в избранное</span>
    </DropdownMenuItem>
    <DropdownMenuSeparator />
    <template v-if="!toValue(isArchiving)">
      <DropdownMenuItem
        @click="handleArchive"
        @select.prevent
      >
        <Archive />
        <span>Архивировать</span>
      </DropdownMenuItem>
    </template>
    <template v-else>
      <DropdownMenuItem disabled>
        <Spinner />
        <span>Архивирование</span>
      </DropdownMenuItem>
    </template>
  </DropdownMenuContent>

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
