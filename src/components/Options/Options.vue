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
} from 'lucide-vue-next'
import { ref, computed, onMounted, MaybeRefOrGetter, toValue } from 'vue'
import Spinner from '@components/Loader/Spinner.vue'
import { HSDropdown, HSStaticMethods, ICollectionItem } from 'preline'
import { onClickOutside } from '@vueuse/core'

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
  (e: 'copy'): void
  (e: 'favorite'): void
  (e: 'archive'): void
  (e: 'delete'): void
}>()

const showEdit = ref(false)
const showTransfer = ref(false)

const dropdown = ref<HTMLElement | null>(null)
const dropdownInstance = ref<HSDropdown | null>(null)

const closeDropdown = () => {
  if (dropdownInstance.value) {
    dropdownInstance.value.close()
  }
}

const isItemFavorite = computed(() => {
  return !!props.item.isFavorite
})

const resetInternalState = () => {
  showEdit.value = false
  showTransfer.value = false
  props.resetForm?.()
}

onClickOutside(dropdown, () => {
  dropdownInstance.value?.close()
})

onMounted(() => {
  HSStaticMethods.autoInit()

  if (dropdown.value) {
    const { element } = HSDropdown.getInstance(dropdown.value, true) as ICollectionItem<HSDropdown>

    if (element) dropdownInstance.value = element

    if (dropdownInstance.value) {
      dropdownInstance.value.on('close', () => {
        setTimeout(resetInternalState, 200)
      })
    }
  }
})

function handleArchive() {
  emit('archive')

  closeDropdown()
}

function handleDelete() {
  emit('delete')

  closeDropdown()
}

function handleCopy() {
  emit('copy')

  closeDropdown()
}

defineExpose({ closeDropdown })

const visibilityClasses = computed(() =>
  props.isAlwaysVisible
    ? 'opacity-100'
    : `group-hover/${props.groupName}:opacity-100 opacity-100 pointer-fine:opacity-0`,
)
</script>

