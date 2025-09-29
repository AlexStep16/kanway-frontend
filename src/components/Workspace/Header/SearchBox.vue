<script setup lang="ts">
import { HSComboBox, ICollectionItem } from 'preline'
import { onMounted, ref } from 'vue'

defineProps<{
  placeholder?: string
}>()

const searchBoxRef = ref<HTMLElement | null>(null)
const preventAutofill = ref(true)

function inputSearch(event: Event) {
  const input = event.target as HTMLInputElement

  if (input && searchBoxRef.value) {
    const { element } = HSComboBox.getInstance(
      searchBoxRef.value,
      true,
    ) as ICollectionItem<HSComboBox>

    if (element) {
      if (input.value.length === 0) {
        element.close()

        event.stopImmediatePropagation()
      }
    }
  }
}

onMounted(() => {
  setTimeout(() => {
    preventAutofill.value = false
  }, 10)
})
</script>

<template>
  <div class="max-w-sm">
    <!-- SearchBox -->
    <div
      class="relative"
      ref="searchBoxRef"
      data-hs-combo-box='{
        "groupingType": "default",
        "preventSelection": true,
        "outputEmptyTemplate": "<div class=\"py-2 px-4 w-full text-sm text-gray-800 rounded-lg dark:bg-neutral-900 dark:text-neutral-200\">Ничего не найдено...</div>",
        "isOpenOnFocus": false,
        "groupingTitleTemplate": "<div class=\"block text-xs text-gray-500 px-2.5 pt-2 mb-1\"></div>"
      }'
    >
      <div class="relative">
        <div class="absolute inset-y-0 start-0 flex items-center pointer-events-none z-20 ps-3.5">
          <svg
            class="shrink-0 size-4 text-gray-400 dark:text-white/60"
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
          id="header-search-input"
          class="py-1.5 ps-10 pe-4 block w-full border border-gray-200 bg-gray-100 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none"
          type="text"
          name="header-search-input"
          autocomplete="off"
          role="combobox"
          aria-expanded="false"
          :placeholder="placeholder ? placeholder : 'Найти задачи на доске...'"
          @input="inputSearch"
          value=""
          :disabled="preventAutofill"
          data-hs-combo-box-input=""
        />
      </div>

      <!-- SearchBox Dropdown -->
      <div
        class="absolute z-50 w-80 bg-white rounded-xl shadow-xl dark:bg-neutral-800"
        style="display: none"
        data-hs-combo-box-output=""
      >
        <div
          class="max-h-125 p-2 overflow-y-auto overflow-hidden [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500"
          data-hs-combo-box-output-items-wrapper=""
        >
          <div
            data-hs-combo-box-output-item='{"group": {"name": "tasks", "title": "Задачи"}}'
            tabindex="1"
          >
            <a
              class="py-2 px-2.5 flex items-center gap-x-3 hover:bg-gray-100 rounded-lg focus:outline-hidden focus:bg-gray-100 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
              href="/"
            >
              <span
                class="text-sm text-gray-800 dark:text-neutral-200 truncate"
                data-hs-combo-box-search-text="Составить отчёт"
                data-hs-combo-box-value=""
                title="Составить отчёт"
                >Составить отчёт</span
              >
              <span
                class="ms-auto text-xs text-gray-400"
                data-hs-combo-box-search-text="Online"
                data-hs-combo-box-value=""
                >Работа</span
              >
            </a>
          </div>
        </div>
      </div>
      <!-- End SearchBox Dropdown -->
    </div>
    <!-- End SearchBox -->
  </div>
</template>
