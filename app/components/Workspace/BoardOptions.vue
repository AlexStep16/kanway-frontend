<script setup lang="ts">
import { Copy, Star, StarOff, Archive, MoveHorizontal } from '@lucide/vue'
import type { IBoard } from '~/interfaces/domain/IBoard'
import TransferForm from '~/components/Options/TransferForm.vue'

const props = defineProps<{
  board: IBoard
  isMobile?: boolean
}>()

const emits = defineEmits<{
  (e: 'close'): void
}>()

const { mutate: archiveBoard, isPending: isArchiving } = useArchiveBoard()
const { mutate: cloneBoard, isPending: isCloning } = useCloneBoard()
const { mutate: makeFavorite } = useFavoriteBoard()
const { mutate: moveBoard, isPending: isMoving } = useMoveBoard()
const { data: workspacesData } = useWorkspaces()

const isArchiveConfirmOpen = ref(false)
const activeView = ref<'menu' | 'transfer'>('menu')

const otherWorkspaces = computed(
  () => workspacesData.value?.filter((w) => w.id !== props.board.workspace.id) || [],
)

function handleArchive() {
  emits('close')
  isArchiveConfirmOpen.value = true
}

function confirmArchive() {
  archiveBoard({
    board: props.board,
  })
}

function handleCopy() {
  cloneBoard(
    {
      id: props.board.id,
    },
    {
      onSettled() {
        emits('close')
      },
    },
  )
}

function handleMove(newWorkspaceId: string) {
  moveBoard({
    payload: {
      id: props.board.id,
      workspaceId: newWorkspaceId,
    },
    oldWorkspaceId: props.board.workspace.id,
    newWorkspaceId,
  })
}

function handleClose() {
  emits('close')
}

const isFavorite = computed(() => props.board.isFavorite)

function handleFavorite() {
  makeFavorite({
    board: props.board,
  })
}
</script>

<template>
  <DropdownMenuContent
    class="w-56 rounded-lg"
    :side="isMobile ? 'bottom' : 'right'"
    :align="isMobile ? 'end' : 'start'"
    @closeAutoFocus="activeView = 'menu'"
  >
    <template v-if="activeView === 'menu'">
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

      <template v-if="!toValue(isMoving)">
        <DropdownMenuItem
          @click="activeView = 'transfer'"
          @select.prevent
        >
          <MoveHorizontal />
          <span>Переместить</span>
        </DropdownMenuItem>
      </template>
      <template v-else>
        <DropdownMenuItem disabled>
          <Spinner />
          <span>Перемещение</span>
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
    </template>

    <TransferForm
      v-else
      :items="otherWorkspaces"
      :isProcessing="isMoving"
      :noItemsText="'Нет других пространств'"
      @close="handleClose"
      @select="handleMove"
    />
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
