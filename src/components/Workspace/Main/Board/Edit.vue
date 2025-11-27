<script setup lang="ts">
import { useUIStore } from '@stores/ui'
import ActionAndCloseButtons from '@components/Workspace/Main/EditEntity/ActionAndCloseButtons.vue'
import MoveDropdown from '@components/Workspace/Main/MoveDropdown/MoveDropdown.vue'
import MoveDropdownButton from '@components/Workspace/Main/MoveDropdown/MoveDropdownButton.vue'
import { useCategoryDataStore } from '@stores/categoryData'
import { computed, nextTick, watch } from 'vue'
import { ref } from 'vue'
import { Nullable } from '@/types/utils'
import { HSStaticMethods } from 'preline'
import _ from 'lodash'
import { ISingleUpdate } from '@interfaces/domain/ISingleUpdate'
import EntityCard from '@/components/Workspace/Main/EntityCard.vue'
import ColumnsView from '@components/Workspace/Main/ColumnsView.vue'
import { IBoard } from '@interfaces/domain/IBoard'
import { useBoardDataStore } from '@stores/boardData'
import ActiveWorkspaceAvatar from '@components/Workspace/ActiveWorkspaceAvatar.vue'
import TitleWithBadge from '@components/Workspace/Main/TitleWithBadge.vue'

const CATEGORY_STORE = useCategoryDataStore()
const BOARD_STORE = useBoardDataStore()
const UI_STORE = useUIStore()

const editableBoard = ref<Nullable<IBoard>>(null)
const textareaNameAutoHeight = ref<Nullable<HTMLTextAreaElement>>(null)
const updateNameTimeout = ref<Nullable<number>>(null)
const categoriesContainerRef = ref<HTMLElement | null>(null)
const boardUpdatesCounter = ref(0)

async function handleMoveBoard(boardId: string, newWorkspaceId: string) {
  if (!editableBoard.value) return

  await BOARD_STORE.moveBoard(boardId, newWorkspaceId)
}

async function copyBoard(board: IBoard) {
  await BOARD_STORE.cloneBoard(board)

  UI_STORE.closeEditBoardModal()
}

async function archiveBoard(board: IBoard) {
  await BOARD_STORE.archiveBoard(board, board.workspaceId)

  UI_STORE.closeEditCategoryModal()
}

function updateBoard(updatedFields: ISingleUpdate<IBoard>) {
  if (!editableBoard.value) return

  BOARD_STORE.updateBoard(updatedFields, editableBoard.value.workspaceId, true)
}

function nameInput() {
  if (updateNameTimeout.value) {
    clearTimeout(updateNameTimeout.value)
  }

  updateNameTimeout.value = window.setTimeout(() => {
    if (!editableBoard.value || !editableBoard.value.name) return

    updateBoard({
      id: editableBoard.value.id,
      name: editableBoard.value.name,
    })

    updateNameTimeout.value = null
  }, 500)
}

const isBoardCopying = computed(() => {
  if (!editableBoard.value) return false

  return BOARD_STORE.isBoardCloning(editableBoard.value.id)
})

const isBoardArchiving = computed(() => {
  if (!editableBoard.value) return false

  return BOARD_STORE.isBoardArchiving(editableBoard.value.id)
})

function initializeTextarea(textarea: Nullable<HTMLTextAreaElement>) {
  if (textarea) {
    textarea.dispatchEvent(new Event('input'))
  }
}

const getCategories = computed(() => {
  if (!editableBoard.value) return []

  if (editableBoard.value.isDeleted)
    return CATEGORY_STORE.getAllCategoriesByBoardId(editableBoard.value.id)

  return CATEGORY_STORE.getCategoriesByBoardId(editableBoard.value.id)
})

watch(
  () => BOARD_STORE.boardToEdit,
  (newBoard) => {
    const shouldInitialize = newBoard && !editableBoard.value
    boardUpdatesCounter.value++

    if (newBoard) {
      editableBoard.value = _.cloneDeep(newBoard)
    } else {
      editableBoard.value = null
    }

    nextTick(() => {
      if (shouldInitialize) {
        HSStaticMethods.autoInit()
      }

      initializeTextarea(textareaNameAutoHeight.value)
    })
  },
  { deep: true, immediate: true },
)
</script>

<template>
  <div
    id="hs-board-edit"
    :ref="
      (el) => {
        if (el) UI_STORE.editBoardModalRef = el as HTMLElement
      }
    "
    class="hs-overlay [--overlay-backdrop:static] hs-overlay-open:opacity-100 hs-overlay-open:duration-500 hidden size-full fixed top-0 start-0 z-85 opacity-0 overflow-x-hidden transition-all overflow-y-auto pointer-events-none"
    role="dialog"
    tabindex="-1"
    aria-labelledby="hs-category-edit-label"
  >
    <div class="size-full flex items-center justify-center p-2 sm:p-4">
      <div
        class="flex flex-col w-full max-h-150 max-w-xl bg-white rounded-md pointer-events-auto"
        v-if="editableBoard"
      >
        <!-- Header -->
        <div class="flex justify-between items-center gap-x-2 px-4 py-2 border-b border-gray-200">
          <div class="flex items-center gap-x-1 min-w-0">
            <MoveDropdown
              :entity="editableBoard"
              :type="2"
              :key="boardUpdatesCounter"
              @moveBoard="handleMoveBoard"
              v-if="!editableBoard.isDeleted"
            >
              <ActiveWorkspaceAvatar size="6" />
            </MoveDropdown>

            <MoveDropdownButton :title="editableBoard.workspaceName" :disabled="true" v-else>
              <ActiveWorkspaceAvatar size="6" />
            </MoveDropdownButton>
          </div>

          <ActionAndCloseButtons
            :editableEntity="editableBoard"
            :isEntityCopying="isBoardCopying"
            :isEntityArchiving="isBoardArchiving"
            @copy="copyBoard"
            @archive="archiveBoard"
            @close="UI_STORE.closeEditBoardModal()"
          />
        </div>
        <!-- Header End -->

        <div class="flex items-start px-4 pt-2">
          <!-- Textarea -->
          <div class="flex items-center w-full">
            <textarea
              class="p-0 block w-full text-black border-none focus:ring-0 text-lg disabled:opacity-50 disabled:pointer-events-none resize-none overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300"
              placeholder="Имя доски"
              data-hs-textarea-auto-height
              @input="nameInput"
              ref="textareaNameAutoHeight"
              rows="1"
              v-model="editableBoard.name"
            ></textarea>
          </div>
          <!-- End Textarea -->
        </div>

        <div class="flex flex-col gap-y-2 px-4 pb-4 mt-4 items-start overflow-hidden">
          <TitleWithBadge title="Категории" :number="getCategories.length" />

          <div
            class="flex gap-2 flex-wrap w-full min-h-0 pb-2 overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300"
            ref="categoriesContainerRef"
            v-if="getCategories.length > 0"
          >
            <ColumnsView :items="getCategories" :containerRef="categoriesContainerRef">
              <template v-slot:default="slotProps">
                <EntityCard
                  v-for="category in slotProps.data"
                  :key="category.id"
                  :name="category.name"
                  :isStatic="false"
                  :hasCopy="true"
                  :isCopying="CATEGORY_STORE.isCategoryCloning(category.id)"
                  :hasDelete="true"
                  :isDeleted="category.isDeleted"
                  :isArchiving="CATEGORY_STORE.isCategoryArchiving(category.id)"
                  @click="CATEGORY_STORE.openCategoryToEdit(category)"
                />
              </template>
            </ColumnsView>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
