<script setup lang="ts">
import { Copy, Star, StarOff, Archive } from 'lucide-vue-next'
import type { IBoard } from '~/interfaces/domain/IBoard'

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

function handleArchive() {
  emits('close')

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
  >
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
</template>
