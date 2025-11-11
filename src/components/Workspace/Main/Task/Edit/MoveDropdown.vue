<script setup lang="ts">
import { Layers } from 'lucide-vue-next'
import { TaskModel } from '@models/TaskModel'
import { useCategoryDataStore } from '@stores/categoryData'
import { useBoardDataStore } from '@stores/boardData'
import { useWorkspaceDataStore } from '@stores/workspaceData'
import { computed, onMounted, ref, watch } from 'vue'
import { HSDropdown, HSSelect, HSStaticMethods, ICollectionItem } from 'preline'
import { Nullable } from '@/types/utils'

const props = defineProps<{
  task: TaskModel
}>()

const emit = defineEmits<{
  (e: 'moveTask', payload: { taskId: string; newCategoryId: string }): void
}>()

const CATEGORY_STORE = useCategoryDataStore()
const BOARD_STORE = useBoardDataStore()
const WORKSPACE_STORE = useWorkspaceDataStore()

const boardSelectRef = ref<Nullable<HTMLElement>>(null)
const boardSelectInstance = ref<Nullable<HSSelect>>(null)
const categorySelectRef = ref<Nullable<HTMLElement>>(null)
const categorySelectInstance = ref<Nullable<HSSelect>>(null)
const moveRef = ref<Nullable<HTMLElement>>(null)
const moveInstance = ref<Nullable<HSDropdown>>(null)

const getCurrentCategory = computed(() => {
  return CATEGORY_STORE.getCategoryById(props.task.categoryId)
})

const getCurrentBoard = computed(() => {
  return BOARD_STORE.getBoardById(props.task.boardId)
})

const selectedBoard = ref<string>(getCurrentBoard.value?.id || '')
const selectedCategory = ref<Nullable<string>>(getCurrentCategory.value?.id || null)

const getBoards = computed(() => {
  return BOARD_STORE.getActiveWorkspaceBoards
})

const getSelectedBoardCategories = computed(() => {
  if (!selectedBoard.value) return []

  return CATEGORY_STORE.getCategoriesByBoardId(selectedBoard.value)
})

function fillBoardOptions() {
  if (!boardSelectInstance.value) return

  for (const board of getBoards.value) {
    boardSelectInstance.value.addOption({
      title: board.name,
      val: board.id,
    })
  }
}

function fillCategoryOptions() {
  if (!categorySelectInstance.value) return

  for (const category of getSelectedBoardCategories.value) {
    categorySelectInstance.value.addOption({
      title: category.name || 'Без категории',
      val: category.id,
    })
  }

  if (getSelectedBoardCategories.value.length > 0) {
    const defaultValue = selectedCategory.value || getSelectedBoardCategories.value[0].id

    categorySelectInstance.value.setValue(defaultValue)
    selectedCategory.value = defaultValue
  }
}

function removeCurrentCategoryOptions() {
  if (!categorySelectInstance.value) return

  const options = (categorySelectInstance.value as any).selectOptions

  for (const option of options) {
    categorySelectInstance.value.removeOption(option.val)
  }
}

function moveTask() {
  if (!selectedCategory.value) return

  emit('moveTask', {
    taskId: props.task.id,
    newCategoryId: selectedCategory.value,
  })

  if (moveInstance.value) {
    moveInstance.value.close()
  }
}

const isMoveDisabled = computed(() => {
  return !selectedCategory.value || selectedCategory.value === props.task.categoryId
})

watch(
  () => CATEGORY_STORE.areCategoriesLoading(selectedBoard.value),
  (val: boolean) => {
    if (val) {
      const toggle = document.querySelector('button .category-select-loader') as HTMLElement

      if (toggle) {
        toggle.style.display = 'block'
      }
    } else {
      const toggle = document.querySelector('button .category-select-loader') as HTMLElement

      if (toggle) {
        toggle.style.display = 'none'
      }
    }
  },
)

onMounted(() => {
  HSStaticMethods.autoInit()
  if (!boardSelectRef.value || !categorySelectRef.value) return

  boardSelectInstance.value = HSSelect.getInstance(boardSelectRef.value) as HSSelect
  categorySelectInstance.value = HSSelect.getInstance(categorySelectRef.value) as HSSelect

  fillBoardOptions()
  fillCategoryOptions()

  boardSelectInstance.value.setValue(getCurrentBoard.value?.id || '')
  categorySelectInstance.value.setValue(getCurrentCategory.value?.id || '')

  boardSelectInstance.value.on('change', async (val: string) => {
    removeCurrentCategoryOptions()

    selectedBoard.value = val
    selectedCategory.value = null

    await CATEGORY_STORE.loadCategories(val, WORKSPACE_STORE.getActiveWorkspaceId)

    fillCategoryOptions()
  })

  categorySelectInstance.value.on('change', (val: string) => {
    selectedCategory.value = val
  })

  selectedBoard.value = getCurrentBoard.value?.id || ''
  selectedCategory.value = getCurrentCategory.value?.id || ''

  if (moveRef.value) {
    const { element } = HSDropdown.getInstance(moveRef.value, true) as ICollectionItem<HSDropdown>

    moveInstance.value = element
  }
})
</script>

