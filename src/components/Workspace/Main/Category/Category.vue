<script setup lang="ts">
import ButtonCreate from '@components/Buttons/ButtonCreate.vue'
import Options from '@components/Options/Options.vue'
import Task from '../Task/Task.vue'
import { useCategoryDataStore } from '@stores/categoryData'
import { useWorkspaceDataStore } from '@stores/workspaceData'
import { useTaskDataStore } from '@stores/taskData'
import { SquarePen } from 'lucide-vue-next'
import { computed, nextTick, ref } from 'vue'
import Spinner from '@/components/Loader/Spinner.vue'
import { Nullable } from '@/types/utils'
import { ICategoryState } from '@/stores/interfaces/ICategoryState'

const props = defineProps<{
  category: ICategoryState
}>()

defineEmits<{
  (e: 'connectInputEditRef', el: HTMLInputElement): void
}>()

const CATEGORY_STORE = useCategoryDataStore()
const WORKSPACE_STORE = useWorkspaceDataStore()
const TASK_STORE = useTaskDataStore()

const isInputVisible = ref(false)
const inputRef = ref<Nullable<HTMLInputElement>>(null)
const newTaskInputElement = ref<HTMLInputElement | null>(null)

function showInput() {
  isInputVisible.value = true

  nextTick(() => {
    if (inputRef.value) {
      inputRef.value.focus()
    }
  })
}

function updateCategoryName(event: Event) {
  const target = event.target as HTMLInputElement
  const newName = target.value.trim()

  if (newName) {
    CATEGORY_STORE.updateCategory(
      { ...props.category, name: newName },
      props.category.boardId,
      WORKSPACE_STORE.getActiveWorkspaceId,
    )
  }

  isInputVisible.value = false
}

function connectInputEditRef(el: HTMLInputElement) {
  newTaskInputElement.value = el

  nextTick(() => {
    if (newTaskInputElement.value) {
      newTaskInputElement.value.focus()
    }
  })
}

function createOrSplice(category: ICategoryState, target: HTMLInputElement, isEnterKey = false) {
  if (isLoading.value) return

  CATEGORY_STORE.createOrSplice(category, target)

  if (isEnterKey) {
    nextTick(() => {
      CATEGORY_STORE.addCategoryToStore(category.boardId)
    })
  }
}

function getIsInputVisible(category: ICategoryState) {
  return (isInputVisible.value || category.isNew) && !isLoading.value
}

const isLoading = computed(() => {
  return CATEGORY_STORE.isCategoryProcessing(props.category.id)
})

const isCategoryAdding = computed(() => {
  return CATEGORY_STORE.isCategoryAdding(props.category.id)
})
</script>

<template>
  <div
    class="bg-gray-100 flex flex-col shrink-0 gap-y-3 py-3 px-4 rounded-md h-full w-70 sm:w-75 group/category"
  >
    <!-- Header -->
    <div class="flex w-full justify-between items-center">
      <div
        class="flex gap-x-2 items-center h-8 min-w-0 text-sm text-gray-800 cursor-pointer transition-colors duration-100 group"
        @click="showInput"
        v-show="!getIsInputVisible(category)"
      >
        <div class="flex items-center justify-center" v-if="isLoading">
          <Spinner class="size-3.5 text-gray-600" />
        </div>
        <span class="font-semibold group-hover:text-gray-600 truncate">{{ category.name }}</span>
        <SquarePen
          class="size-3.5 shrink-0 text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        />
      </div>
      <div class="h-8 grow-1 relative" v-if="getIsInputVisible(category)">
        <input
          type="text"
          class="text-sm h-full font-semibold p-0 text-gray-800 bg-transparent border-none focus:outline-none focus:ring-0 transition-colors duration-100"
          :value="category.name"
          @blur="createOrSplice(category, $event.target as HTMLInputElement)"
          @keydown.enter="createOrSplice(category, $event.target as HTMLInputElement, true)"
          :disabled="isCategoryAdding"
          :ref="
            (el: any) => {
              $emit('connectInputEditRef', el)
            }
          "
          placeholder="Название категории"
          v-if="category.isNew"
        />
        <input
          type="text"
          class="text-sm h-full font-semibold p-0 text-gray-800 bg-transparent border-none focus:outline-none focus:ring-0 transition-colors duration-100"
          :value="category.name"
          @change="updateCategoryName"
          @blur="isInputVisible = false"
          placeholder="Название категории"
          ref="inputRef"
          v-else
        />
        <div class="shrink-0 absolute -bottom-[2px] w-full left-0">
          <div class="h-[2px] bg-blue-500 w-full animation-grow"></div>
        </div>
      </div>

      <Options
        :options="{
          edit: false,
          copy: true,
          move: true,
          favorite: false,
          archive: true,
        }"
        :item="category"
        :edit_type="'category'"
        :is_always_visible="true"
        group_name="category"
        class="text-gray-600"
      />
    </div>

    <!-- Tasks -->
    <div class="flex flex-col min-h-0 gap-y-2 mb-3">
      <ButtonCreate
        :disabled="isLoading"
        text="Добавить задачу"
        @click="TASK_STORE.addTaskToStore(category.id)"
      />
      <div
        class="flex grow-1 flex-col pb-2 gap-y-2 overflow-y-auto pr-1 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300"
      >
        <Task
          v-for="task in TASK_STORE.getTasksByCategoryId(category.id)"
          :key="task.id"
          :task="task"
          @updateTask="TASK_STORE.updateTask($event, category.boardId)"
          @connectInputEditRef="connectInputEditRef"
          :isEditable="true"
          :hasCopy="true"
          :hasDelete="true"
        />
      </div>
    </div>
  </div>
</template>
