<script setup lang="ts">
import {
  EllipsisVertical,
  MoveHorizontal,
  Copy,
  Star,
  StarOff,
  Archive,
  Pen,
  Trash,
} from '@lucide/vue'
import { cn } from '~/lib/utils'

export interface ItemStatus {
  isArchiving: MaybeRefOrGetter<boolean>
  isMoving: MaybeRefOrGetter<boolean>
  isCloning: MaybeRefOrGetter<boolean>
  isFavoritePending?: MaybeRefOrGetter<boolean>
  isDeleting: MaybeRefOrGetter<boolean>
  isUpdating: MaybeRefOrGetter<boolean>
  isBusy: MaybeRefOrGetter<boolean>
}

const props = defineProps<{
  item: { id: string; name: string; isFavorite?: boolean }
  tooltipEntityType: string
  options: {
    edit?: boolean
    copy?: boolean
    move?: boolean
    favorite?: boolean
    archive?: boolean
    delete?: boolean
  }
  status: ItemStatus
  groupName: string
  hoverClass?: string
  isAlwaysVisible?: boolean
  resetForm?: () => void
}>()

const emit = defineEmits<{
  (e: 'edit'): void
  (e: 'copy'): void
  (e: 'favorite'): void
  (e: 'archive'): void
  (e: 'delete'): void
}>()

const slots = useSlots()

const isMenuOpen = ref(false)
const activeView = ref<'menu' | 'edit' | 'transfer'>('menu')

const closeMenu = () => {
  isMenuOpen.value = false
}

const isItemFavorite = computed(() => !!props.item.isFavorite)

watch(isMenuOpen, (isOpen) => {
  if (!isOpen) {
    setTimeout(() => {
      activeView.value = 'menu'
      props.resetForm?.()
    }, 500)
  }
})

defineExpose({ closeMenu })

const visibilityClasses = computed(() =>
  props.isAlwaysVisible
    ? 'opacity-100'
    : `group-hover/${props.groupName}:opacity-100 opacity-100 md:opacity-0`,
)

function onAction(action: 'archive' | 'delete' | 'copy') {
  emit(action as any)
  closeMenu()
}

function onEdit() {
  if (slots['edit-content']) {
    activeView.value = 'edit'

    return
  }

  emit('edit')
  closeMenu()
}
</script>

<template>
  <TooltipProvider :disableHoverableContent="true">
    <Popover v-model:open="isMenuOpen">
      <PopoverTrigger as-child>
        <Tooltip :delayDuration="300">
          <TooltipTrigger as-child>
            <button
              type="button"
              :class="
                cn(
                  'p-1 transition-all duration-200 rounded-full hover:bg-gray-200 focus:outline-none',
                  hoverClass,
                  visibilityClasses,
                  isMenuOpen && 'bg-blue-200 text-primary hover:bg-blue-200',
                )
              "
              @click="isMenuOpen = !isMenuOpen"
            >
              <EllipsisVertical class="size-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Действия с {{ props.tooltipEntityType }}</p>
          </TooltipContent>
        </Tooltip>
      </PopoverTrigger>

      <PopoverContent
        class="w-60 p-1"
        align="start"
        :side-offset="5"
      >
        <div
          v-if="activeView === 'menu'"
          class="flex flex-col gap-y-0.5"
        >
          <Button
            v-if="options.edit"
            variant="ghost"
            class="w-full justify-start font-normal h-auto px-2 py-1.5 gap-x-2"
            :disabled="toValue(status.isBusy)"
            @click="onEdit"
          >
            <Pen class="size-4" /> Редактировать
          </Button>

          <Button
            v-if="options.copy"
            variant="ghost"
            class="w-full justify-start font-normal h-auto px-2 py-1.5 gap-x-2 relative"
            :disabled="toValue(status.isBusy)"
            @click="onAction('copy')"
          >
            <div
              v-if="toValue(status.isCloning)"
              class="absolute inset-0 flex items-center justify-center bg-background/80"
            >
              <Spinner class="size-4 mr-2" /> Копирование...
            </div>
            <template v-else> <Copy class="size-4" /> Копировать </template>
          </Button>

          <Button
            v-if="options.move"
            variant="ghost"
            class="w-full justify-start font-normal h-auto px-2 py-1.5 gap-x-2 relative"
            :disabled="toValue(status.isBusy)"
            @click="activeView = 'transfer'"
          >
            <div
              v-if="toValue(status.isMoving)"
              class="absolute inset-0 flex items-center justify-center bg-background/80"
            >
              <Spinner class="size-4 mr-2" /> Перемещение...
            </div>
            <template v-else> <MoveHorizontal class="size-4" /> Переместить </template>
          </Button>

          <Button
            v-if="options.favorite"
            variant="ghost"
            class="w-full justify-start font-normal h-auto px-2 py-1.5 gap-x-2 relative"
            :disabled="toValue(status.isBusy)"
            @click="$emit('favorite')"
          >
            <div
              v-if="toValue(status.isFavoritePending)"
              class="absolute inset-0 flex items-center justify-center bg-background/80"
            >
              <Spinner class="size-4 mr-2" />
              {{ isItemFavorite ? 'Удаление...' : 'Добавление...' }}
            </div>
            <template v-else>
              <component
                :is="isItemFavorite ? StarOff : Star"
                class="size-4"
              />
              {{ isItemFavorite ? 'Удалить из избранного' : 'В избранное' }}
            </template>
          </Button>

          <Button
            v-if="options.archive"
            variant="ghost"
            class="w-full justify-start font-normal h-auto px-2 py-1.5 gap-x-2 relative"
            :disabled="toValue(status.isBusy)"
            @click="onAction('archive')"
          >
            <div
              v-if="toValue(status.isArchiving)"
              class="absolute inset-0 flex items-center justify-center bg-background/80"
            >
              <Spinner class="size-4 mr-2" /> Архивирование...
            </div>
            <template v-else> <Archive class="size-4" /> В архив </template>
          </Button>

          <div
            v-if="options.delete"
            class="my-1 border-t"
          />

          <Button
            v-if="options.delete"
            variant="ghost"
            class="w-full justify-start font-normal h-auto px-2 py-1.5 gap-x-2 text-destructive hover:text-destructive hover:bg-destructive/10 relative"
            :disabled="toValue(status.isBusy)"
            @click="onAction('delete')"
          >
            <div
              v-if="toValue(status.isDeleting)"
              class="absolute inset-0 flex items-center justify-center bg-background/80"
            >
              <Spinner class="size-4 mr-2" /> Удаление...
            </div>
            <template v-else> <Trash class="size-4" /> Удалить </template>
          </Button>
        </div>

        <div
          v-else-if="activeView === 'edit'"
          class="p-2"
        >
          <slot
            name="edit-content"
            :close="() => (activeView = 'menu')"
            :closeDropdown="closeMenu"
          />
        </div>

        <div v-else-if="activeView === 'transfer'">
          <slot
            name="transfer-content"
            :close="() => (activeView = 'menu')"
            :closeDropdown="closeMenu"
          />
        </div>
      </PopoverContent>
    </Popover>
  </TooltipProvider>
</template>
