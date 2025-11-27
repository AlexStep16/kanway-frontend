<script setup lang="ts">
import { useTaskDataStore } from '@/stores/taskData'
import { useUIStore } from '@/stores/ui'
import { HSStaticMethods } from 'preline'
import { ref, watch, nextTick, computed } from 'vue'
import MoveDropdown from '@components/Workspace/Main/MoveDropdown/MoveDropdown.vue'
import MoveDropdownButton from '@components/Workspace/Main/MoveDropdown/MoveDropdownButton.vue'
import Date from '@components/Workspace/Main/Task/Edit/Date.vue'
import Tags from '@components/Workspace/Main/Task/Edit/Tags.vue'
import Color from '@components/Workspace/Main/Task/Edit/Color.vue'
import { toast } from 'vue-sonner'
import { TaskModel } from '@models/TaskModel'
import { useWorkspaceDataStore } from '@stores/workspaceData'
import { TASK_COLORS } from '@/constants/TASK_COLORS'
import { COLOR_NAMES } from '@/constants/COLOR_NAMES_MAP'
import { Nullable } from '@/types/utils'
import { ITaskState } from '@stores/interfaces/ITaskState'
import { IWorkspace } from '@interfaces/domain/IWorkspace'
import { Layers } from 'lucide-vue-next'

import _ from 'lodash'
import ActionAndCloseButtons from '../../EditEntity/ActionAndCloseButtons.vue'

const UI_STORE = useUIStore()
const TASK_STORE = useTaskDataStore()
const WORKSPACE_STORE = useWorkspaceDataStore()

const activeWorkspace = computed(() => WORKSPACE_STORE.getActiveWorkspace as IWorkspace)

const textareaNameAutoHeight = ref<Nullable<HTMLTextAreaElement>>(null)
const textareaDescriptionAutoHeight = ref<Nullable<HTMLTextAreaElement>>(null)
const editableTask = ref<Nullable<TaskModel>>(null)
const dateComponentRef = ref<Nullable<typeof Date>>(null)
const taskUpdatesCounter = ref(0)

const updateNameTimeout = ref<Nullable<number>>(null)
const updateDescriptionTimeout = ref<Nullable<number>>(null)

function initializeTextarea(textarea: Nullable<HTMLTextAreaElement>) {
  if (textarea) {
    textarea.dispatchEvent(new Event('input'))
  }
}

function initializeDate() {
  if (dateComponentRef.value && editableTask.value) {
    dateComponentRef.value.initializeDate()
  }
}

function handleChangeTime(time: string) {
  if (!editableTask.value) return

  if (time === '') {
    editableTask.value.dueHours = null
    editableTask.value.dueMinutes = null
    return
  }

  const [hours, minutes] = time.split(':').map((part) => parseInt(part, 10))

  editableTask.value.dueHours = hours
  editableTask.value.dueMinutes = minutes

  updateTask({
    dueDate: editableTask.value.dueDate,
    dueHours: editableTask.value.dueHours,
    dueMinutes: editableTask.value.dueMinutes,
  })
}

function handleChangeDate(date: string) {
  if (!editableTask.value) return

  editableTask.value.dueDate = date

  updateTask({
    dueDate: editableTask.value.dueDate,
  })
}

function handleClearTime() {
  if (!editableTask.value) return

  editableTask.value.dueHours = null
  editableTask.value.dueMinutes = null

  updateTask({
    dueDate: editableTask.value.dueDate,
    dueHours: editableTask.value.dueHours,
    dueMinutes: editableTask.value.dueMinutes,
  })
}

function handleClearDue() {
  if (!editableTask.value) return

  editableTask.value.dueDate = null
  editableTask.value.dueHours = null
  editableTask.value.dueMinutes = null

  updateTask({
    dueDate: editableTask.value.dueDate,
    dueHours: editableTask.value.dueHours,
    dueMinutes: editableTask.value.dueMinutes,
  })
}

function handleRemoveTag(index: number) {
  if (!editableTask.value) return

  editableTask.value.tags.splice(index, 1)

  updateTask({
    tags: editableTask.value.tags,
  })
}