<template>
  <div
    :id="'hs-dropdown-' + item.id"
    class="hs-dropdown [--auto-close:false] inline-flex"
    ref="dropdown"
  >
    <button
      :id="'hs-dropdown-button-' + item.id"
      type="button"
      class="p-1 transition-colors duration-100 rounded-full focus:opacity-100 focus:outline-hidden hs-dropdown-open:opacity-100 hs-dropdown-open:bg-blue-200 hs-dropdown-open:text-blue-500"
      :class="[hoverClass, visibilityClasses]"
    >
      <EllipsisVertical class="size-4" />
    </button>

    <div
      class="hs-dropdown-menu transition-[opacity,margin] z-10 duration hs-dropdown-open:opacity-100 opacity-0 hidden min-w-60 bg-white shadow-md rounded-lg mt-2 after:h-4 after:absolute after:-bottom-4 after:start-0 after:w-full before:h-4 before:absolute before:-top-4 before:start-0 before:w-full"
      role="menu"
      ref="dropdownMenu"
      aria-orientation="vertical"
      :aria-labelledby="'hs-dropdown-button-' + item.id"
    >
      <div class="flex overflow-hidden">
        <div class="p-1 space-y-0.5 shrink-0 w-full" v-show="!showEdit && !showTransfer">
          <button
            class="w-full flex items-center gap-x-2 py-2 px-3 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-100 focus:outline-hidden focus:bg-gray-100 disabled:opacity-70 disabled:pointer-events-none"
            @click="showEdit = true"
            v-if="options.edit"
            :disabled="toValue(status.isBusy)"
          >
            <Pen class="size-4" />

            Редактировать
          </button>
          <button
            class="w-full flex items-center gap-x-2 py-2 px-3 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-100 focus:outline-hidden focus:bg-gray-100 group disabled:pointer-events-none"
            v-if="options.copy"
            :disabled="toValue(status.isBusy)"
            @click="handleCopy"
          >
            <div
              class="absolute size-full flex items-center gap-x-2"
              v-if="toValue(status.isCloning)"
            >
              <Spinner class="size-4" />

              Копирование...
            </div>
            <div
              class="flex items-center text-left gap-x-2 group-disabled:opacity-70"
              :class="{ 'opacity-0!': toValue(status.isCloning) }"
            >
              <Copy class="size-4" />

              Копировать
            </div>
          </button>
          <button
            class="w-full flex items-center gap-x-2 py-2 px-3 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-100 focus:outline-hidden focus:bg-gray-100 disabled:opacity-70 disabled:pointer-events-none"
            @click="showTransfer = true"
            v-if="options.move"
            :disabled="toValue(status.isBusy)"
          >
            <div
              class="absolute size-full flex items-center gap-x-2"
              v-if="toValue(status.isMoving)"
            >
              <Spinner class="size-4" />

              Перемещение...
            </div>
            <div
              class="flex items-center text-left gap-x-2 group-disabled:opacity-70"
              :class="{ 'opacity-0!': toValue(status.isMoving) }"
            >
              <MoveHorizontal class="size-4" />

              Переместить
            </div>
          </button>
          <button
            class="w-full flex items-center gap-x-2 py-2 px-3 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-100 focus:outline-hidden focus:bg-gray-100 disabled:opacity-70 disabled:pointer-events-none"
            v-if="options.favorite"
            :disabled="toValue(status.isBusy)"
            @click="$emit('favorite')"
          >
            <div
              class="absolute size-full flex items-center gap-x-2"
              v-if="toValue(status.isFavoritePending)"
            >
              <Spinner class="size-4" />

              <span v-if="!isItemFavorite">Добавление...</span>
              <span v-if="isItemFavorite">Удаление...</span>
            </div>
            <div
              class="flex items-center text-left gap-x-2 group-disabled:opacity-70"
              :class="{ 'opacity-0!': toValue(status.isFavoritePending) }"
            >
              <Star class="size-4" v-if="!isItemFavorite" />
              <StarOff class="size-4" v-if="isItemFavorite" />

              <span v-if="!isItemFavorite">В избранное</span>
              <span v-if="isItemFavorite">Удалить из избранного</span>
            </div>
          </button>
          <button
            class="w-full flex items-center py-2 px-3 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-100 focus:outline-hidden focus:bg-gray-100 group disabled:pointer-events-none"
            v-if="options.archive"
            :disabled="toValue(status.isBusy)"
            @click="handleArchive"
          >
            <div
              class="absolute size-full flex items-center gap-x-2"
              v-if="toValue(status.isArchiving)"
            >
              <Spinner class="size-4" />

              Архивирование...
            </div>
            <div
              class="flex items-center text-left gap-x-2 group-disabled:opacity-70"
              :class="{ 'opacity-0!': toValue(status.isArchiving) }"
            >
              <Archive class="size-4" />

              В архив
            </div>
          </button>
          <button
            class="w-full flex items-center py-2 px-3 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-100 focus:outline-hidden focus:bg-gray-100 group disabled:pointer-events-none"
            v-if="options.delete"
            :disabled="toValue(status.isBusy)"
            @click="handleDelete()"
          >
            <div
              class="absolute size-full flex items-center gap-x-2"
              v-if="toValue(status.isDeleting)"
            >
              <Spinner class="size-4" />

              Удаление...
            </div>
            <div
              class="flex items-center text-left gap-x-2 group-disabled:opacity-70"
              :class="{ 'opacity-0!': toValue(status.isDeleting) }"
            >
              <Trash class="size-4" />

              Удалить
            </div>
          </button>
        </div>

        <!-- СЛОТ ДЛЯ РЕДАКТИРОВАНИЯ -->
        <div v-if="showEdit">
          <slot
            name="edit-content"
            :close="() => (showEdit = false)"
            :closeDropdown="closeDropdown"
          />
        </div>

        <!-- ФОРМА ПЕРЕНОСА (теперь она может быть просто слотом или вызываться родителем) -->
        <div v-if="showTransfer">
          <slot name="transfer-content" :close="() => (showTransfer = false)" />
        </div>
      </div>
    </div>
  </div>
</template>
