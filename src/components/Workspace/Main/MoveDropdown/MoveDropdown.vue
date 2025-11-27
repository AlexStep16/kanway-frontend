<script setup lang="ts">
import { useCategoryDataStore } from '@stores/categoryData'
import { useBoardDataStore } from '@stores/boardData'
import { useWorkspaceDataStore } from '@stores/workspaceData'
import { computed, onMounted, ref, watch } from 'vue'
import { HSDropdown, HSSelect, HSStaticMethods, ICollectionItem } from 'preline'
import MoveDropdownButton from '@components/Workspace/Main/MoveDropdown/MoveDropdownButton.vue'
import { ITaskState } from '@stores/interfaces/ITaskState'
import { ICategoryState } from '@stores/interfaces/ICategoryState'
import { Nullable } from '@/types/utils'
import { IBoard } from '@interfaces/domain/IBoard'

enum EntityType {
  Task = 0,
  Category = 1,
  Board = 2,
}

const props = defineProps<{
  entity: ITaskState | ICategoryState | IBoard
  type: EntityType
}>()

const emit = defineEmits<{
  (e: 'moveTask', entityId: string, newParentId: string): void
  (e: 'moveCategory', entityId: string, newParentId: string): void
  (e: 'moveBoard', entityId: string, newParentId: string): void
}>()

const CATEGORY_STORE = useCategoryDataStore()
const BOARD_STORE = useBoardDataStore()
const WORKSPACE_STORE = useWorkspaceDataStore()

const workspaceSelectRef = ref<Nullable<HTMLElement>>(null)
const workspaceSelectInstance = ref<Nullable<HSSelect>>(null)
const boardSelectRef = ref<Nullable<HTMLElement>>(null)
const boardSelectInstance = ref<Nullable<HSSelect>>(null)
const categorySelectRef = ref<Nullable<HTMLElement>>(null)
const categorySelectInstance = ref<Nullable<HSSelect>>(null)
const moveRef = ref<Nullable<HTMLElement>>(null)
const moveInstance = ref<Nullable<HSDropdown>>(null)

const getCurrentCategory = computed(() => {
  return CATEGORY_STORE.getCategoryById((props.entity as ITaskState).categoryId)
})

const getCurrentBoard = computed(() => {
  return BOARD_STORE.getBoardById((props.entity as ICategoryState).boardId)
})

const getCurrentWorkspace = computed(() => {
  return WORKSPACE_STORE.getWorkspaceById((props.entity as IBoard).workspaceId)
})

const selectedWorkspace = ref<string>(getCurrentWorkspace.value?.id || '')
const selectedBoard = ref<Nullable<string>>(getCurrentBoard.value?.id || null)
const selectedCategory = ref<Nullable<string>>(getCurrentCategory.value?.id || null)

const getBoards = computed(() => {
  return BOARD_STORE.getBoardsByWorkspaceId(selectedWorkspace.value || '')
})

const getWorkspaces = computed(() => {
  return WORKSPACE_STORE.getWorkspaces
})

const getCategories = computed(() => {
  if (!selectedBoard.value) return []

  return CATEGORY_STORE.getCategoriesByBoardId(selectedBoard.value)
})

function fillWorkspaceOptions() {
  if (!workspaceSelectInstance.value) return

  for (const workspace of getWorkspaces.value) {
    workspaceSelectInstance.value.addOption({
      title: workspace.name,
      val: workspace.id,
    })
  }
}

function fillBoardOptions() {
  if (!boardSelectInstance.value) return

  for (const board of getBoards.value) {
    boardSelectInstance.value.addOption({
      title: board.name,
      val: board.id,
    })
  }

  if (getBoards.value.length > 0) {
    const defaultValue = selectedBoard.value || getBoards.value[0].id

    boardSelectInstance.value.setValue(defaultValue)
    selectedBoard.value = defaultValue
  }
}

