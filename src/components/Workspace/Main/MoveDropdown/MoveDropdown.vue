<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { HSDropdown, HSSelect, HSStaticMethods } from 'preline'
import MoveDropdownButton from '@components/Workspace/Main/MoveDropdown/MoveDropdownButton.vue'
import { EntityType } from '@/enums/EntityType'
import { useWorkspaces } from '@/composables/workspaces/queries/useWorkspaces'
import { useBoards } from '@/composables/boards/queries/useBoards'
import { useCategories } from '@/composables/categories/queries/useCategories'

const props = defineProps<{
  entity: any // ITaskState | ICategoryState | IBoard
  type: EntityType
}>()

const emit = defineEmits(['move'])

// --- STATE ---
const selectedWorkspaceId = ref(props.entity.workspace?.id)
const selectedBoardId = ref(props.entity.board?.id || null)
const selectedCategoryId = ref(props.entity.category?.id || null)

const dropdownRef = ref<HTMLElement | null>(null)

// --- QUERIES ---
const { data: workspacesData } = useWorkspaces()
const { data: boardsData, isFetching: isBoardsLoading } = useBoards(selectedWorkspaceId)
const { data: categoriesData, isFetching: isCategoriesLoading } = useCategories(selectedBoardId)

const workspaces = computed(() => workspacesData.value || [])
const boards = computed(() => boardsData.value || [])
const categories = computed(() => categoriesData.value || [])

const reinitSelects = () => {
  nextTick(() => {
    HSSelect.autoInit()

    const selects = dropdownRef.value?.querySelectorAll('[data-hs-select]')
    selects?.forEach((el) => {
      const instance = HSSelect.getInstance(el as HTMLElement, true) as any
      if (instance && instance.element) {
        instance.element.on('change', (val: string) => {
          if (el.id.includes('workspace')) selectedWorkspaceId.value = val
          if (el.id.includes('board')) selectedBoardId.value = val
          if (el.id.includes('category')) selectedCategoryId.value = val
        })
      }
    })
  })
}

watch([workspaces, boards, categories], reinitSelects)

watch(selectedWorkspaceId, (newId, oldId) => {
  if (newId !== oldId) {
    selectedBoardId.value = null
    selectedCategoryId.value = null
  }
})

watch(selectedBoardId, (newId, oldId) => {
  if (newId !== oldId) {
    selectedCategoryId.value = null
  }
})

function handleMove() {
  emit('move', {
    id: props.entity.id,
    newCategoryId: selectedCategoryId.value,
    newBoardId: selectedBoardId.value,
    newWorkspaceId: selectedWorkspaceId.value,
  })

  const instance = HSDropdown.getInstance(dropdownRef.value!, true) as any
  if (instance) instance.element.close()
}

const isMoveDisabled = computed(() => {
  if (props.type === EntityType.Board)
    return selectedWorkspaceId.value === props.entity.workspace.id
  if (props.type === EntityType.Category) return selectedBoardId.value === props.entity.board.id
  return selectedCategoryId.value === props.entity.category.id
})

const getButtonTitle = computed(() => {
  if (props.type === EntityType.Task) return props.entity.category.name || 'Без категории'
  if (props.type === EntityType.Category) return props.entity.board.name || 'Без доски'
  return props.entity.workspace.name || 'Без пространства'
})

onMounted(() => {
  HSStaticMethods.autoInit()
  reinitSelects()
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
        <div class="flex flex-col gap-y-0.5 grow">
          <span class="text-xs text-gray-400">Пространство</span>

          <select
            :id="`select-workspace-${entity.id}`"
            v-model="selectedWorkspaceId"
            :key="`ws-${workspaces.length}`"
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
            :disabled="workspaces.length === 0"
          >
            <option v-for="ws in workspaces" :key="ws.id" :value="ws.id">{{ ws.name }}</option>
          </select>
        </div>

        <div class="flex flex-col gap-y-0.5 grow" v-if="type !== EntityType.Board">
          <span class="text-xs text-gray-400">Доска</span>
          <div
            v-if="isBoardsLoading"
            class="absolute inset-0 bg-white/60 z-10 flex items-center justify-center"
          >
            <div class="w-full h-8 bg-gray-100 animate-pulse rounded-lg"></div>
          </div>
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
            :disabled="boards.length === 0"
          ></select>
        </div>

        <div class="flex flex-col gap-y-0.5 grow" v-if="type === EntityType.Task">
          <span class="text-xs text-gray-400">Категория</span>

          <div v-if="isCategoriesLoading" class="absolute inset-0 bg-white/60 z-10">
            <div class="w-full h-8 bg-gray-100 animate-pulse rounded-lg"></div>
          </div>

          <select
            :id="`select-category-${entity.id}`"
            v-model="selectedCategoryId"
            :key="`cat-${selectedBoardId}-${categories.length}`"
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
            :disabled="categories.length === 0"
          >
            <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</option>
          </select>
        </div>

        <button
          class="w-full rounded-md text-xs py-2 bg-blue-500 text-white disabled:opacity-50"
          :disabled="isMoveDisabled || isBoardsLoading || isCategoriesLoading"
          @click="handleMove"
        >
          Переместить
        </button>
      </div>
    </div>
  </div>
</template>
