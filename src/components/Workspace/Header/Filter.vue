<script setup lang="ts">
import { useTaskTags } from '@/composables/tasks/useTaskTags'
import { useBoardStore } from '@/stores/board'
import { useTaskFilterStore } from '@/stores/taskFilters'
import { ListFilter } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'
import { computed, onMounted, toRef } from 'vue'

const taskFiltersStore = useTaskFilterStore()
const boardStore = useBoardStore()

const filters = toRef(taskFiltersStore.filters)
const isFilterActive = computed(() => {
  return taskFiltersStore.isFilterActive
})

const boardId = storeToRefs(boardStore).activeBoardId

const { tags } = useTaskTags(boardId)

onMounted(() => {
  if (window.HSStaticMethods) window.HSStaticMethods.autoInit()
})
</script>

<template>
  <div class="hs-dropdown [--auto-close:inside] relative inline-flex">
    <button
      id="hs-dropdown-filter"
      type="button"
      class="hs-dropdown-toggle text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-200 p-1 focus:bg-blue-100 sm:focus:bg-white sm:hover:bg-white sm:hover:text-blue-500 sm:hover:border-blue-500 focus:border-blue-500 focus:text-blue-500 sm:text-gray-700 inline-flex items-center font-medium justify-center sm:gap-x-2 sm:px-3 rounded-md sm:border sm:border-gray-200 transition-colors duration-100"
      :class="{
        'bg-white! text-blue-500! border-blue-500!': isFilterActive,
      }"
    >
      <ListFilter class="size-5 sm:size-4" />
      <span class="hidden sm:inline">Фильтр</span>
    </button>

    <div
      class="hs-dropdown-menu transition-[opacity,margin] duration z-50 hs-dropdown-open:opacity-100 opacity-0 hidden min-w-60 max-h-120 overflow-y-auto bg-white shadow-md rounded-lg mt-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300"
      role="menu"
      aria-orientation="vertical"
    >
      <div class="max-w-70 p-1 flex flex-col">
        <div class="block text-xs text-gray-500 px-2.5 pt-2 mb-1">Статус</div>
        <ul class="flex flex-col">
          <li class="inline-flex items-center gap-x-2 text-sm font-medium bg-white text-gray-800">
            <label
              class="relative flex cursor-pointer items-start w-full py-2 px-2.5 hover:bg-gray-100 rounded-md transition-colors duration-100 select-none"
            >
              <div class="flex items-center h-5">
                <input
                  id="hs-list-group-item-checkbox-1"
                  name="hs-list-group-item-checkbox-1"
                  type="checkbox"
                  class="border-gray-200 rounded-sm disabled:opacity-50"
                  v-model="filters.isCompleted"
                />
              </div>
              <span class="ms-2 block w-full text-sm text-gray-600"> Выполнено </span>
            </label>
          </li>
          <li class="inline-flex items-center gap-x-2 text-sm font-medium bg-white text-gray-800">
            <label
              class="relative flex cursor-pointer items-start w-full py-2 px-2.5 hover:bg-gray-100 rounded-md transition-colors duration-100 select-none"
            >
              <div class="flex items-center h-5">
                <input
                  id="hs-list-group-item-checkbox-2"
                  name="hs-list-group-item-checkbox-2"
                  type="checkbox"
                  class="border-gray-200 rounded-sm disabled:opacity-50"
                  v-model="filters.isInProgress"
                />
              </div>
              <span class="ms-2 block w-full text-sm text-gray-600"> Выполняется </span>
            </label>
          </li>
        </ul>

        <div class="block text-xs text-gray-500 px-2.5 pt-2 mb-1">Срок</div>
        <ul class="flex flex-col">
          <li class="inline-flex items-center gap-x-2 text-sm font-medium bg-white text-gray-800">
            <label
              class="relative flex cursor-pointer items-start w-full py-2 px-2.5 hover:bg-gray-100 rounded-md transition-colors duration-100 select-none"
            >
              <div class="flex items-center h-5">
                <input
                  id="hs-list-group-item-checkbox-3"
                  name="hs-list-group-item-checkbox-3"
                  type="checkbox"
                  class="border-gray-200 rounded-sm disabled:opacity-50"
                  v-model="filters.isExpired"
                />
              </div>
              <span class="ms-2 block w-full text-sm text-gray-600"> Просрочено </span>
            </label>
          </li>
          <li class="inline-flex items-center gap-x-2 text-sm font-medium bg-white text-gray-800">
            <label
              class="relative flex cursor-pointer items-start w-full py-2 px-2.5 hover:bg-gray-100 rounded-md transition-colors duration-100 select-none"
            >
              <div class="flex items-center h-5">
                <input
                  id="hs-list-group-item-checkbox-4"
                  name="hs-list-group-item-checkbox-4"
                  type="checkbox"
                  class="border-gray-200 rounded-sm disabled:opacity-50"
                  v-model="filters.isDueToday"
                />
              </div>
              <span class="ms-2 block w-full text-sm text-gray-600"> Истекает сегодня </span>
            </label>
          </li>
          <li class="inline-flex items-center gap-x-2 text-sm font-medium bg-white text-gray-800">
            <label
              class="relative flex cursor-pointer items-start w-full py-2 px-2.5 hover:bg-gray-100 rounded-md transition-colors duration-100 select-none"
            >
              <div class="flex items-center h-5">
                <input
                  id="hs-list-group-item-checkbox-5"
                  name="hs-list-group-item-checkbox-5"
                  type="checkbox"
                  class="border-gray-200 rounded-sm disabled:opacity-50"
                  v-model="filters.isDueTomorrow"
                />
              </div>
              <span class="ms-2 block w-full text-sm text-gray-600"> Истекает завтра </span>
            </label>
          </li>
          <li class="inline-flex items-center gap-x-2 text-sm font-medium bg-white text-gray-800">
            <label
              class="relative flex cursor-pointer items-start w-full py-2 px-2.5 hover:bg-gray-100 rounded-md transition-colors duration-100 select-none"
            >
              <div class="flex items-center h-5">
                <input
                  id="hs-list-group-item-checkbox-6"
                  name="hs-list-group-item-checkbox-6"
                  type="checkbox"
                  class="border-gray-200 rounded-sm disabled:opacity-50"
                  v-model="filters.isDueThisWeek"
                />
              </div>
              <span class="ms-2 block w-full text-sm text-gray-600">
                Истекает в течение недели
              </span>
            </label>
          </li>
        </ul>

        <div class="block text-xs text-gray-500 px-2.5 pt-2 mb-1">Теги</div>
        <ul class="flex gap-x-1 px-1 flex-wrap" v-if="filters.tags.length > 0">
          <li
            class="inline-flex items-center gap-x-2 text-sm font-medium bg-white text-gray-800"
            v-for="tag in tags"
            :key="tag"
          >
            <label
              class="relative flex cursor-pointer items-center w-full py-1 px-1.5 hover:bg-gray-100 rounded-md transition-colors duration-100 select-none"
            >
              <div class="flex items-center h-5">
                <input
                  id="hs-list-group-item-checkbox-1"
                  name="hs-list-group-item-checkbox-1"
                  type="checkbox"
                  class="border-gray-200 rounded-sm disabled:opacity-50"
                  v-model="filters.tags"
                  :value="tag"
                />
              </div>
              <span class="truncate ms-2 block w-full text-xs text-gray-600"> #{{ tag }} </span>
            </label>
          </li>
        </ul>
        <div v-else class="text-gray-300 text-xs px-2.5 text-center">Пусто</div>

        <button
          class="inline-flex self-start mb-2 mt-3 text-custom-sm text-gray-400 hover:text-gray-600 transition-colors duration-100 focus:outline-hidden text-left px-2.5"
          @click="taskFiltersStore.clearFilters"
        >
          Сбросить всё
        </button>
      </div>
    </div>
  </div>
</template>