function fillCategoryOptions() {
  if (!categorySelectInstance.value) return

  for (const category of getCategories.value) {
    categorySelectInstance.value.addOption({
      title: category.name || 'Без категории',
      val: category.id,
    })
  }

  if (getCategories.value.length > 0) {
    const defaultValue = selectedCategory.value || getCategories.value[0].id

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

function removeCurrentBoardOptions() {
  if (!boardSelectInstance.value) return

  const options = (boardSelectInstance.value as any).selectOptions

  for (const option of options) {
    boardSelectInstance.value.removeOption(option.val)
  }
}

function moveTask() {
  if (!selectedCategory.value) return

  emit('moveTask', props.entity.id, selectedCategory.value)

  if (moveInstance.value) {
    moveInstance.value.close()
  }
}

function moveCategory() {
  if (!selectedBoard.value) return

  emit('moveCategory', props.entity.id, selectedBoard.value)

  if (moveInstance.value) {
    moveInstance.value.close()
  }
}

function moveBoard() {
  if (!selectedWorkspace.value) return

  emit('moveBoard', props.entity.id, selectedWorkspace.value)

  if (moveInstance.value) {
    moveInstance.value.close()
  }
}

const isMoveDisabled = computed(() => {
  if (props.type === EntityType.Board)
    return (
      !selectedWorkspace.value || selectedWorkspace.value === (props.entity as IBoard).workspaceId
    )
  if (props.type === EntityType.Category)
    return !selectedBoard.value || selectedBoard.value === (props.entity as ICategoryState).boardId
  else if (props.type === EntityType.Task)
    return (
      !selectedCategory.value || selectedCategory.value === (props.entity as ITaskState).categoryId
    )
  else return true
})

watch(
  () => BOARD_STORE.areBoardsLoading(selectedWorkspace.value || ''),
  (val: boolean) => {
    if (val) {
      const toggle = moveRef.value?.querySelector('button .board-select-loader') as HTMLElement

      if (toggle) {
        toggle.style.display = 'block'
      }
    } else {
      const toggle = moveRef.value?.querySelector('button .board-select-loader') as HTMLElement

      if (toggle) {
        toggle.style.display = 'none'
      }
    }
  },
)

watch(
  () => CATEGORY_STORE.areCategoriesLoading(selectedBoard.value || ''),
  (val: boolean) => {
    if (val) {
      const toggle = moveRef.value?.querySelector('button .category-select-loader') as HTMLElement

      if (toggle) {
        toggle.style.display = 'block'
      }
    } else {
      const toggle = moveRef.value?.querySelector('button .category-select-loader') as HTMLElement

      if (toggle) {
        toggle.style.display = 'none'
      }
    }
  },
)

function move() {
  if (props.type === EntityType.Task) {
    moveTask()
  } else if (props.type === EntityType.Category) {
    moveCategory()
  } else if (props.type === EntityType.Board) {
    moveBoard()
  }
}

const getButtonTitle = computed(() => {
  if (props.type === EntityType.Task) {
    const task = props.entity as ITaskState

    return task.categoryName ? task.categoryName : 'Без категории'
  } else if (props.type === EntityType.Category) {
    const category = props.entity as ICategoryState

    return category.boardName ? category.boardName : 'Без доски'
  } else {
    const board = props.entity as IBoard

    return board.workspaceName ? board.workspaceName : 'Без пространства'
  }
})

const isCategoryShown = computed(() => {
  return props.type === EntityType.Task
})

const isBoardShown = computed(() => {
  return props.type === EntityType.Category || props.type === EntityType.Task
})

function initCategorySelector() {
  if (!categorySelectRef.value) return

  categorySelectInstance.value = HSSelect.getInstance(categorySelectRef.value) as HSSelect

  fillCategoryOptions()

  categorySelectInstance.value.setValue(getCurrentCategory.value?.id || '')

  categorySelectInstance.value.on('change', (val: string) => {
    selectedCategory.value = val
  })

  selectedCategory.value = getCurrentCategory.value?.id || ''
}

function initBoardSelector() {
  if (!boardSelectRef.value) return

  boardSelectInstance.value = HSSelect.getInstance(boardSelectRef.value) as HSSelect

  fillBoardOptions()

  boardSelectInstance.value.setValue(getCurrentBoard.value?.id || '')

  boardSelectInstance.value.on('change', async (val: string) => {
    removeCurrentCategoryOptions()

    selectedBoard.value = val
    selectedCategory.value = null

    await CATEGORY_STORE.loadCategories(val, selectedWorkspace.value)

    fillCategoryOptions()
  })

  selectedBoard.value = getCurrentBoard.value?.id || ''
}

function initWorkspaceSelector() {
  if (!workspaceSelectRef.value) return

  workspaceSelectInstance.value = HSSelect.getInstance(workspaceSelectRef.value) as HSSelect

  fillWorkspaceOptions()

  workspaceSelectInstance.value.setValue(getCurrentWorkspace.value?.id || '')

  workspaceSelectInstance.value.on('change', async (val: string) => {
    removeCurrentCategoryOptions()
    removeCurrentBoardOptions()

    selectedWorkspace.value = val
    selectedBoard.value = null
    selectedCategory.value = null

    await BOARD_STORE.loadBoards(val)

    fillBoardOptions()
  })

  selectedWorkspace.value = getCurrentWorkspace.value?.id || ''
}

onMounted(() => {
  HSStaticMethods.autoInit()

  initWorkspaceSelector()
  if (isBoardShown.value) {
    initBoardSelector()
  }
  if (isCategoryShown.value) {
    initCategorySelector()
  }

  if (moveRef.value) {
    const { element } = HSDropdown.getInstance(moveRef.value, true) as ICollectionItem<HSDropdown>

    moveInstance.value = element
  }
})
</script>

<template>
  <div class="hs-dropdown [--auto-close:inside] relative inline-flex min-w-0" ref="moveRef">
    <MoveDropdownButton :title="getButtonTitle">
      <slot></slot>
    </MoveDropdownButton>

    <div
      class="hs-dropdown-menu transition-[opacity,margin] duration hs-dropdown-open:opacity-100 z-90 opacity-0 hidden w-65 bg-white shadow-md rounded-lg mt-2 after:h-4 after:absolute after:-bottom-4 after:start-0 after:w-full before:h-4 before:absolute before:-top-4 before:start-0 before:w-full"
      role="menu"
      aria-orientation="vertical"
      aria-labelledby="hs-dropdown-move"
    >
      <div class="flex flex-col p-2 gap-y-2">
        <div class="flex flex-col gap-y-0.5 flex-grow-1">
          <span class="text-xs text-gray-400">Пространство</span>

          <select
            ref="workspaceSelectRef"
            data-hs-select='{
                      "placeholder": "Нет пространств...",
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

        <div class="flex flex-col gap-y-0.5 flex-grow-1" v-if="isBoardShown">
          <span class="text-xs text-gray-400">Доска</span>

          <select
            ref="boardSelectRef"
            data-hs-select='{
                      "placeholder": "Нет досок...",
                      "toggleTag": "<button type=\"button\" aria-expanded=\"false\"><div style=\"display: none;\" class=\"board-select-loader size-full absolute left-0 top-0 z-100 bg-white\"><div class=\"size-full animate-pulse bg-gray-300\"></div></div></button>",
                      "toggleClasses": "hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50 relative py-1.5 ps-2.5 pe-9 flex gap-x-2 text-nowrap w-full cursor-pointer bg-white border border-gray-200 rounded-lg text-start text-custom-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500",
                      "dropdownClasses": "mt-2 z-50 w-full max-h-72 p-1 space-y-0.5 bg-white border border-gray-200 rounded-lg overflow-hidden overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300",
                      "optionClasses": "py-2 px-4 w-full text-sm text-gray-800 cursor-pointer hover:bg-gray-100 rounded-lg focus:outline-hidden focus:bg-gray-100 hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50",
                      "optionTemplate": "<div class=\"flex justify-between items-center w-full\"><span data-title></span><span class=\"hidden hs-selected:block\"><svg class=\"shrink-0 size-3.5 text-blue-600\" xmlns=\"http:.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polyline points=\"20 6 9 17 4 12\"/></svg></span></div>",
                      "extraMarkup": "<div class=\"absolute top-1/2 end-3 -translate-y-1/2\"><svg class=\"shrink-0 size-3.5 text-gray-500\" xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m7 15 5 5 5-5\"/><path d=\"m7 9 5-5 5 5\"/></svg></div>"
                    }'
            class="hidden"
          ></select>
        </div>

        <div class="flex flex-col gap-y-0.5 flex-grow-1" v-if="isCategoryShown">
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
            :disabled="getCategories.length === 0"
          ></select>
        </div>

        <button
          class="self-start rounded-md text-xs px-2.5 py-1.5 bg-blue-500 hover:opacity-90 transition-opacity text-white duration-100 focus:outline-hidden disabled:opacity-50 disabled:pointer-events-none"
          :disabled="isMoveDisabled"
          @click="move"
        >
          Переместить
        </button>
      </div>
    </div>
  </div>
</template>
