<script setup lang="ts">
import { nextTick, watch, ref, computed } from 'vue'
import { HSStaticMethods } from 'preline'
import { useDebounceFn } from '@vueuse/core' // Рекомендую установить @vueuse/core

// Сторы
import { useUIStore } from '@stores/ui'

// Мутации и Запросы
import { useCategories } from '@/composables/categories/queries/useCategories'
import { useUpdateBoard } from '@/composables/boards/mutations/useUpdateBoard'
import { useCloneBoard } from '@/composables/boards/mutations/useCloneBoard'
import { useArchiveBoard } from '@/composables/boards/mutations/useArchiveBoard'
import { useBoardMutationStatus } from '@/composables/boards/mutations/useBoardMutationStatus'

// Компоненты
import ActionAndCloseButtons from '@components/Workspace/Main/EditEntity/ActionAndCloseButtons.vue'
import MoveDropdown from '@components/Workspace/Main/MoveDropdown/MoveDropdown.vue'
import EntityCard from '@components/Workspace/Main/EntityCard.vue'
import ColumnsView from '@components/Workspace/Main/ColumnsView.vue'
import ActiveWorkspaceAvatar from '@components/Workspace/ActiveWorkspaceAvatar.vue'
import TitleWithBadge from '@components/Workspace/Main/TitleWithBadge.vue'
import { storeToRefs } from 'pinia'
import { useBoard } from '@/composables/boards/useBoard'
import { EntityType } from '@/enums/EntityType'
import { useArchivedCategories } from '@/composables/categories/queries/useArchivedCategories'
import TaskSkeleton from '@components/Workspace/Main/Task/TaskSkeleton.vue'
import { useArchivedBoard } from '@/composables/boards/useArchivedBoard'

const uiStore = useUIStore()

const { editableBoardId, editableBoardWorkspaceId, isEditableBoardDeleted } = storeToRefs(uiStore)

const liveBoard = useBoard(
  editableBoardId,
  editableBoardWorkspaceId,
  computed(() => !isEditableBoardDeleted.value),
)
const archivedBoard = useArchivedBoard(
  editableBoardId,
  computed(() => isEditableBoardDeleted.value),
)

const board = computed(() => {
  return isEditableBoardDeleted.value ? archivedBoard.value : liveBoard.value
})

const { data: categoriesData, isPending: areCategoriesLoading } = useCategories(editableBoardId)
const { data: archivedCategoriesData, isPending: areArchivedCategoriesLoading } =
  useArchivedCategories()

const { mutate: updateBoard } = useUpdateBoard()
const { mutate: cloneBoard } = useCloneBoard()
const { mutate: archiveBoard } = useArchiveBoard()

const status = useBoardMutationStatus(editableBoardId)
const categoriesContainerRef = ref<HTMLElement | null>(null)

const localName = ref('')
const textareaRef = ref<HTMLTextAreaElement | null>(null)

const debouncedSave = useDebounceFn((name: string) => {
  if (!editableBoardId.value || !board.value) return

  updateBoard({
    payload: { id: editableBoardId.value, name },
    workspaceId: board.value.workspace.id,
  })
}, 500)

function onNameInput() {
  debouncedSave(localName.value)

  if (textareaRef.value) {
    textareaRef.value.style.height = 'auto'
    textareaRef.value.style.height = textareaRef.value.scrollHeight + 'px'
  }
}

const categories = computed(() => {
  if (board.value?.isDeleted) {
    return archivedCategoriesData.value || []
  } else {
    return categoriesData.value || []
  }
})

const areCurrentCategoriesLoading = computed(() => {
  return board.value?.isDeleted ? areArchivedCategoriesLoading.value : areCategoriesLoading.value
})

watch(
  board,
  (newBoard) => {
    if (newBoard) {
      localName.value = newBoard.name
      nextTick(() => {
        HSStaticMethods.autoInit()
        onNameInput()
      })
    }
  },
  { immediate: true },
)

const handleClose = () => uiStore.closeEditBoardModal()
</script>

<template>
  <div
    id="hs-board-edit"
    class="hs-overlay hidden size-full fixed top-0 start-0 z-85 pointer-events-none"
    :ref="(el) => (uiStore.editBoardModalRef = el as HTMLElement)"
  >
    <div class="size-full flex items-center justify-center p-4">
      <div
        class="flex flex-col w-full max-h-150 max-w-xl bg-white rounded-md pointer-events-auto shadow-xl"
        v-if="board"
      >
        <div class="flex justify-between items-center px-4 py-2 border-b border-gray-200">
          <div class="flex items-center gap-x-1">
            <MoveDropdown :entity="board" :type="EntityType.Board">
              <ActiveWorkspaceAvatar size="6" />
            </MoveDropdown>
          </div>

          <ActionAndCloseButtons
            :editableEntity="board"
            :isEntityCopying="status.isCloning?.value"
            :isEntityArchiving="status.isArchiving?.value"
            @copy="() => cloneBoard({ id: board!.id })"
            @archive="() => archiveBoard({ board: board! })"
            @close="handleClose"
          />
        </div>

        <!-- Body -->
        <div class="px-4 pt-4">
          <textarea
            ref="textareaRef"
            v-model="localName"
            @input="onNameInput"
            class="p-0 block w-full text-black border-none focus:ring-0 text-xl font-bold resize-none"
            placeholder="Имя доски"
            rows="1"
          ></textarea>
        </div>

        <!-- Categories List -->
        <div class="flex flex-col gap-y-2 px-4 pb-4 mt-6 overflow-hidden">
          <TitleWithBadge
            title="Категории"
            :number="categories.length"
            :isLoading="areCurrentCategoriesLoading"
          />

          <div class="overflow-y-auto flex-1 custom-scrollbar" ref="categoriesContainerRef">
            <ColumnsView
              :items="categories"
              :containerRef="categoriesContainerRef"
              v-if="!areCurrentCategoriesLoading"
            >
              <template #default="{ data }">
                <EntityCard
                  v-for="cat in data"
                  :id="cat.id"
                  :key="cat.id"
                  :name="cat.name"
                  :isStatic="false"
                  :hasCopy="true"
                  :hasDelete="true"
                  :hasSelected="false"
                  @click="uiStore.openCategoryToEdit(cat)"
                />
              </template>
            </ColumnsView>

            <TaskSkeleton v-for="i in 5" :key="`task-skeleton-${i}`" v-else></TaskSkeleton>

            <div v-if="categories.length === 0" class="text-center py-10 text-gray-400 text-sm">
              Нет категории
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
