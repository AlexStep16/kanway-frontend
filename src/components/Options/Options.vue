<script setup lang="ts">
import {
  EllipsisVertical,
  MoveHorizontal,
  Copy,
  Star,
  StarOff,
  Archive,
  Pen,
} from 'lucide-vue-next'
import { ref, computed, onMounted, MaybeRef, MaybeRefOrGetter } from 'vue'
import Spinner from '@components/Loader/Spinner.vue'
import { HSDropdown } from 'preline'
import { onClickOutside } from '@vueuse/core'

export interface ItemStatus {
  isArchiving: MaybeRefOrGetter
  isMoving: MaybeRefOrGetter
  isCloning: MaybeRefOrGetter
  isFavoriteLoading?: MaybeRefOrGetter
  isUpdating: MaybeRefOrGetter
  isBusy: MaybeRefOrGetter
}

const props = defineProps<{
  item: { id: string; name: string; isFavorite?: boolean }
  options: { edit?: boolean; copy?: boolean; move?: boolean; favorite?: boolean; archive?: boolean }
  status: (id: MaybeRef<string | null>) => ItemStatus
  groupName: string
  hoverClass?: string
  isAlwaysVisible?: boolean
  resetForm?: () => void
}>()

const emit = defineEmits<{
  (e: 'edit'): void
  (e: 'copy'): void
  (e: 'move'): void
  (e: 'favorite'): void
  (e: 'archive'): void
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
  if ('isFavorite' in props.item) {
    return props.item.isFavorite
  }
  return false
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
  if (window.HSStaticMethods) window.HSStaticMethods.autoInit()

  if (dropdown.value) {
    dropdownInstance.value = HSDropdown.getInstance(dropdown.value, true) as HSDropdown

    if (dropdownInstance.value) {
      dropdownInstance.value.on('close', () => {
        setTimeout(resetInternalState, 200)
      })
    }
  }
})

const getStatusObject = computed(() => {
  return props.status(props.item.id)
})

defineExpose({ closeDropdown })

const visibilityClasses = computed(() =>
  props.isAlwaysVisible
    ? 'opacity-100'
    : `group-hover/${props.groupName}:opacity-100 opacity-100 pointer-fine:opacity-0`,
)
</script>

<template>
  <div :id="'dropdown-' + item.id" class="hs-dropdown inline-flex" ref="dropdown">
    <button
      type="button"
      class="p-1 transition-colors rounded-full hs-dropdown-open:bg-blue-200"
      :class="[hoverClass || 'hover:bg-gray-200', visibilityClasses]"
    >
      <EllipsisVertical class="size-4" />
    </button>

    <div class="hs-dropdown-menu hidden min-w-60 bg-white shadow-md rounded-lg p-1">
      <!-- ГЛАВНОЕ МЕНЮ -->
      <div v-show="!showEdit && !showTransfer" class="space-y-0.5">
        <!-- Кнопка Редактировать -->
        <button
          v-if="options.edit"
          @click="showEdit = true"
          :disabled="getStatusObject.isBusy"
          class="w-full flex items-center gap-x-2 py-2 px-3 rounded-lg text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50"
        >
          <Pen class="size-4" /> Редактировать
        </button>

        <!-- Кнопка Копировать -->
        <button
          v-if="options.copy"
          @click="emit('copy')"
          :disabled="getStatusObject.isBusy"
          class="relative w-full flex items-center gap-x-2 py-2 px-3 rounded-lg text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50"
        >
          <div
            v-if="getStatusObject.isCloning"
            class="absolute inset-0 flex items-center gap-2 bg-white"
          >
            <Spinner class="size-4" /> Копирование...
          </div>
          <Copy class="size-4" /> Копировать
        </button>

        <!-- Кнопка Переместить -->
        <button
          v-if="options.move"
          @click="showTransfer = true"
          :disabled="getStatusObject.isBusy"
          class="relative w-full flex items-center gap-x-2 py-2 px-3 rounded-lg text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50"
        >
          <div
            v-if="getStatusObject.isMoving"
            class="absolute inset-0 flex items-center gap-2 bg-white"
          >
            <Spinner class="size-4" /> Перемещение...
          </div>
          <MoveHorizontal class="size-4" /> Переместить
        </button>

        <button
          class="w-full flex items-center gap-x-2 py-2 px-3 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-100 focus:outline-hidden focus:bg-gray-100 disabled:opacity-70 disabled:pointer-events-none"
          v-if="options.favorite"
          :disabled="getStatusObject.isBusy"
          @click="emit('favorite')"
        >
          <div
            class="absolute size-full flex items-center gap-x-2"
            v-if="getStatusObject.isFavoriteLoading"
          >
            <Spinner class="size-4" />

            <span v-if="!isItemFavorite">Добавление...</span>
            <span v-if="isItemFavorite">Удаление...</span>
          </div>
          <div
            class="flex items-center text-left gap-x-2 group-disabled:opacity-70"
            :class="{ 'opacity-0!': getStatusObject.isFavoriteLoading }"
          >
            <Star class="size-4" v-if="!isItemFavorite" />
            <StarOff class="size-4" v-if="isItemFavorite" />

            <span v-if="!isItemFavorite">В избранное</span>
            <span v-if="isItemFavorite">Удалить из избранного</span>
          </div>
        </button>

        <!-- Кнопка В архив -->
        <button
          v-if="options.archive"
          @click="emit('archive')"
          :disabled="getStatusObject.isBusy"
          class="relative w-full flex items-center gap-x-2 py-2 px-3 rounded-lg text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50"
        >
          <div
            v-if="getStatusObject.isArchiving"
            class="absolute inset-0 flex items-center gap-2 bg-white"
          >
            <Spinner class="size-4" /> Архивирование...
          </div>
          <Archive class="size-4" /> В архив
        </button>
      </div>

      <!-- СЛОТ ДЛЯ РЕДАКТИРОВАНИЯ -->
      <div v-if="showEdit">
        <slot name="edit-content" :close="() => (showEdit = false)" />
      </div>

      <!-- ФОРМА ПЕРЕНОСА (теперь она может быть просто слотом или вызываться родителем) -->
      <div v-if="showTransfer">
        <slot name="transfer-content" :close="() => (showTransfer = false)" />
      </div>
    </div>
  </div>
</template>
