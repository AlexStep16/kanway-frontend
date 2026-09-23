<script setup lang="ts">
import { Copy, Star, StarOff, Archive, Pen } from '@lucide/vue'
import type { IWorkspace } from '~/interfaces/domain/IWorkspace'

const props = defineProps<{
  workspace: IWorkspace
  isMobile?: boolean
  isArchiving?: boolean
}>()

const uiStore = useUIStore()

const emits = defineEmits<{
  (e: 'close'): void
  (e: 'archive'): void
}>()

const { mutate: cloneWorkspace, isPending: isCloning } = useCloneWorkspace()
const { mutate: makeFavorite } = useFavoriteWorkspace()

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
    @focus-outside.prevent
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
        @click="$emit('archive')"
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
