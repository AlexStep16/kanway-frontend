<script setup lang="ts">
import {
  EllipsisVertical,
  MoveHorizontal,
  Copy,
  Star,
  Trash,
  Pen,
  ChevronLeft,
} from 'lucide-vue-next'
import { HSDropdown } from 'preline'
import { computed, onMounted, ref } from 'vue'
import CreateBody from './Dropdowns/Create/CreateBody.vue'

const props = defineProps<{
  options: {
    edit: boolean
    copy: boolean
    move: boolean
    favorite: boolean
    archive: boolean
  }
  item: {
    id: number
    name: string
  }
  group_name: string
  edit_type?: 'board' | 'workspace' | 'chat'
  hover_class?: string
  is_always_visible?: boolean
}>()

const dropdown = ref<HTMLElement | null>(null)
const dropdownMenu = ref<HTMLElement | null>(null)
const dropdownInstance = ref<HSDropdown | null>(null)
const showEdit = ref(false)
const hoverClass = computed(() => {
  // Если props.hover_class существует и не пуст, используем его
  if (props.hover_class) {
    return props.hover_class
  }
  // Иначе, возвращаем класс по умолчанию
  return 'hover:bg-gray-200'
})
const visibilityClasses = computed(() => {
  if (props.is_always_visible) {
    return 'opacity-100'
  }
  return `group-hover/${props.group_name}:opacity-100 opacity-0`
})

onMounted(() => {
  if (window.HSStaticMethods) window.HSStaticMethods.autoInit()

  if (dropdown.value && dropdown.value instanceof HTMLElement) {
    dropdownInstance.value = HSDropdown.getInstance(dropdown.value) as HSDropdown | null

    if (dropdownInstance.value) {
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
      class="hs-dropdown-menu transition-[opacity,margin] z-10 duration hs-dropdown-open:opacity-100 opacity-0 hidden min-w-50 bg-white shadow-md rounded-lg mt-2 after:h-4 after:absolute after:-bottom-4 after:start-0 after:w-full before:h-4 before:absolute before:-top-4 before:start-0 before:w-full"
      role="menu"
      ref="dropdownMenu"
      aria-orientation="vertical"
      :aria-labelledby="'hs-dropdown-button-' + item.id"
    >
      <div class="flex overflow-hidden">
        <div class="p-1 space-y-0.5 shrink-0 w-full" v-show="!showEdit">
          <button
            class="w-full flex items-center gap-x-2 py-2 px-3 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-100 focus:outline-hidden focus:bg-gray-100 dark:text-neutral-400"
            @click="showEdit = true"
            v-if="options.edit"
          >
            <Pen class="size-4" />

            Редактировать
          </button>
          <button
            class="w-full flex items-center gap-x-2 py-2 px-3 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-100 focus:outline-hidden focus:bg-gray-100 dark:text-neutral-400"
            v-if="options.copy"
          >
            <Copy class="size-4" />

            Копировать
          </button>
          <button
            class="w-full flex items-center gap-x-2 py-2 px-3 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-100 focus:outline-hidden focus:bg-gray-100 dark:text-neutral-400"
            v-if="options.move"
          >
            <MoveHorizontal class="size-4" />

            Переместить
          </button>
          <button
            class="w-full flex items-center gap-x-2 py-2 px-3 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-100 focus:outline-hidden focus:bg-gray-100 dark:text-neutral-400"
            v-if="options.favorite"
          >
            <Star class="size-4" />

            В избранное
          </button>
          <button
            class="w-full flex items-center gap-x-2 py-2 px-3 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-100 focus:outline-hidden focus:bg-gray-100 dark:text-neutral-400"
            v-if="options.archive"
          >
            <Trash class="size-4" />

            В архив
          </button>
        </div>

        <div class="flex flex-col shrink-0 w-full min-w-75 p-1" v-show="showEdit" v-if="edit_type">
          <div class="flex items-center justify-center relative py-2 text-gray-700 p-2">
            <button
              type="button"
              class="flex items-center absolute left-0 gap-x-1 p-1 hover:bg-gray-200 transition-colors duration-100 rounded-md"
              @click="showEdit = false"
            >
              <ChevronLeft class="size-5" />
            </button>

            <span class="text-custom-sm font-bold"
              >Редактирование {{ edit_type === 'board' ? 'доски' : 'пространства' }}</span
            >
          </div>

          <CreateBody :id="'hs-sidebar-' + edit_type + '-edit-' + item.id" />
        </div>
      </div>
    </div>
  </div>
</template>
