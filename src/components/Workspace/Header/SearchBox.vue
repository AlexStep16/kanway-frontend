<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useUIStore } from '@stores/ui'
import Tabs from '@/enums/TabsEnum'
import { Nullable } from '@/types/utils'
import { useBoardStore } from '@/stores/board'
import { X } from 'lucide-vue-next'
import { useBoardSearch } from '@/composables/useBoardSearch'
import { storeToRefs } from 'pinia'
import { onClickOutside } from '@vueuse/core'

defineProps<{
  isAlwaysVisible?: boolean
}>()

const emit = defineEmits<{
  (e: 'input', value: string): void
}>()

const uiStore = useUIStore()
const boardStore = useBoardStore()

const { activeBoardId } = storeToRefs(boardStore)

const searchBoxRef = ref<Nullable<HTMLElement>>(null)
const searchInputRef = ref<Nullable<HTMLInputElement>>(null)
const searchModel = ref('')
const preventAutofill = ref(true)
const isDropdownHidden = ref(true)

const { tasks, categories, isEmpty } = useBoardSearch(searchModel, activeBoardId)

watch(searchModel, (newVal) => {
  isDropdownHidden.value = newVal.length === 0
  emit('input', newVal)
})

const searchPlaceholder = computed(() => {
  if (uiStore.currentTab === Tabs.Archive) return 'Поиск в архиве...'
  if (uiStore.currentTab === Tabs.Board) return 'Поиск на доске...'
  return 'Поиск...'
})

function clearSearch() {
  searchModel.value = ''
  searchInputRef.value?.focus()
}

onClickOutside(searchBoxRef, () => {
  isDropdownHidden.value = true
})

onMounted(() => {
  setTimeout(() => {
    preventAutofill.value = false
  }, 10)
})
</script>

<template>
  <!-- SearchBox -->
  <div class="relative" ref="searchBoxRef">
    <div :class="{ 'pb-2 border-b border-gray-200': isAlwaysVisible }">
      <div class="relative">
        <div class="absolute inset-y-0 start-0 flex items-center pointer-events-none z-20 ps-3.5">
          <svg
            class="shrink-0 size-4 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.3-4.3"></path>
          </svg>
        </div>
        <input
          class="py-1.5 h-9 ps-10 pe-8.5 block outline-0 border border-gray-200 bg-gray-100 hover:bg-gray-200 transition-colors duration-100 focus:bg-gray-100 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none"
          :class="{ 'w-full': isAlwaysVisible, 'w-70': !isAlwaysVisible }"
          type="text"
          name="header-search-input"
          autocomplete="off"
          role="combobox"
          aria-expanded="false"
          :placeholder="searchPlaceholder"
          v-model="searchModel"
          :disabled="preventAutofill"
          ref="searchInputRef"
        />
        <button
          class="absolute inset-y-0 end-0 pe-2.5 flex items-center group"
          @click="clearSearch"
          v-if="searchModel.length > 0"
        >
          <X class="size-4 text-gray-400 group-hover:text-gray-600" />
        </button>
      </div>
    </div>

    <!-- SearchBox Dropdown -->
    <div
      class="z-50 bg-white rounded-xl"
      :class="{
        'absolute w-70 shadow-xl': !isAlwaysVisible,
        'static w-full mt-2!': isAlwaysVisible,
        hidden: isDropdownHidden,
      }"
      ref="searchDropdownRef"
    >
      <div
        class="[&::-webkit-scrollbar]:w-2 overflow-y-auto [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300"
        :class="{
          'p-2 max-h-125': !isAlwaysVisible,
          'max-h-80': isAlwaysVisible,
        }"
      >
        <div
          class="py-2 text-sm text-gray-800 rounded-lg"
          :class="{
            'px-2.5': isAlwaysVisible,
            'px-4': !isAlwaysVisible,
          }"
          v-if="isEmpty"
        >
          Ничего не найдено...
        </div>
        <div tabindex="1" v-if="tasks.length > 0">
          <div class="block text-xs text-gray-500 px-2.5 pt-2 mb-1">Задачи</div>
          <button
            v-for="task in tasks"
            :key="task.id + '-search'"
            class="py-2 px-2.5 w-full flex items-center gap-x-3 hover:bg-gray-100 transition-colors duration-100 rounded-lg focus:outline-hidden focus:bg-gray-100"
            type="button"
            @click="uiStore.openTaskToEdit(task)"
          >
            <span class="text-sm text-gray-800 truncate" :title="task.name">{{ task.name }}</span>
            <span class="ms-auto text-xs text-gray-400">{{ task.category.name }}</span>
          </button>
        </div>

        <div tabindex="2" v-if="categories.length > 0">
          <div class="block text-xs text-gray-500 px-2.5 pt-2 mb-1">Категории</div>
          <button
            v-for="category in categories"
            :key="category.id + '-search'"
            class="py-2 px-2.5 w-full flex items-center gap-x-3 hover:bg-gray-100 transition-colors duration-100 rounded-lg focus:outline-hidden focus:bg-gray-100"
            type="button"
            @click="uiStore.openCategoryToEdit(category)"
          >
            <span class="text-sm text-gray-800 truncate" :title="category.name">{{
              category.name
            }}</span>
            <span class="ms-auto text-xs text-gray-400">{{ category.board?.name }}</span>
          </button>
        </div>
      </div>
    </div>
    <!-- End SearchBox Dropdown -->
  </div>
  <!-- End SearchBox -->
</template>