<template>
  <div class="hs-dropdown [--auto-close:inside] relative inline-flex min-w-0" ref="moveRef">
    <button
      id="hs-dropdown-move"
      type="button"
      class="min-w-0 py-1.5 px-2 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-gray-100 hover:bg-gray-200 transition-colors duration-100 text-gray-500 focus:outline-hidden disabled:opacity-50 disabled:pointer-events-none"
      aria-haspopup="menu"
      aria-expanded="false"
      aria-label="Dropdown"
    >
      <div class="flex items-center gap-x-2 min-w-0">
        <Layers class="size-4 shrink-0" />
        <span class="truncate min-w-0">{{ getCurrentCategory?.name || 'Без категории' }}</span>
      </div>
      <svg
        class="hs-dropdown-open:rotate-180 size-4 transition-transform duration-200 shrink-0"
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
        <path d="m6 9 6 6 6-6" />
      </svg>
    </button>

    <div
      class="hs-dropdown-menu transition-[opacity,margin] duration hs-dropdown-open:opacity-100 z-90 opacity-0 hidden w-65 bg-white shadow-md rounded-lg mt-2 after:h-4 after:absolute after:-bottom-4 after:start-0 after:w-full before:h-4 before:absolute before:-top-4 before:start-0 before:w-full"
      role="menu"
      aria-orientation="vertical"
      aria-labelledby="hs-dropdown-move"
    >
      <div class="flex flex-col p-2 gap-y-2">
        <div class="flex flex-col gap-y-0.5 flex-grow-1">
          <span class="text-xs text-gray-400">Доска</span>

          <select
            ref="boardSelectRef"
            data-hs-select='{
                      "placeholder": "Нет досок...",
                      "toggleTag": "<button type=\"button\" aria-expanded=\"false\"></button>",
                      "toggleClasses": "hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50 relative py-1.5 ps-2.5 pe-9 flex gap-x-2 text-nowrap w-full cursor-pointer bg-white border border-gray-200 rounded-lg text-start text-custom-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500",
                      "dropdownClasses": "mt-2 z-50 w-full max-h-72 p-1 space-y-0.5 bg-white border border-gray-200 rounded-lg overflow-hidden overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300",
                      "optionClasses": "py-2 px-4 w-full text-sm text-gray-800 cursor-pointer hover:bg-gray-100 rounded-lg focus:outline-hidden focus:bg-gray-100 hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50",
                      "optionTemplate": "<div class=\"flex justify-between items-center w-full\"><span data-title></span><span class=\"hidden hs-selected:block\"><svg class=\"shrink-0 size-3.5 text-blue-600\" xmlns=\"http:.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polyline points=\"20 6 9 17 4 12\"/></svg></span></div>",
                      "extraMarkup": "<div class=\"absolute top-1/2 end-3 -translate-y-1/2\"><svg class=\"shrink-0 size-3.5 text-gray-500\" xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m7 15 5 5 5-5\"/><path d=\"m7 9 5-5 5 5\"/></svg></div>"
                    }'
            class="hidden"
          ></select>
        </div>

        <div class="flex flex-col gap-y-0.5 flex-grow-1">
          <span class="text-xs text-gray-400">Категория</span>
          <select
            ref="categorySelectRef"
            data-hs-select='{
                      "placeholder": "Нет категорий...",
                      "toggleTag": "<button class=\"overflow-hidden\" type=\"button\" aria-expanded=\"false\"><div style=\"display: none;\" class=\"category-select-loader size-full absolute left-0 top-0 z-100 bg-white\"><div class=\"size-full animate-pulse bg-gray-300\"></div></div></button>",
                      "toggleClasses": "hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50 relative py-1.5 ps-2.5 pe-9 flex gap-x-2 text-nowrap w-full cursor-pointer bg-white border border-gray-200 rounded-lg text-start text-custom-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500",
                      "dropdownClasses": "mt-2 z-50 w-full max-h-72 p-1 space-y-0.5 bg-white border border-gray-200 rounded-lg overflow-hidden overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300",
                      "optionClasses": "py-2 px-4 w-full text-sm text-gray-800 cursor-pointer hover:bg-gray-100 rounded-lg focus:outline-hidden focus:bg-gray-100 hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50",
                      "optionTemplate": "<div class=\"flex justify-between items-center w-full\"><span data-title></span><span class=\"hidden hs-selected:block\"><svg class=\"shrink-0 size-3.5 text-blue-600 \" xmlns=\"http:.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polyline points=\"20 6 9 17 4 12\"/></svg></span></div>",
                      "extraMarkup": "<div class=\"absolute top-1/2 end-3 -translate-y-1/2\"><svg class=\"shrink-0 size-3.5 text-gray-500 \" xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m7 15 5 5 5-5\"/><path d=\"m7 9 5-5 5 5\"/></svg></div>"
                    }'
            class="hidden"
            :disabled="getSelectedBoardCategories.length === 0"
          ></select>
        </div>

        <button
          class="self-start rounded-md text-xs px-2.5 py-1.5 bg-blue-500 hover:opacity-90 transition-opacity text-white duration-100 focus:outline-hidden disabled:opacity-50 disabled:pointer-events-none"
          :disabled="isMoveDisabled"
          @click="moveTask"
        >
          Переместить
        </button>
      </div>
    </div>
  </div>
</template>
