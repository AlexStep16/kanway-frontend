<script setup lang="ts">
import {
  EllipsisVertical,
  MoveHorizontal,
  Copy,
  Star,
  StarOff,
  Trash,
  Pen,
  ChevronLeft,
} from 'lucide-vue-next'
import { HSDropdown } from 'preline'
import { computed, onMounted, ref, toRefs } from 'vue'
import { Workspace } from '@interfaces/Workspace'
import { Board } from '@interfaces/Board'
import Spinner from '@components/Loader/Spinner.vue'
import { useGetters } from '@helpers/Options/useGetters'
import { useActions } from '@helpers/Options/useActions'

const props = defineProps<{
  options: {
    edit: boolean
    copy: boolean
    move: boolean
    favorite: boolean
    archive: boolean
  }
  item: Workspace | Board
  group_name: string
  edit_type: 'board' | 'workspace' | 'chat' | 'category'
  resetForm?: () => void
  hover_class?: string
  is_always_visible?: boolean
}>()

const { item, edit_type } = toRefs(props)

const {
  getWorkspaceItem,
  getBoardItem,
  isItemArchiving,
  isItemMoving,
  isItemCopying,
  isItemAddingToFavorites,
  isProcessing,
  getOtherWorkspaces,
} = useGetters(item, edit_type)

const { archiveItem, moveBoard, cloneItem, makeFavorite } = useActions(
  item,
  edit_type,
  closeDropdown,
)

const dropdown = ref<HTMLElement | null>(null)
const dropdownMenu = ref<HTMLElement | null>(null)
const dropdownInstance = ref<HSDropdown | null>(null)
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

onMounted(() => {
  if (window.HSStaticMethods) window.HSStaticMethods.autoInit()

  if (dropdown.value && dropdown.value instanceof HTMLElement) {
    dropdownInstance.value = HSDropdown.getInstance(dropdown.value) as HSDropdown | null

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
    :id="'hs-dropdown-' + item._id"
    class="hs-dropdown [--auto-close:false] inline-flex"
    ref="dropdown"
  >
    <button
      :id="'hs-dropdown-button-' + item._id"
      type="button"
      class="p-1 transition-colors duration-100 rounded-full focus:opacity-100 focus:outline-hidden hs-dropdown-open:opacity-100 hs-dropdown-open:bg-blue-200 hs-dropdown-open:text-blue-500"
      :class="[hoverClass, visibilityClasses]"
    >
      <EllipsisVertical class="size-4" />
    </button>

    <div
      class="hs-dropdown-menu transition-[opacity,margin] z-10 duration hs-dropdown-open:opacity-100 opacity-0 hidden min-w-50 bg-white shadow-md rounded-lg mt-2 after:h-4 after:absolute after:-bottom-4 after:start-0 after:w-full before:h-4 before:absolute before:-top-4 before:start-0 before:w-full"
      role="menu"
      ref="dropdownMenu"
      aria-orientation="vertical"
      :aria-labelledby="'hs-dropdown-button-' + item._id"
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
              class="flex items-center gap-x-2 group-disabled:opacity-70"
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
            <MoveHorizontal class="size-4" />

            Переместить
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

              <span v-if="!item.isFavorite">Добавление...</span>
              <span v-if="item.isFavorite">Удаление...</span>
            </div>
            <div
              class="flex items-center gap-x-2 group-disabled:opacity-70"
              :class="{ 'opacity-0!': isItemAddingToFavorites }"
            >
              <Star class="size-4" v-if="!item.isFavorite" />
              <StarOff class="size-4" v-if="item.isFavorite" />

              <span v-if="!item.isFavorite">В избранное</span>
              <span v-if="item.isFavorite">Удалить из избранного</span>
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
              class="flex items-center gap-x-2 group-disabled:opacity-70"
              :class="{ 'opacity-0!': isItemArchiving }"
            >
              <Trash class="size-4" />

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

        <div
          class="flex flex-col shrink-0 w-full p-1 min-w-60 max-w-70"
          v-show="showTransfer"
          v-if="['board'].includes(edit_type || '')"
        >
          <div class="flex items-center justify-center relative py-2 text-gray-700 p-2">
            <button
              type="button"
              class="flex items-center absolute left-0 gap-x-1 p-1 hover:bg-gray-200 transition-colors duration-100 rounded-md"
              @click="showTransfer = false"
            >
              <ChevronLeft class="size-5" />
            </button>

            <span class="text-custom-sm font-bold">Переместить в</span>
          </div>

          <div class="p-1 space-y-0.5 shrink-0 w-full">
            <button
              class="w-full flex items-center gap-x-2 py-2 px-3 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-100 focus:outline-hidden focus:bg-gray-100 group disabled:pointer-events-none"
              v-for="workspace in getOtherWorkspaces()"
              :key="workspace._id"
              :disabled="isProcessing"
              @click="moveBoard(workspace._id)"
            >
              <div class="absolute size-full flex items-center gap-x-2" v-if="isItemMoving">
                <Spinner class="size-4" />

                Перемещение...
              </div>
              <div
                class="flex items-center gap-x-2 group-disabled:opacity-70"
                :class="{ 'opacity-0!': isItemMoving }"
              >
                <Trash class="size-4" />

                {{ workspace.name }}
              </div>
            </button>

            <div
              class="text-gray-500 w-full text-center py-2 text-sm"
              v-if="getOtherWorkspaces().length === 0"
            >
              Нет других пространств
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
