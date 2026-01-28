<script setup lang="ts">
import { useUIStore } from '@stores/ui'
import ActionAndCloseButtons from '@components/Workspace/Main/EditEntity/ActionAndCloseButtons.vue'
import MoveDropdown from '@components/Workspace/Main/MoveDropdown/MoveDropdown.vue'
import MoveDropdownButton from '@components/Workspace/Main/MoveDropdown/MoveDropdownButton.vue'
import { computed, nextTick, watch } from 'vue'
import { ref } from 'vue'
import { Nullable } from '@/types/utils'
import { HSStaticMethods } from 'preline'
import Task from '@components/Workspace/Main/Task/Task.vue'
import TaskSkeleton from '@components/Workspace/Main/Task/TaskSkeleton.vue'
import ColumnsView from '@components/Workspace/Main/ColumnsView.vue'
import { SquareKanban } from 'lucide-vue-next'
import TitleWithBadge from '@components/Workspace/Main/TitleWithBadge.vue'
import TitleWithBadgeSkeleton from '@components/Workspace/Main/TitleWithBadgeSkeleton.vue'
import { useUpdateCategory } from '@/composables/categories/mutations/useUpdateCategory'
import { useArchiveCategory } from '@/composables/categories/mutations/useArchiveCategory'
import { useCloneCategory } from '@/composables/categories/mutations/useCloneCategory'
import { useCategory } from '@/composables/categories/useCategory'
import { storeToRefs } from 'pinia'
import { useCategoryMutationStatus } from '@/composables/categories/mutations/useCategoryMutationStatus'
import { useMoveCategory } from '@/composables/categories/mutations/useMoveCategory'
import { useDebounceFn } from '@vueuse/core'
import { EntityType } from '@/enums/EntityType'
import { useTasks } from '@/composables/tasks/queries/useTasks'

const uiStore = useUIStore()

const { mutate: updateCategory } = useUpdateCategory()
const { mutate: archiveCategory } = useArchiveCategory()
const { mutate: cloneCategory } = useCloneCategory()
const { mutate: moveCategory } = useMoveCategory()

const { editableCategoryId, editableCategoryBoardId } = storeToRefs(uiStore)

const category = useCategory(editableCategoryId, editableCategoryBoardId)
const { data: allTasks, isPending: isTasksLoading } = useTasks(editableCategoryBoardId)

const status = useCategoryMutationStatus(editableCategoryId)

const localCategoryId = ref<string | null>(null)
const name = ref<string>('')
const textareaNameRef = ref<Nullable<HTMLTextAreaElement>>(null)
const tasksContainerRef = ref<HTMLElement | null>(null)

function nameInput() {
  if (!name.value || !category.value) return

  updateCategory({
    payload: { id: category.value.id, name: name.value },
    boardId: category.value.board.id,
  })
}

const debouncedNameInput = useDebounceFn(() => {
  nameInput()
}, 500)

function initializeTextarea(textarea: Nullable<HTMLTextAreaElement>) {
  if (textarea) {
    textarea.dispatchEvent(new Event('input'))
  }
}

function handleMoveCategory(data: { newBoardId: string; newWorkspaceId: string }) {
  if (!category.value) return

  moveCategory({
    payload: category.value,
    oldBoardId: category.value.board.id,
    newBoardId: data.newBoardId,
    oldWorkspaceId: category.value.workspace.id,
    newWorkspaceId: data.newWorkspaceId,
  })
}

function handleCopy() {
  if (!category.value) return

  cloneCategory({
    id: category.value.id,
  })
}

function handleArchive() {
  if (!category.value) return

  archiveCategory({
    category: category.value,
  })
}

const tasks = computed(() => {
  return (allTasks.value || []).filter((task) => task.category.id === category.value?.id)
})

watch(
  () => category.value,
  (newCategory) => {
    if (newCategory && newCategory.id === localCategoryId.value) return

    const shouldInitialize = newCategory && !localCategoryId.value

    if (newCategory) {
      localCategoryId.value = newCategory.id
      name.value = newCategory.name
    } else {
      localCategoryId.value = null
      name.value = ''
    }

    nextTick(() => {
      if (shouldInitialize) {
        HSStaticMethods.autoInit()
      }

      initializeTextarea(textareaNameRef.value)
    })
  },
  { immediate: true },
)
</script>

<template>
  <div
    id="hs-category-edit"
    :ref="
      (el) => {
        if (el) uiStore.editCategoryModalRef = el as HTMLElement
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
        v-if="category"
      >
        <!-- Header -->
        <div class="flex justify-between items-center gap-x-2 px-4 py-2 border-b border-gray-200">
          <div class="flex items-center gap-x-1 min-w-0">
            <MoveDropdown
              :entity="category"
              :type="EntityType.Category"
              @move="handleMoveCategory"
              v-if="!category.isDeleted"
            >
              <SquareKanban class="size-4 shrink-0" />
            </MoveDropdown>

            <MoveDropdownButton :title="category.board.name" :disabled="true" v-else>
              <SquareKanban class="size-4 shrink-0" />
            </MoveDropdownButton>
          </div>

          <ActionAndCloseButtons
            :editableEntity="category"
            :isEntityCopying="status.isCloning?.value"
            :isEntityArchiving="status.isArchiving?.value"
            @copy="handleCopy"
            @archive="handleArchive"
            @close="uiStore.closeEditCategoryModal()"
          />
        </div>
        <!-- Header End -->

        <div class="flex items-start px-4 pt-2">
          <!-- Textarea -->
          <div class="flex items-center w-full">
            <textarea
              class="p-0 block w-full text-black border-none focus:ring-0 text-lg disabled:opacity-50 disabled:pointer-events-none resize-none overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300"
              placeholder="Имя категории"
              data-hs-textarea-auto-height
              @input="debouncedNameInput"
              ref="textareaNameAutoHeight"
              rows="1"
              v-model="name"
            ></textarea>
          </div>
          <!-- End Textarea -->
        </div>

        <div class="flex flex-col gap-y-2 px-4 pb-4 mt-4 items-start overflow-hidden">
          <TitleWithBadge title="Задачи" :number="tasks.length" v-if="!isTasksLoading" />
          <TitleWithBadgeSkeleton v-else />

          <div
            class="flex gap-2 pb-2 flex-wrap w-full min-h-0 overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300"
            ref="tasksContainerRef"
            v-if="tasks.length > 0"
          >
            <ColumnsView :items="tasks" :containerRef="tasksContainerRef" v-if="!isTasksLoading">
              <template v-slot:default="slotProps">
                <Task
                  v-for="task in slotProps.data"
                  :key="task.id"
                  :task="task"
                  :hasCopy="true"
                  :hasBorder="true"
                  :hasDelete="true"
                />
              </template>
            </ColumnsView>

            <TaskSkeleton v-for="i in 5" :key="`task-skeleton-${i}`" v-else></TaskSkeleton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
