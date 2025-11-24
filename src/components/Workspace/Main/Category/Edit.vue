<script setup lang="ts">
import { useUIStore } from '@stores/ui'
import ActionAndCloseButtons from '@components/Workspace/Main/EditEntity/ActionAndCloseButtons.vue'
import { ICategoryState } from '@stores/interfaces/ICategoryState'
import MoveDropdown from '@components/Workspace/Main/MoveDropdown/MoveDropdown.vue'
import MoveDropdownButton from '@components/Workspace/Main/MoveDropdown/MoveDropdownButton.vue'
import { useCategoryDataStore } from '@stores/categoryData'
import { computed, nextTick, watch } from 'vue'
import { ref } from 'vue'
import { Nullable } from '@/types/utils'
import { HSStaticMethods } from 'preline'
import _ from 'lodash'
import { ISingleUpdate } from '@interfaces/domain/ISingleUpdate'
import { useTaskDataStore } from '@stores/taskData'
import Task from '@components/Workspace/Main/Task/Task.vue'
import ColumnsView from '@components/Workspace/Main/ColumnsView.vue'

const TASK_STORE = useTaskDataStore()
const CATEGORY_STORE = useCategoryDataStore()
const UI_STORE = useUIStore()

const editableCategory = ref<Nullable<ICategoryState>>(null)
const textareaNameAutoHeight = ref<Nullable<HTMLTextAreaElement>>(null)
const updateNameTimeout = ref<Nullable<number>>(null)
const tasksContainerRef = ref<HTMLElement | null>(null)

function handleMoveCategory() {}
function copyCategory() {}
function archiveCategory() {}
function updateCategory(updatedFields: ISingleUpdate<ICategoryState>) {
  if (!editableCategory.value) return

  CATEGORY_STORE.updateCategory(
    updatedFields,
    editableCategory.value.boardId,
    editableCategory.value.workspaceId,
  )
}

function nameInput() {
  if (updateNameTimeout.value) {
    clearTimeout(updateNameTimeout.value)
  }

  updateNameTimeout.value = window.setTimeout(() => {
    if (!editableCategory.value || !editableCategory.value.name) return

    updateCategory({
      id: editableCategory.value.id,
      name: editableCategory.value.name,
    })

    updateNameTimeout.value = null
  }, 500)
}

const isCategoryCopying = computed(() => {
  if (!editableCategory.value) return false

  return CATEGORY_STORE.isCategoryCloning(editableCategory.value.id)
})

const isCategoryArchiving = computed(() => {
  if (!editableCategory.value) return false

  return CATEGORY_STORE.isCategoryArchiving(editableCategory.value.id)
})

function initializeTextarea(textarea: Nullable<HTMLTextAreaElement>) {
  if (textarea) {
    textarea.dispatchEvent(new Event('input'))
  }
}

watch(
  () => CATEGORY_STORE.categoryToEdit,
  (newCategory) => {
    const shouldInitialize = newCategory && !editableCategory.value

    if (newCategory) {
      editableCategory.value = _.cloneDeep(newCategory)
    } else {
      editableCategory.value = null
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
    id="hs-category-edit"
    :ref="
      (el) => {
        if (el) UI_STORE.editCategoryModalRef = el as HTMLElement
      }
    "
    class="hs-overlay hs-overlay-open:opacity-100 hs-overlay-open:duration-500 hidden size-full fixed top-0 start-0 z-85 opacity-0 overflow-x-hidden transition-all overflow-y-auto pointer-events-none"
    role="dialog"
    tabindex="-1"
    aria-labelledby="hs-category-edit-label"
    data-hs-overlay-options='{
      "isClosePrev": false
    }'
  >
    <div class="size-full flex items-center justify-center p-2 sm:p-4">
      <div
        class="flex flex-col w-full max-h-150 max-w-xl bg-white rounded-md pointer-events-auto"
        v-if="editableCategory"
      >
        <!-- Header -->
        <div class="flex justify-between items-center gap-x-2 px-4 py-2 border-b border-gray-200">
          <div class="flex items-center gap-x-1 min-w-0">
            <MoveDropdown
              :entity="editableCategory"
              :type="1"
              @moveCategory="handleMoveCategory"
              v-if="!editableCategory.isDeleted"
            />

            <MoveDropdownButton :title="editableCategory.boardName" :disabled="true" v-else />
          </div>

          <ActionAndCloseButtons
            :editableEntity="editableCategory"
            :isEntityCopying="isCategoryCopying"
            :isEntityArchiving="isCategoryArchiving"
            @copy="copyCategory"
            @archive="archiveCategory"
            @close="UI_STORE.closeEditCategoryModal()"
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
              @input="nameInput"
              ref="textareaNameAutoHeight"
              rows="1"
              v-model="editableCategory.name"
            ></textarea>
          </div>
          <!-- End Textarea -->
        </div>

        <div class="flex flex-col gap-y-2 px-4 pb-4 mt-4 items-start overflow-hidden">
          <span class="text-sm text-gray-400">Задачи</span>
          <div
            class="flex gap-2 flex-wrap w-full min-h-0 overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300"
            ref="tasksContainerRef"
          >
            <ColumnsView
              :items="TASK_STORE.getTasksByCategoryId(editableCategory.id)"
              :containerRef="tasksContainerRef"
            >
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
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