function handleAddTag(tag: string) {
  if (!editableTask.value) return

  if (!editableTask.value.tags.includes(tag)) {
    editableTask.value.tags.push(tag)

    updateTask({
      tags: editableTask.value.tags,
    })
  } else {
    toast.info('Этот тег уже существует.')
  }
}

function handleSetColor(
  color: Nullable<(typeof TASK_COLORS)[number]>,
  colorName: Nullable<(typeof COLOR_NAMES)[number]>,
) {
  if (!editableTask.value) return

  editableTask.value.colorName = colorName
  editableTask.value.color = color

  updateTask({
    colorName: editableTask.value.colorName,
    color: editableTask.value.color,
  })
}

function handleClearColor() {
  if (!editableTask.value) return

  editableTask.value.colorName = null
  editableTask.value.color = null

  updateTask({
    colorName: editableTask.value.colorName,
    color: editableTask.value.color,
  })
}

function handleMoveTask(taskId: string, newCategoryId: string) {
  TASK_STORE.moveTask(taskId, newCategoryId, activeWorkspace.value.id)
}

function updateTask(payload: Partial<TaskModel>) {
  if (!editableTask.value) return

  TASK_STORE.updateTask(
    {
      id: editableTask.value.id,
      ...payload,
    },
    editableTask.value.boardId,
    true,
  )
}

function nameInput() {
  if (updateNameTimeout.value) {
    clearTimeout(updateNameTimeout.value)
  }

  updateNameTimeout.value = window.setTimeout(() => {
    if (!editableTask.value || !editableTask.value.name) return

    updateTask({
      name: editableTask.value.name,
    })

    updateNameTimeout.value = null
  }, 500)
}

function descriptionInput() {
  if (updateDescriptionTimeout.value) {
    clearTimeout(updateDescriptionTimeout.value)
  }

  updateDescriptionTimeout.value = window.setTimeout(() => {
    if (!editableTask.value || !editableTask.value.description) return

    updateTask({
      description: editableTask.value.description,
    })

    updateDescriptionTimeout.value = null
  }, 500)
}

async function copyTask(task: ITaskState) {
  await TASK_STORE.cloneTask(task)

  UI_STORE.closeEditTaskModal()
}

async function archiveTask(task: ITaskState) {
  await TASK_STORE.archiveTask(task)

  UI_STORE.closeEditTaskModal()
}

const isTaskCopying = computed(() => {
  if (!editableTask.value) return false

  return TASK_STORE.isTaskCloning(editableTask.value.id)
})

const isTaskArchiving = computed(() => {
  if (!editableTask.value) return false

  return TASK_STORE.isTaskArchiving(editableTask.value.id)
})

watch(
  () => editableTask.value?.isCompleted,
  (val) => {
    if (val === undefined || !editableTask.value) return

    updateTask({
      isCompleted: val,
    })
  },
)

watch(
  () => TASK_STORE.taskToEdit,
  (newTask) => {
    const shouldInitialize = newTask && !editableTask.value
    taskUpdatesCounter.value += 1

    if (newTask) {
      editableTask.value = _.cloneDeep(newTask)
    } else {
      editableTask.value = null
    }

    nextTick(() => {
      if (shouldInitialize) {
        HSStaticMethods.autoInit()

        initializeDate()
      }

      initializeTextarea(textareaNameAutoHeight.value)
      initializeTextarea(textareaDescriptionAutoHeight.value)
    })
  },
  { deep: true, immediate: true },
)
</script>

