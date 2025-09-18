<script setup lang="ts">
import { useTaskStore } from '@/stores/task'
import { useWorkspaceStore } from '@/stores/workspace'
import { HSStaticMethods } from 'preline'
import { ref, watch, nextTick } from 'vue'
import { Clock, Hash, Palette, X } from 'lucide-vue-next'
import { Calendar } from 'vanilla-calendar-pro'

const WORKSPACE_STORE = useWorkspaceStore()
const TASK_STORE = useTaskStore()

const textareaNameAutoHeight = ref<HTMLTextAreaElement | null>(null)
const textareaDescriptionAutoHeight = ref<HTMLTextAreaElement | null>(null)
const editableTask = ref<any>(null)
const calendarRef = ref<HTMLInputElement | null>(null)

function initializeTextarea(textarea: HTMLTextAreaElement | null) {
  if (textarea) {
    textarea.dispatchEvent(new Event('input'))
  }
}

watch(
  () => TASK_STORE.taskToEdit,
  (newTask) => {
    const shouldInitialize = newTask && !editableTask.value

    if (newTask) {
      editableTask.value = { ...newTask }
    } else {
      editableTask.value = null
    }

    nextTick(() => {
      if (shouldInitialize) {
        HSStaticMethods.autoInit()

        if (calendarRef.value) {
          const options = {
            locale: 'ru',
            selectionTimeMode: 24,
            styles: {
              calendar: 'p-0! min-w-0!',
              dateBtn: 'ring-0 focus:ring-0 focus:outline-0',
              date: 'vc-date size-8!',
              dates: 'gap-0!',
              week: 'vc-week mb-0!',
              weekDay: 'vc-week__day w-auto! text-xs!',
            },
            layouts: {
              default: `
                <div class="" data-vc="header" role="toolbar" aria-label="">
                  <button type="button" class="text-gray-500 hover:bg-gray-100! rounded-full size-7! flex! items-center! justify-center!" data-vc-arrow="prev" aria-label="Прошлый месяц">
                    <svg class="size-5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-left-icon lucide-chevron-left"><path d="m15 18-6-6 6-6"/></svg>
                  </button>
                  <div class="text-gray-500!" data-vc-header="content">
                    <button type="button" class="vc-month text-gray-500! hover:text-gray-600! text-sm!" data-vc="month"></button>
                    <button type="button" class="vc-year text-gray-500! hover:text-gray-600! text-sm!" data-vc="year"></button>
                  </div>
                  <button type="button" class="text-gray-500! hover:bg-gray-100! rounded-full size-7! flex! items-center! justify-center!" data-vc-arrow="next" aria-label="Следующий месяц">
                    <svg class="size-5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-right-icon lucide-chevron-right"><path d="m9 18 6-6-6-6"/></svg>
                  </button>
                </div>
                <div class="" data-vc="wrapper">
                  <#WeekNumbers />
                  <div class="" data-vc="content">
                    <#Week />
                    <#Dates />
                    <#DateRangeTooltip />
                  </div>
                </div>
              `,
            },
          }

          const calendar = new Calendar(calendarRef.value, options)
          calendar.init()
        }

        initializeTextarea(textareaNameAutoHeight.value)
        initializeTextarea(textareaDescriptionAutoHeight.value)
      }
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
        if (el) WORKSPACE_STORE.editTaskModalRef = el as HTMLElement
      }
    "
    class="hs-overlay hs-overlay-open:opacity-100 hs-overlay-open:duration-500 hidden size-full fixed top-0 start-0 z-80 opacity-0 overflow-x-hidden transition-all overflow-y-auto pointer-events-none"
    role="dialog"
    tabindex="-1"
    aria-labelledby="hs-task-edit-label"
  >
    <div class="size-full flex items-center justify-center p-4">
      <div
        class="flex flex-col w-full max-w-xl bg-white rounded-md pointer-events-auto"
        v-if="editableTask"
      >
        <!-- Header -->
        <div class="flex justify-between items-center gap-x-2 px-4 py-2 border-b border-gray-200">
          <button
            type="button"
            class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-gray-100 text-gray-500 focus:outline-hidden disabled:opacity-50 disabled:pointer-events-none"
            :class="{
              'bg-green-100 text-green-600 hover:bg-green-200': editableTask.is_completed,
              'hover:bg-gray-200': !editableTask.is_completed,
            }"
            @click.capture="editableTask.is_completed = !editableTask.is_completed"
          >
            <div class="inline-flex items-center size-4">
              <label
                class="flex items-center cursor-pointer relative transition-all"
                @click.prevent
              >
                <input
                  v-model="editableTask.is_completed"
                  type="checkbox"
                  class="peer size-4.5 focus:ring-offset-0 focus:ring-0 focus:outline-offset-0 cursor-pointer transition-all rounded-full bg-slate-100 shadow hover:shadow-md border border-slate-300 checked:bg-green-600 checked:border-green-600"
                  id="check-custom-style"
                />
                <span
                  class="absolute text-white transition-all opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-3.5 w-3.5"
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
            {{ editableTask.is_completed ? 'Выполнено' : 'Выполняется' }}
          </button>

          <button
            class="transition-colors duration-200 text-gray-500 hover:bg-gray-100 p-1 rounded-full"
            type="button"
            @click="WORKSPACE_STORE.closeEditTaskModal()"
          >
            <X class="size-5" />
          </button>
        </div>
        <!-- Header End -->

        <div class="flex items-start px-4 pt-2">
          <!-- Textarea -->
          <div class="flex items-center w-full">
            <textarea
              class="p-0 block w-full text-black border-none focus:ring-0 text-lg disabled:opacity-50 disabled:pointer-events-none resize-none overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300"
              placeholder="Имя задачи"
              data-hs-textarea-auto-height
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
          ></textarea>
          <!-- End Textarea -->
        </div>
        <!-- Description End -->

        <div class="flex items-start gap-x-2 gap-y-1 px-4 pt-2 pb-4">
          <div class="hs-dropdown [--auto-close:outside] relative inline-flex">
            <button
              id="hs-dropdown-date"
              type="button"
              class="hs-dropdown-toggle py-1 px-2 inline-flex items-center gap-x-2 text-custom-sm font-medium border border-gray-200 rounded-lg bg-gray-100 text-gray-600 shadow-2xs hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
              aria-haspopup="menu"
              aria-expanded="false"
              aria-label="Dropdown"
            >
              <div class="flex items-center gap-x-2">
                <Clock class="size-4" />
                <span>Дата</span>
              </div>
              <svg
                class="hs-dropdown-open:rotate-180 size-4"
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
              class="hs-dropdown-menu transition-[opacity,margin] duration hs-dropdown-open:opacity-100 opacity-0 hidden min-w-60 bg-white shadow-md rounded-lg mt-2 dark:bg-neutral-800 dark:border dark:border-neutral-700 dark:divide-neutral-700 after:h-4 after:absolute after:-bottom-4 after:start-0 after:w-full before:h-4 before:absolute before:-top-4 before:start-0 before:w-full"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="hs-dropdown-date"
            >
              <div class="p-2 flex flex-col gap-y-1">
                <span class="text-xs text-gray-400">Дата</span>
                <div ref="calendarRef" class="mt-1"></div>
              </div>
            </div>
          </div>

          <div class="hs-dropdown [--auto-close:outside] relative inline-flex">
            <button
              id="hs-dropdown-date"
              type="button"
              class="hs-dropdown-toggle py-1 px-2 inline-flex items-center gap-x-2 text-custom-sm font-medium border border-gray-200 rounded-lg bg-gray-100 text-gray-600 shadow-2xs hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
              aria-haspopup="menu"
              aria-expanded="false"
              aria-label="Dropdown"
            >
              <div class="flex items-center gap-x-2">
                <Hash class="size-4" />
                <span>Теги</span>
              </div>
              <svg
                class="hs-dropdown-open:rotate-180 size-4"
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
              class="hs-dropdown-menu transition-[opacity,margin] duration hs-dropdown-open:opacity-100 opacity-0 hidden min-w-60 bg-white shadow-md rounded-lg mt-2 dark:bg-neutral-800 dark:border dark:border-neutral-700 dark:divide-neutral-700 after:h-4 after:absolute after:-bottom-4 after:start-0 after:w-full before:h-4 before:absolute before:-top-4 before:start-0 before:w-full"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="hs-dropdown-date"
            >
              <div class="p-1 space-y-0.5">
                <a
                  class="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300 dark:focus:bg-neutral-700"
                  href="#"
                >
                  Newsletter
                </a>
                <a
                  class="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300 dark:focus:bg-neutral-700"
                  href="#"
                >
                  Purchases
                </a>
                <a
                  class="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300 dark:focus:bg-neutral-700"
                  href="#"
                >
                  Downloads
                </a>
                <a
                  class="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300 dark:focus:bg-neutral-700"
                  href="#"
                >
                  Team Account
                </a>
              </div>
            </div>
          </div>

          <div class="hs-dropdown [--auto-close:inside] relative inline-flex">
            <button
              id="hs-dropdown-date"
              type="button"
              class="hs-dropdown-toggle py-1 px-2 inline-flex items-center gap-x-2 text-custom-sm font-medium border border-gray-200 rounded-lg bg-gray-100 text-gray-600 shadow-2xs hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
              aria-haspopup="menu"
              aria-expanded="false"
              aria-label="Dropdown"
            >
              <div class="flex items-center gap-x-2">
                <Palette class="size-4" />
                <span>Цвет</span>
              </div>
              <svg
                class="hs-dropdown-open:rotate-180 size-4"
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
              class="hs-dropdown-menu transition-[opacity,margin] duration hs-dropdown-open:opacity-100 opacity-0 hidden min-w-60 bg-white shadow-md rounded-lg mt-2 dark:bg-neutral-800 dark:border dark:border-neutral-700 dark:divide-neutral-700 after:h-4 after:absolute after:-bottom-4 after:start-0 after:w-full before:h-4 before:absolute before:-top-4 before:start-0 before:w-full"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="hs-dropdown-date"
            >
              <div class="p-1 space-y-0.5">
                <a
                  class="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300 dark:focus:bg-neutral-700"
                  href="#"
                >
                  Newsletter
                </a>
                <a
                  class="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300 dark:focus:bg-neutral-700"
                  href="#"
                >
                  Purchases
                </a>
                <a
                  class="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300 dark:focus:bg-neutral-700"
                  href="#"
                >
                  Downloads
                </a>
                <a
                  class="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300 dark:focus:bg-neutral-700"
                  href="#"
                >
                  Team Account
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
