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
import { HSDropdown } from 'preline'
import { computed, onMounted, ref, toRefs } from 'vue'
import WorkspaceModel from '@models/WorkspaceModel'
import BoardModel from '@models/BoardModel'
import CategoryModel from '@models/CategoryModel'
import Spinner from '@components/Loader/Spinner.vue'
import { useGetters } from '@helpers/Options/useGetters'
import { useActions } from '@helpers/Options/useActions'
import TransferForm from './TransferForm.vue'
import { Nullable } from '@/types/utils'
import { useWorkspaceDataStore } from '@stores/workspaceData'
import { useBoardDataStore } from '@stores/boardData'
import ChatModel from '@/models/ChatModel'

const props = defineProps<{
  options: {
    edit: boolean
    copy: boolean
    move: boolean
    favorite: boolean
    archive: boolean
  }
  item: WorkspaceModel | BoardModel | CategoryModel | ChatModel
  group_name: string
  edit_type: 'board' | 'workspace' | 'chat' | 'category'
  resetForm?: () => void
  hover_class?: string
  is_always_visible?: boolean
}>()

const WORKSPACE_STORE = useWorkspaceDataStore()
const BOARD_STORE = useBoardDataStore()

const { item, edit_type } = toRefs(props)

const {
  getWorkspaceItem,
  getBoardItem,
  isItemArchiving,
  isItemMoving,
  isItemCopying,
  isItemAddingToFavorites,
  isProcessing,
} = useGetters(item, edit_type)

const { archiveItem, moveItem, cloneItem, makeFavorite } = useActions(
  item,
  edit_type,
  closeDropdown,
)

const dropdown = ref<Nullable<HTMLElement>>(null)
const dropdownMenu = ref<Nullable<HTMLElement>>(null)
const dropdownInstance = ref<Nullable<HSDropdown>>(null)
const showEdit = ref(false)
const showTransfer = ref(false)
const hoverClass = computed(() => {
  if (props.hover_class) {
    return props.hover_class
  }

  return 'hover:bg-gray-200'
})
const visibilityClasses = computed(() => {
  if (props.is_always_visible) {
    return 'opacity-100'
  }
  return `group-hover/${props.group_name}:opacity-100 opacity-100 pointer-fine:opacity-0`
})

function closeEdit() {
  showEdit.value = false

  props.resetForm?.()
}

function closeDropdown() {
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

const getOtherItems = computed(() => {
  if (edit_type.value === 'board') {
    return WORKSPACE_STORE.getOtherWorkspaces((item.value as BoardModel).workspaceId)
  }

  if (edit_type.value === 'category') {
    return BOARD_STORE.getOtherBoards((item.value as CategoryModel).boardId)
  }

  return []
})

onMounted(() => {
  if (window.HSStaticMethods) window.HSStaticMethods.autoInit()

  if (dropdown.value && dropdown.value instanceof HTMLElement) {
    dropdownInstance.value = HSDropdown.getInstance(dropdown.value) as Nullable<HSDropdown>

    if (dropdownInstance.value) {
      dropdownInstance.value.on('close', () => {
        props.resetForm?.()
      })

      document.addEventListener('click', (e: any) => {
        if (
          dropdownInstance.value &&
          dropdownMenu.value &&
          !dropdownMenu.value.contains(e.target)
        ) {
          if (dropdownInstance.value) {
            dropdownInstance.value.close()

            setTimeout(() => {
              showEdit.value = false
              showTransfer.value = false
            }, 200)
          }
        }
      })
    }
  }
})
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
            :disabled="isProcessing"
          >
            <Pen class="size-4" />

            Редактировать
          </button>
          <button
            class="w-full flex items-center gap-x-2 py-2 px-3 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-100 focus:outline-hidden focus:bg-gray-100 group disabled:pointer-events-none"
            v-if="options.copy"
            :disabled="isProcessing"
            @click="cloneItem"
          >
            <div class="absolute size-full flex items-center gap-x-2" v-if="isItemCopying">
              <Spinner class="size-4" />

              Копирование...
            </div>
            <div
              class="flex items-center text-left gap-x-2 group-disabled:opacity-70"
              :class="{ 'opacity-0!': isItemCopying }"
            >
              <Copy class="size-4" />

              Копировать
            </div>
          </button>
          <button
            class="w-full flex items-center gap-x-2 py-2 px-3 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-100 focus:outline-hidden focus:bg-gray-100 disabled:opacity-70 disabled:pointer-events-none"
            @click="showTransfer = true"
            v-if="options.move"
            :disabled="isProcessing"
          >
            <div class="absolute size-full flex items-center gap-x-2" v-if="isItemMoving">
              <Spinner class="size-4" />

              Перемещение...
            </div>
            <div
              class="flex items-center text-left gap-x-2 group-disabled:opacity-70"
              :class="{ 'opacity-0!': isItemMoving }"
            >
              <MoveHorizontal class="size-4" />

              Переместить
            </div>
          </button>
          <button
            class="w-full flex items-center gap-x-2 py-2 px-3 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-100 focus:outline-hidden focus:bg-gray-100 disabled:opacity-70 disabled:pointer-events-none"
            v-if="options.favorite"
            :disabled="isProcessing"
            @click="makeFavorite"
          >
            <div
              class="absolute size-full flex items-center gap-x-2"
              v-if="isItemAddingToFavorites"
            >
              <Spinner class="size-4" />

              <span v-if="!isItemFavorite">Добавление...</span>
              <span v-if="isItemFavorite">Удаление...</span>
            </div>
            <div
              class="flex items-center text-left gap-x-2 group-disabled:opacity-70"
              :class="{ 'opacity-0!': isItemAddingToFavorites }"
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
            :disabled="isProcessing"
            @click="archiveItem"
          >
            <div class="absolute size-full flex items-center gap-x-2" v-if="isItemArchiving">
              <Spinner class="size-4" />

              Архивирование...
            </div>
            <div
              class="flex items-center text-left gap-x-2 group-disabled:opacity-70"
              :class="{ 'opacity-0!': isItemArchiving }"
            >
              <Archive class="size-4" />

              В архив
            </div>
          </button>
        </div>

        <div v-show="showEdit">
          <slot
            name="edit-content"
            :closeEdit="closeEdit"
            :closeDropdown="closeDropdown"
            :getWorkspaceItem="getWorkspaceItem"
            :getBoardItem="getBoardItem"
          />
        </div>

        <TransferForm
          v-show="showTransfer"
          :otherItems="getOtherItems"
          :isProcessing="isProcessing"
          :isItemMoving="isItemMoving"
          :noItemsText="'Нет других ' + (edit_type === 'board' ? 'пространств' : 'досок')"
          @closeTransfer="showTransfer = false"
          @moveItem="
            (event) => {
              showTransfer = false
              moveItem(event)
            }
          "
        />
      </div>
    </div>
  </div>
</template>