<template>
  <div
    id="hs-task-edit"
    :ref="
      (el) => {
        if (el) UI_STORE.editTaskModalRef = el as HTMLElement
      }
    "
    class="hs-overlay [--overlay-backdrop:static] hs-overlay-open:opacity-100 hs-overlay-open:duration-500 hidden size-full fixed top-0 start-0 z-90 opacity-0 overflow-x-hidden transition-all overflow-y-auto pointer-events-none"
    role="dialog"
    tabindex="-1"
    aria-labelledby="hs-task-edit-label"
  >
    <div class="size-full flex items-center justify-center p-2 sm:p-4">
      <div
        class="flex flex-col w-full max-w-xl bg-white rounded-md pointer-events-auto"
        v-if="editableTask"
      >
        <!-- Header -->
        <div class="flex justify-between items-center gap-x-2 px-4 py-2 border-b border-gray-200">
          <div class="flex items-center gap-x-1 min-w-0">
            <button
              type="button"
              class="py-1.5 px-2 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-gray-100 transition-colors duration-100 text-gray-500 focus:outline-hidden disabled:opacity-50 disabled:pointer-events-none"
              :class="{
                'bg-green-100 text-green-600 hover:bg-green-200': editableTask.isCompleted,
                'hover:bg-gray-200': !editableTask.isCompleted,
              }"
              @click.capture="editableTask.isCompleted = !editableTask.isCompleted"
            >
              <div class="inline-flex items-center size-4">
                <label
                  class="flex items-center cursor-pointer relative transition-all"
                  @click.prevent
                >
                  <input
                    v-model="editableTask.isCompleted"
                    type="checkbox"
                    class="peer size-4.5 focus:ring-offset-0 focus:ring-0 focus:outline-offset-0 cursor-pointer transition-all rounded-full bg-slate-100 shadow hover:shadow-md border border-slate-300 checked:bg-green-600 checked:border-green-600"
                    id="check-custom-style"
                  />
                  <span
                    class="absolute text-white transition-all opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="size-3"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      stroke="currentColor"
                      stroke-width="1"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                  </span>
                </label>
              </div>
              {{ editableTask.isCompleted ? 'Выполнено' : 'Выполняется' }}
            </button>

            <MoveDropdown
              :entity="editableTask"
              :type="0"
              @moveTask="handleMoveTask"
              :key="taskUpdatesCounter"
              v-if="!editableTask.isDeleted"
            >
              <Layers class="size-4 shrink-0" />
            </MoveDropdown>

            <MoveDropdownButton :title="editableTask.categoryName" :disabled="true" v-else>
              <Layers class="size-4 shrink-0" />
            </MoveDropdownButton>
          </div>

          <ActionAndCloseButtons
            :editableEntity="editableTask"
            :isEntityCopying="isTaskCopying"
            :isEntityArchiving="isTaskArchiving"
            @copy="copyTask"
            @archive="archiveTask"
            @close="UI_STORE.closeEditTaskModal()"
          />
        </div>
        <!-- Header End -->

        <div class="flex items-start px-4 pt-2">
          <!-- Textarea -->
          <div class="flex items-center w-full">
            <textarea
              class="p-0 block w-full text-black border-none focus:ring-0 text-lg disabled:opacity-50 disabled:pointer-events-none resize-none overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300"
              placeholder="Имя задачи"
              data-hs-textarea-auto-height
              @input="nameInput"
              ref="textareaNameAutoHeight"
              rows="1"
              v-model="editableTask.name"
            ></textarea>
          </div>
          <!-- End Textarea -->
        </div>

        <!-- Description -->
        <div class="px-4 pt-1">
          <!-- Textarea -->
          <textarea
            class="p-0 block w-full border-none resize-none text-sm focus:outline-0 focus:ring-0 disabled:opacity-50 disabled:pointer-events-none"
            placeholder="Описание задачи"
            data-hs-textarea-auto-height
            ref="textareaDescriptionAutoHeight"
            rows="2"
            v-model="editableTask.description"
            @input="descriptionInput"
          ></textarea>
          <!-- End Textarea -->
        </div>

        <div class="flex flex-wrap text-custom-sm text-gray-500 space-x-1 px-4">
          <span v-for="tag in editableTask.tags" :key="tag + editableTask.id">#{{ tag }}</span>
        </div>
        <!-- Description End -->

        <div
          class="flex items-start flex-wrap gap-x-2 gap-y-1 px-4 pt-3 pb-4"
          :class="{ 'pt-2': !editableTask.tags?.length }"
        >
          <Date
            :task="editableTask"
            @changeTime="handleChangeTime"
            @clearTaskTime="handleClearTime"
            @clearTaskDue="handleClearDue"
            @changeDate="handleChangeDate"
            ref="dateComponentRef"
          />
          <Tags :task="editableTask" @removeTag="handleRemoveTag" @addTag="handleAddTag" />
          <Color :task="editableTask" @setColor="handleSetColor" @clearColor="handleClearColor" />
        </div>
      </div>
    </div>
  </div>
</template>
