<script setup lang="ts">
const availableColors = [
  'bg-red-400',
  'bg-yellow-400',
  'bg-green-400',
  'bg-blue-500',
  'bg-indigo-400',
  'bg-purple-400',
  'bg-pink-400',
  'bg-gray-400',
]

defineProps<{
  dropdownMenuWidth?: number
  id: string
}>()
</script>

<template>
  <div
    class="flex flex-col gap-y-2 p-2"
    :style="{ width: dropdownMenuWidth ? dropdownMenuWidth + 'px' : 'auto' }"
  >
    <div class="flex flex-col gap-y-1">
      <label :for="id + '-name-input'" class="text-xs font-bold text-gray-500">Заголовок</label>
      <input
        type="text"
        :id="id + '-name-input'"
        class="py-1.5 block w-full border border-gray-200 bg-gray-100 rounded-lg placeholder:text-gray-300 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
        placeholder="Введите заголовок"
        :name="id + '-name-input'"
        autocomplete="off"
        @keydown.stop=""
        @keypress.stop=""
        aria-expanded="false"
        value=""
      />
    </div>

    <div class="flex flex-col gap-y-1">
      <span class="text-xs font-bold text-gray-500">Цвет</span>
      <div class="flex flex-wrap gap-1">
        <button
          type="button"
          class="inline-block size-7 rounded-md"
          v-for="color in availableColors"
          :key="color"
          :class="color"
        ></button>
      </div>
    </div>

    <div class="flex justify-end gap-x-2 pt-2 border-t border-gray-200">
      <button
        type="button"
        class="px-2.5 py-1.5 w-full bg-blue-500 text-custom-sm text-white rounded-md hover:bg-blue-600 transition-colors duration-200"
      >
        Создать
      </button>
    </div>
  </div>
</template>
