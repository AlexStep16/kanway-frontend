<script setup lang="ts">
import { EllipsisVertical, MoveHorizontal, Copy, Star, Trash, Pen } from 'lucide-vue-next'
import { HSDropdown } from 'preline'
import { onMounted, ref } from 'vue'

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
  is_always_visible?: boolean
}>()

const emit = defineEmits<{
  (e: 'edit', item: { id: number; name: string }): void
}>()

const dropdown = ref<HTMLElement | null>(null)
const dropdownMenu = ref<HSDropdown | null>(null)

function edit() {
  if (dropdownMenu.value) dropdownMenu.value.close()

  emit('edit', props.item)
}

onMounted(() => {
  if (window.HSStaticMethods) window.HSStaticMethods.autoInit()

  if (dropdown.value && dropdown.value instanceof HTMLElement) {
    dropdownMenu.value = HSDropdown.getInstance(dropdown.value) as HSDropdown | null
  }
})
</script>

<template>
  <div
    :id="'hs-dropdown-' + item.id"
    class="hs-dropdown [--auto-close:inside] inline-flex"
    ref="dropdown"
  >
    <button
      :id="'hs-dropdown-button-' + item.id"
      type="button"
      class="p-1 transition-opacity duration-300 rounded-full focus:opacity-100 focus:outline-hidden hs-dropdown-open:opacity-100 hs-dropdown-open:bg-blue-200 hs-dropdown-open:text-blue-500"
      :class="{
        'hover:bg-blue-200': item.id === 1,
        'hover:bg-gray-200': item.id !== 1,
        'opacity-100': props.is_always_visible,
        [`group-hover/${props.group_name}:opacity-100 opacity-0`]: !props.is_always_visible,
      }"
    >
      <EllipsisVertical class="size-4" />
    </button>

    <div
      class="hs-dropdown-menu transition-[opacity,margin] z-10 duration hs-dropdown-open:opacity-100 opacity-0 hidden min-w-50 bg-white shadow-md rounded-lg mt-2 after:h-4 after:absolute after:-bottom-4 after:start-0 after:w-full before:h-4 before:absolute before:-top-4 before:start-0 before:w-full"
      role="menu"
      aria-orientation="vertical"
      :aria-labelledby="'hs-dropdown-button-' + item.id"
    >
      <div class="p-1 space-y-0.5">
        <button
          class="w-full flex items-center gap-x-2 py-2 px-3 rounded-lg text-sm text-gray-700 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:text-neutral-400"
          @click="edit"
          v-if="options.edit"
        >
          <Pen class="size-4" />

          Редактировать
        </button>
        <button
          class="w-full flex items-center gap-x-2 py-2 px-3 rounded-lg text-sm text-gray-700 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:text-neutral-400"
          v-if="options.copy"
        >
          <Copy class="size-4" />

          Копировать
        </button>
        <button
          class="w-full flex items-center gap-x-2 py-2 px-3 rounded-lg text-sm text-gray-700 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:text-neutral-400"
          v-if="options.move"
        >
          <MoveHorizontal class="size-4" />

          Переместить
        </button>
        <button
          class="w-full flex items-center gap-x-2 py-2 px-3 rounded-lg text-sm text-gray-700 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:text-neutral-400"
          v-if="options.favorite"
        >
          <Star class="size-4" />

          В избранное
        </button>
        <button
          class="w-full flex items-center gap-x-2 py-2 px-3 rounded-lg text-sm text-gray-700 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:text-neutral-400"
          v-if="options.archive"
        >
          <Trash class="size-4" />

          В корзину
        </button>
      </div>
    </div>
  </div>
</template>
