<script setup lang="ts">
import { ListFilter } from 'lucide-vue-next'
import { onMounted } from 'vue'

onMounted(() => {
  if (window.HSStaticMethods) window.HSStaticMethods.autoInit()
})
</script>

<template>
  <div class="hs-dropdown [--auto-close:true] relative inline-flex">
    <button
      id="hs-dropdown-filter"
      type="button"
      class="hs-dropdown-toggle text-sm text-gray-700 inline-flex items-center font-medium justify-center gap-x-2 px-3 rounded-md border border-gray-200"
    >
      <ListFilter class="size-4" />
      Фильтр
    </button>

    <div
      class="hs-dropdown-menu transition-[opacity,margin] duration hs-dropdown-open:opacity-100 opacity-0 hidden min-w-60 max-h-120 overflow-y-auto bg-white shadow-md rounded-lg mt-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300"
      role="menu"
      aria-orientation="vertical"
    >
      <div class="p-1 flex flex-col">
        <div class="block text-xs text-gray-500 px-2.5 pt-2 mb-1">Статус</div>
        <ul class="max-w-sm flex flex-col">
          <li class="inline-flex items-center gap-x-2 text-sm font-medium bg-white text-gray-800">
            <label
              class="relative flex cursor-pointer items-start w-full py-2 px-2.5 hover:bg-gray-100 rounded-md transition-colors duration-200"
            >
              <div class="flex items-center h-5">
                <input
                  id="hs-list-group-item-checkbox-1"
                  name="hs-list-group-item-checkbox-1"
                  type="checkbox"
                  class="border-gray-200 rounded-sm disabled:opacity-50"
                />
              </div>
              <span class="ms-2 block w-full text-sm text-gray-600"> Выполнено </span>
            </label>
          </li>
          <li class="inline-flex items-center gap-x-2 text-sm font-medium bg-white text-gray-800">
            <label
              class="relative flex cursor-pointer items-start w-full py-2 px-2.5 hover:bg-gray-100 rounded-md transition-colors duration-200"
            >
              <div class="flex items-center h-5">
                <input
                  id="hs-list-group-item-checkbox-2"
                  name="hs-list-group-item-checkbox-2"
                  type="checkbox"
                  class="border-gray-200 rounded-sm disabled:opacity-50"
                />
              </div>
              <span class="ms-2 block w-full text-sm text-gray-600"> Выполняется </span>
            </label>
          </li>
        </ul>

        <div class="block text-xs text-gray-500 px-2.5 pt-2 mb-1">Срок</div>
        <ul class="max-w-sm flex flex-col">
          <li class="inline-flex items-center gap-x-2 text-sm font-medium bg-white text-gray-800">
            <label
              class="relative flex cursor-pointer items-start w-full py-2 px-2.5 hover:bg-gray-100 rounded-md transition-colors duration-200"
            >
              <div class="flex items-center h-5">
                <input
                  id="hs-list-group-item-checkbox-3"
                  name="hs-list-group-item-checkbox-3"
                  type="checkbox"
                  class="border-gray-200 rounded-sm disabled:opacity-50"
                />
              </div>
              <span class="ms-2 block w-full text-sm text-gray-600"> Просрочено </span>
            </label>
          </li>
          <li class="inline-flex items-center gap-x-2 text-sm font-medium bg-white text-gray-800">
            <label
              class="relative flex cursor-pointer items-start w-full py-2 px-2.5 hover:bg-gray-100 rounded-md transition-colors duration-200"
            >
              <div class="flex items-center h-5">
                <input
                  id="hs-list-group-item-checkbox-4"
                  name="hs-list-group-item-checkbox-4"
                  type="checkbox"
                  class="border-gray-200 rounded-sm disabled:opacity-50"
                />
              </div>
              <span class="ms-2 block w-full text-sm text-gray-600"> Истекает сегодня </span>
            </label>
          </li>
          <li class="inline-flex items-center gap-x-2 text-sm font-medium bg-white text-gray-800">
            <label
              class="relative flex cursor-pointer items-start w-full py-2 px-2.5 hover:bg-gray-100 rounded-md transition-colors duration-200"
            >
              <div class="flex items-center h-5">
                <input
                  id="hs-list-group-item-checkbox-5"
                  name="hs-list-group-item-checkbox-5"
                  type="checkbox"
                  class="border-gray-200 rounded-sm disabled:opacity-50"
                />
              </div>
              <span class="ms-2 block w-full text-sm text-gray-600"> Истекает завтра </span>
            </label>
          </li>
          <li class="inline-flex items-center gap-x-2 text-sm font-medium bg-white text-gray-800">
            <label
              class="relative flex cursor-pointer items-start w-full py-2 px-2.5 hover:bg-gray-100 rounded-md transition-colors duration-200"
            >
              <div class="flex items-center h-5">
                <input
                  id="hs-list-group-item-checkbox-6"
                  name="hs-list-group-item-checkbox-6"
                  type="checkbox"
                  class="border-gray-200 rounded-sm disabled:opacity-50"
                />
              </div>
              <span class="ms-2 block w-full text-sm text-gray-600">
                Истекает в течение недели
              </span>
            </label>
          </li>
        </ul>

        <div class="block text-xs text-gray-500 px-2.5 pt-2 mb-1">Теги</div>
        <ul class="max-w-sm flex flex-col">
          <li class="inline-flex items-center gap-x-2 text-sm font-medium bg-white text-gray-800">
            <label
              class="relative flex cursor-pointer items-start w-full py-2 px-2.5 hover:bg-gray-100 rounded-md transition-colors duration-200"
            >
              <div class="flex items-center h-5">
                <input
                  id="hs-list-group-item-checkbox-1"
                  name="hs-list-group-item-checkbox-1"
                  type="checkbox"
                  class="border-gray-200 rounded-sm disabled:opacity-50"
                />
              </div>
              <span class="ms-2 block w-full text-sm text-gray-600"> #срочно </span>
            </label>
          </li>
          <li class="inline-flex items-center gap-x-2 text-sm font-medium bg-white text-gray-800">
            <label
              class="relative flex cursor-pointer items-start w-full py-2 px-2.5 hover:bg-gray-100 rounded-md transition-colors duration-200"
            >
              <div class="flex items-center h-5">
                <input
                  id="hs-list-group-item-checkbox-2"
                  name="hs-list-group-item-checkbox-2"
                  type="checkbox"
                  class="border-gray-200 rounded-sm disabled:opacity-50"
                />
              </div>
              <span class="ms-2 block w-full text-sm text-gray-600"> #дела </span>
            </label>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
