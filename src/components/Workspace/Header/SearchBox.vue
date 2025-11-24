<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useUIStore } from '@stores/ui'
import { useTaskDataStore } from '@stores/taskData'
import { useCategoryDataStore } from '@stores/categoryData'
import Tabs from '@/enums/TabsEnum'
import { Nullable } from '@/types/utils'
import { ITaskState } from '@stores/interfaces/ITaskState'
import { useBoardDataStore } from '@stores/boardData'
import { useWorkspaceDataStore } from '@stores/workspaceData'

defineProps<{
  isAlwaysVisible?: boolean
}>()

const emit = defineEmits<{
  (e: 'input', value: string): void
}>()

const UI_STORE = useUIStore()
const TASK_STORE = useTaskDataStore()
const CATEGORY_STORE = useCategoryDataStore()
const BOARD_STORE = useBoardDataStore()
const WORKSPACE_STORE = useWorkspaceDataStore()

const searchBoxRef = ref<Nullable<HTMLElement>>(null)
const searchDropdownRef = ref<Nullable<HTMLElement>>(null)
const searchModel = ref('')
const preventAutofill = ref(true)
const isDropdownHidden = ref(true)

watch(searchModel, (newVal) => {
  if (newVal.length === 0) {
    isDropdownHidden.value = true
  } else {
    isDropdownHidden.value = false
  }

  emit('input', newVal)
})

function getPlaceholder() {
  if (UI_STORE.currentTab === Tabs.Archive) {
    return 'Поиск в архиве...'
  } else if (UI_STORE.currentTab === Tabs.Board) {
    return 'Поиск на доске...'
  } else {
    return 'Поиск...'
  }
}

function editTask(task: ITaskState) {
  TASK_STORE.taskToEdit = task

  UI_STORE.openEditTaskModal()
}

const boardTasksByName = computed(() => {
  return TASK_STORE.getActiveBoardTasksByName(searchModel.value)
})

const archivedTasksByName = computed(() => {
  return TASK_STORE.getArchivedTasksByName(searchModel.value)
})

const archivedBoardsByName = computed(() => {
  return BOARD_STORE.getArchivedBoardsByName(searchModel.value)
})

const archivedWorkspacesByName = computed(() => {
  return WORKSPACE_STORE.getArchivedWorkspacesByName(searchModel.value)
})

const getTasks = computed(() => {
  return UI_STORE.currentTab === Tabs.Board ? boardTasksByName.value : archivedTasksByName.value
})

const boardCategoriesByName = computed(() => {
  return CATEGORY_STORE.getActiveBoardCategoriesByName(searchModel.value)
})

const archivedCategoriesByName = computed(() => {
  return CATEGORY_STORE.getArchivedCategoriesByName(searchModel.value)
})

const getCategories = computed(() => {
  return UI_STORE.currentTab === Tabs.Board
    ? boardCategoriesByName.value
    : archivedCategoriesByName.value
})

const getBoards = computed(() => {
  return UI_STORE.currentTab === Tabs.Archive ? archivedBoardsByName.value : []
})

const getWorkspaces = computed(() => {
  return UI_STORE.currentTab === Tabs.Archive ? archivedWorkspacesByName.value : []
})

onMounted(() => {
  setTimeout(() => {
    preventAutofill.value = false
  }, 10)

  document.addEventListener('click', (event) => {
    const isClickInside = searchBoxRef.value?.contains(event.target as Node)

    if (!isClickInside) {
      isDropdownHidden.value = true
      searchModel.value = ''
    }
  })
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
          class="py-1.5 ps-10 pe-4 block w-full outline-0 border border-gray-200 bg-gray-100 hover:bg-gray-200 transition-colors duration-100 focus:bg-gray-100 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none"
          type="text"
          name="header-search-input"
          autocomplete="off"
          role="combobox"
          aria-expanded="false"
          :placeholder="getPlaceholder()"
          v-model="searchModel"
          :disabled="preventAutofill"
        />
      </div>
    </div>

    <!-- SearchBox Dropdown -->
    <div
      class="z-50 bg-white rounded-xl"
      :class="{
        'absolute w-80 shadow-xl': !isAlwaysVisible,
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
          v-if="
            getTasks.length === 0 &&
            getCategories.length === 0 &&
            getBoards.length === 0 &&
            getWorkspaces.length === 0
          "
        >
          Ничего не найдено...
        </div>
        <div tabindex="1" v-if="getTasks.length > 0">
          <div class="block text-xs text-gray-500 px-2.5 pt-2 mb-1">Задачи</div>
          <button
            v-for="task in getTasks"
            :key="task.id + '-search'"
            class="py-2 px-2.5 w-full flex items-center gap-x-3 hover:bg-gray-100 transition-colors duration-100 rounded-lg focus:outline-hidden focus:bg-gray-100"
            type="button"
            @click="editTask(task)"
          >
            <span class="text-sm text-gray-800 truncate" :title="task.name">{{ task.name }}</span>
            <span class="ms-auto text-xs text-gray-400">{{ task.categoryName }}</span>
          </button>
        </div>

        <div tabindex="2" v-if="getCategories.length > 0">
          <div class="block text-xs text-gray-500 px-2.5 pt-2 mb-1">Категории</div>
          <button
            v-for="category in getCategories"
            :key="category.id + '-search'"
            class="py-2 px-2.5 w-full flex items-center gap-x-3 hover:bg-gray-100 transition-colors duration-100 rounded-lg focus:outline-hidden focus:bg-gray-100"
            type="button"
          >
            <span class="text-sm text-gray-800 truncate" :title="category.name">{{
              category.name
            }}</span>
          </button>
        </div>

        <div tabindex="3" v-if="getBoards.length > 0">
          <div class="block text-xs text-gray-500 px-2.5 pt-2 mb-1">Доски</div>
          <button
            v-for="board in getBoards"
            :key="board.id + '-search'"
            class="py-2 px-2.5 w-full flex items-center gap-x-3 hover:bg-gray-100 transition-colors duration-100 rounded-lg focus:outline-hidden focus:bg-gray-100"
            type="button"
          >
            <span class="text-sm text-gray-800 truncate" :title="board.name">{{ board.name }}</span>
          </button>
        </div>

        <div tabindex="4" v-if="getWorkspaces.length > 0">
          <div class="block text-xs text-gray-500 px-2.5 pt-2 mb-1">Пространства</div>
          <button
            v-for="workspace in getWorkspaces"
            :key="workspace.id + '-search'"
            class="py-2 px-2.5 w-full flex items-center gap-x-3 hover:bg-gray-100 transition-colors duration-100 rounded-lg focus:outline-hidden focus:bg-gray-100"
            type="button"
          >
            <span class="text-sm text-gray-800 truncate" :title="workspace.name">{{
              workspace.name
            }}</span>
          </button>
        </div>
      </div>
    </div>
    <!-- End SearchBox Dropdown -->
  </div>
  <!-- End SearchBox -->
</template>
