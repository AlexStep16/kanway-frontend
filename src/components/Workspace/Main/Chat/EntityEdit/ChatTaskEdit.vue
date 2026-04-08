<script setup lang="ts">
import { getColorByNameAndTone } from '@/utils/getColorByNameAndTone'
import { computed } from 'vue'
import CategoryChange from './Changes/CategoryChange.vue'
import BoardChange from './Changes/BoardChange.vue'
import WorkspaceChange from './Changes/WorkspaceChange.vue'
import StatusChange from './Changes/StatusChange.vue'
import NameChange from './Changes/NameChange.vue'
import SelectCheckbox from '../SelectCheckbox.vue'
import DescriptionChange from './Changes/DescriptionChange.vue'
import TaskColorChange from './Changes/TaskColorChange.vue'
import TagsChange from './Changes/TagsChange.vue'
import DueDateChange from './Changes/DueDateChange.vue'
import { BeforeAfterTask } from '../Tasks/ChatTasksEditView.vue'
import { useUIStore } from '@/stores/ui'
import { useTask } from '@/composables/tasks/queries/useTask'

const props = defineProps<{
  before: BeforeAfterTask
  after: BeforeAfterTask
  isSelectable: boolean
}>()

const selectedIds = defineModel('selectedIds', {
  type: Array as () => string[],
  default: () => [],
})

const uiStore = useUIStore()
const { data: realTask } = useTask(props.after.id, props.after.board.id)

const baseBlockBeforeClasses = 'text-red-500 bg-red-200 py-1 px-2 self-start rounded-sm'
const baseBlockAfterClasses = 'text-green-600 bg-green-200 py-1 px-2 self-start rounded-sm'

function handleToggleSelect(id: string) {
  if (selectedIds.value.includes(id)) {
    selectedIds.value = selectedIds.value.filter((selectedId) => selectedId !== id)
  } else {
    selectedIds.value.push(id)
  }
}

function handleEdit() {
  if (!realTask.value) return

  uiStore.openTaskToEdit(realTask.value)
}

const isSelected = computed(() => selectedIds.value.includes(props.after.id || props.before.id))
</script>

<template>
  <div
    class="flex flex-col shrink-0 shadow-sm rounded-md min-w-60 cursor-pointer border border-gray-200 hover:shadow-md hover:shadow-gray-300 max-w-75 w-full shadow-gray-200 bg-white transition-shadow duration-100 overflow-hidden select-none"
    @click="handleEdit"
  >
    <div
      class="h-3 w-full"
      v-if="after.color"
      :style="{ backgroundColor: getColorByNameAndTone(after.color.value, after.color.tone) }"
    />
    <div class="flex flex-col gap-y-2 p-3 group/task relative">
      <!-- Info -->
      <div class="flex items-center flex-wrap gap-1">
        <CategoryChange
          :beforeСategory="before.category"
          :afterСategory="after.category"
          :baseBlockBeforeClasses="baseBlockBeforeClasses"
          :baseBlockAfterClasses="baseBlockAfterClasses"
        />

        <BoardChange
          :beforeBoard="before.board"
          :afterBoard="after.board"
          :baseBlockBeforeClasses="baseBlockBeforeClasses"
          :baseBlockAfterClasses="baseBlockAfterClasses"
        />

        <WorkspaceChange
          :beforeWorkspace="before.workspace"
          :afterWorkspace="after.workspace"
          :baseBlockBeforeClasses="baseBlockBeforeClasses"
          :baseBlockAfterClasses="baseBlockAfterClasses"
        />
      </div>
      <!-- Статус -->
      <StatusChange
        :before="before"
        :after="after"
        :baseBlockBeforeClasses="baseBlockBeforeClasses"
        :baseBlockAfterClasses="baseBlockAfterClasses"
      />
      <div class="flex items-start justify-between gap-x-2">
        <NameChange
          :before="before"
          :after="after"
          :baseBlockBeforeClasses="baseBlockBeforeClasses"
          :baseBlockAfterClasses="baseBlockAfterClasses"
        />
        <SelectCheckbox
          :is-checked="isSelected"
          @toggle-select="handleToggleSelect(props.after.id || props.before.id)"
          v-if="isSelectable && selectedIds"
        />
      </div>
      <!-- Описание -->
      <DescriptionChange
        :before="before"
        :after="after"
        :baseBlockBeforeClasses="baseBlockBeforeClasses"
        :baseBlockAfterClasses="baseBlockAfterClasses"
      />
      <!-- Цвет -->
      <TaskColorChange
        :before="before"
        :after="after"
        :baseBlockBeforeClasses="baseBlockBeforeClasses"
        :baseBlockAfterClasses="baseBlockAfterClasses"
      />
      <!-- Теги -->
      <TagsChange
        :before="before"
        :after="after"
        :baseBlockBeforeClasses="baseBlockBeforeClasses"
        :baseBlockAfterClasses="baseBlockAfterClasses"
      />
      <!-- Дата выполнения -->
      <DueDateChange
        :before="before"
        :after="after"
        :baseBlockBeforeClasses="baseBlockBeforeClasses"
        :baseBlockAfterClasses="baseBlockAfterClasses"
      />
      <slot />
    </div>
  </div>
</template>
