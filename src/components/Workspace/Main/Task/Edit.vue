<script setup lang="ts">
import { useTaskStore } from '@/stores/task'
import { useWorkspaceStore } from '@/stores/workspace'
import { HSDropdown, HSStaticMethods } from 'preline'
import { ref, watch, nextTick, onUnmounted } from 'vue'
import { Clock, Hash, Palette, X, CircleOff, Layers } from 'lucide-vue-next'
import { datepickerOptions } from '@/helpers/datepickerOptions'
import ButtonCreate from '@/components/Buttons/ButtonCreate.vue'

const WORKSPACE_STORE = useWorkspaceStore()
const TASK_STORE = useTaskStore()

const textareaNameAutoHeight = ref<HTMLTextAreaElement | null>(null)
const textareaDescriptionAutoHeight = ref<HTMLTextAreaElement | null>(null)
const editableTask = ref<any>(null)

// Dropdowns
const dateDropdownRef = ref<HTMLElement | null>(null)
const dateDropdownInstance = ref<HSDropdown | null>(null)

const timeDropdownRef = ref<HTMLElement | null>(null)
const timeDropdownInstance = ref<HSDropdown | null>(null)

function initializeTextarea(textarea: HTMLTextAreaElement | null) {
  if (textarea) {
    textarea.dispatchEvent(new Event('input'))
  }
}

const handleDateOutsideClick = (event: any) => {
  if (dateDropdownRef.value && !dateDropdownRef.value.contains(event.target)) {
    if (dateDropdownInstance.value) {
      dateDropdownInstance.value.close()
    }
  }
}

const handleTimeOutsideClick = (event: any) => {
  if (timeDropdownRef.value && !timeDropdownRef.value.contains(event.target)) {
    if (timeDropdownInstance.value) {
      timeDropdownInstance.value.close()
    }
  }
}

function getTimesOptions() {
  const times = []
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const formattedHour = hour.toString().padStart(2, '0')
      const formattedMinute = minute.toString().padStart(2, '0')
      times.push(`${formattedHour}:${formattedMinute}`)
    }
  }
  return times
}

function validateTime(event: Event) {
  const input = event.target as HTMLInputElement

  if (input.value) {
    const splittedTime = input.value.split(':')

    const hours = parseInt(splittedTime[0], 10)
    const minutes = parseInt(splittedTime[1], 10)

    if (hours > 23) {
      splittedTime[0] = '23'
    }
    if (minutes > 59) {
      splittedTime[1] = '59'
    }

    input.value = splittedTime.join(':')
  }
}

watch(
  () => TASK_STORE.taskToEdit,
  (newTask) => {
    console.log(newTask)
    const shouldInitialize = newTask && !editableTask.value

    if (newTask) {
      editableTask.value = { ...newTask }
    } else {
      editableTask.value = null
    }

    nextTick(() => {
      if (shouldInitialize) {
        HSStaticMethods.autoInit()

        if (dateDropdownRef.value) {
          dateDropdownInstance.value = HSDropdown.getInstance(dateDropdownRef.value) as HSDropdown

          document.addEventListener('mousedown', handleDateOutsideClick)
        }

        if (timeDropdownRef.value) {
          timeDropdownInstance.value = HSDropdown.getInstance(timeDropdownRef.value) as HSDropdown

          document.addEventListener('mousedown', handleTimeOutsideClick)
        }
      }

      initializeTextarea(textareaNameAutoHeight.value)
      initializeTextarea(textareaDescriptionAutoHeight.value)
    })
  },
  { deep: true, immediate: true },
)

onUnmounted(() => {
  document.removeEventListener('mousedown', handleDateOutsideClick)
  document.removeEventListener('mousedown', handleTimeOutsideClick)
})
</script>

<template>
  <div
    id="hs-task-edit"
    :ref="
      (el) => {
        if (el) WORKSPACE_STORE.editTaskModalRef = el as HTMLElement
      }
    "
    class="hs-overlay hs-overlay-open:opacity-100 hs-overlay-open:duration-500 hidden size-full fixed top-0 start-0 z-90 opacity-0 overflow-x-hidden transition-all overflow-y-auto pointer-events-none"
    role="dialog"
    tabindex="-1"
    aria-labelledby="hs-task-edit-label"
    data-hs-overlay-options='{
      "isClosePrev": false
    }'
  >
    <div class="size-full flex items-center justify-center p-4">
      <div
        class="flex flex-col w-full max-w-xl bg-white rounded-md pointer-events-auto"
        v-if="editableTask"
      >
        <!-- Header -->
        <div class="flex justify-between items-center gap-x-2 px-4 py-2 border-b border-gray-200">
          <div class="flex items-center gap-x-1">
            <button
              type="button"
              class="py-1.5 px-2 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-gray-100 transition-colors duration-100 text-gray-500 focus:outline-hidden disabled:opacity-50 disabled:pointer-events-none"
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
              {{ editableTask.is_completed ? 'Выполнено' : 'Выполняется' }}
            </button>

            <div class="hs-dropdown [--auto-close:inside] relative inline-flex">
              <button
                id="hs-dropdown-move"
                type="button"
                class="py-1.5 px-2 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-gray-100 hover:bg-gray-200 transition-colors duration-100 text-gray-500 focus:outline-hidden disabled:opacity-50 disabled:pointer-events-none"
                aria-haspopup="menu"
                aria-expanded="false"
                aria-label="Dropdown"
              >
                <div class="flex items-center gap-x-2">
                  <Layers class="size-4" />
                  <span>Отчёты</span>
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
                class="hs-dropdown-menu transition-[opacity,margin] duration hs-dropdown-open:opacity-100 z-90 opacity-0 hidden w-65 bg-white shadow-md rounded-lg mt-2 after:h-4 after:absolute after:-bottom-4 after:start-0 after:w-full before:h-4 before:absolute before:-top-4 before:start-0 before:w-full"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="hs-dropdown-move"
              >
                <div class="flex flex-col p-2 gap-y-2">
                  <div class="flex flex-col gap-y-0.5 flex-grow-1">
                    <span class="text-xs text-gray-400">Доска</span>

                    <select
                      data-hs-select='{
                      "placeholder": "Выберите доску...",
                      "toggleTag": "<button type=\"button\" aria-expanded=\"false\"></button>",
                      "toggleClasses": "hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50 relative py-1.5 ps-2.5 pe-9 flex gap-x-2 text-nowrap w-full cursor-pointer bg-white border border-gray-200 rounded-lg text-start text-custom-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:focus:outline-hidden dark:focus:ring-1 dark:focus:ring-neutral-600",
                      "dropdownClasses": "mt-2 z-50 w-full max-h-72 p-1 space-y-0.5 bg-white border border-gray-200 rounded-lg overflow-hidden overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 dark:bg-neutral-900 dark:border-neutral-700",
                      "optionClasses": "py-2 px-4 w-full text-sm text-gray-800 cursor-pointer hover:bg-gray-100 rounded-lg focus:outline-hidden focus:bg-gray-100 hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:text-neutral-200 dark:focus:bg-neutral-800",
                      "optionTemplate": "<div class=\"flex justify-between items-center w-full\"><span data-title></span><span class=\"hidden hs-selected:block\"><svg class=\"shrink-0 size-3.5 text-blue-600 dark:text-blue-500 \" xmlns=\"http:.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polyline points=\"20 6 9 17 4 12\"/></svg></span></div>",
                      "extraMarkup": "<div class=\"absolute top-1/2 end-3 -translate-y-1/2\"><svg class=\"shrink-0 size-3.5 text-gray-500 dark:text-neutral-500 \" xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m7 15 5 5 5-5\"/><path d=\"m7 9 5-5 5 5\"/></svg></div>"
                    }'
                      class="hidden"
                    >
                      <option selected>Главная</option>
                      <option>Личное</option>
                      <option>Спорт</option>
                    </select>
                  </div>

                  <div class="flex flex-col gap-y-0.5 flex-grow-1">
                    <span class="text-xs text-gray-400">Категория</span>
                    <select
                      data-hs-select='{
                      "placeholder": "Выберите категорию...",
                      "toggleTag": "<button type=\"button\" aria-expanded=\"false\"></button>",
                      "toggleClasses": "hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50 relative py-1.5 ps-2.5 pe-9 flex gap-x-2 text-nowrap w-full cursor-pointer bg-white border border-gray-200 rounded-lg text-start text-custom-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:focus:outline-hidden dark:focus:ring-1 dark:focus:ring-neutral-600",
                      "dropdownClasses": "mt-2 z-50 w-full max-h-72 p-1 space-y-0.5 bg-white border border-gray-200 rounded-lg overflow-hidden overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 dark:bg-neutral-900 dark:border-neutral-700",
                      "optionClasses": "py-2 px-4 w-full text-sm text-gray-800 cursor-pointer hover:bg-gray-100 rounded-lg focus:outline-hidden focus:bg-gray-100 hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:text-neutral-200 dark:focus:bg-neutral-800",
                      "optionTemplate": "<div class=\"flex justify-between items-center w-full\"><span data-title></span><span class=\"hidden hs-selected:block\"><svg class=\"shrink-0 size-3.5 text-blue-600 dark:text-blue-500 \" xmlns=\"http:.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polyline points=\"20 6 9 17 4 12\"/></svg></span></div>",
                      "extraMarkup": "<div class=\"absolute top-1/2 end-3 -translate-y-1/2\"><svg class=\"shrink-0 size-3.5 text-gray-500 dark:text-neutral-500 \" xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m7 15 5 5 5-5\"/><path d=\"m7 9 5-5 5 5\"/></svg></div>"
                    }'
                      class="hidden"
                    >
                      <option>Покупки</option>
                      <option selected>Отчёты</option>
                      <option>Спорт</option>
                    </select>
                  </div>

                  <button
                    class="self-start rounded-md px-2.5 py-1.5 bg-blue-500 hover:opacity-90 transition-opacity text-white duration-100 focus:outline-hidden text-xs"
                  >
                    Переместить
                  </button>
                </div>
              </div>
            </div>
          </div>
          <button
            class="transition-colors duration-100 text-gray-500 hover:bg-gray-200 p-1 rounded-full"
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

        <div class="text-custom-sm text-gray-500 space-x-1 px-4">
          <span>#срочно</span>
          <span>#важно</span>
          <span>#работа</span>
        </div>
        <!-- Description End -->

        <div
          class="flex items-start flex-wrap gap-x-2 gap-y-1 px-4 pt-3 pb-4"
          :class="{ 'pt-2': !editableTask.tags?.length }"
        >
          <!-- Date -->
          <div class="hs-dropdown [--auto-close:false] relative inline-flex" ref="dateDropdownRef">
            <button
              id="hs-dropdown-date"
              type="button"
              class="hs-dropdown-toggle py-1 px-2 inline-flex items-center gap-x-2 text-custom-sm font-medium border border-gray-200 rounded-lg bg-gray-100 text-gray-600 shadow-2xs hover:bg-gray-200 focus:bg-gray-200 transition-colors duration-100 focus:outline-hidden disabled:opacity-50 disabled:pointer-events-none:"
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

            <button
              id="hs-dropdown-date"
              type="button"
              class="hs-dropdown-toggle py-1 px-2 inline-flex items-center gap-x-2 text-custom-sm font-medium border border-blue-200 rounded-lg bg-blue-100 text-blue-500 shadow-2xs hover:bg-blue-200 transition-colors duration-100 focus:outline-hidden focus:bg-blue-200 disabled:opacity-50 disabled:pointer-events-none"
              aria-haspopup="menu"
              aria-expanded="false"
              aria-label="Dropdown"
            >
              <div class="flex items-center gap-x-2">
                <Clock class="size-4" />
                <span>Сегодня в 14:00</span>
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
              class="hs-dropdown-menu transition-[opacity,margin] duration hs-dropdown-open:opacity-100 opacity-0 hidden w-65 bg-white shadow-md rounded-lg mt-2 after:h-4 after:absolute after:-bottom-4 after:start-0 after:w-full before:h-4 before:absolute before:-top-4 before:start-0 before:w-full"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="hs-dropdown-date"
            >
              <div class="p-2 flex flex-col">
                <div class="flex items-center gap-x-1">
                  <div class="flex flex-col gap-y-0.5 flex-grow-1">
                    <span class="text-xs text-gray-400">Дата</span>
                    <div
                      class="relative rounded-lg border border-gray-200 bg-gray-100 text-gray-600 hover:bg-gray-200"
                    >
                      <input
                        id="hs-dropdown-date-input"
                        type="text"
                        class="bg-transparent w-full pointer-events-none pr-7 border-none py-1 px-2 inline-flex self-start items-center gap-x-2 text-sm placeholder:text-gray-300 focus:ring-0 focus:outline-hidden disabled:opacity-50 disabled:pointer-events-none"
                        aria-haspopup="menu"
                        placeholder="Выберите дату"
                        aria-expanded="false"
                        autocomplete="off"
                      />
                    </div>
                  </div>

                  <div class="flex flex-col gap-y-0.5">
                    <span class="text-xs text-gray-400">Время</span>
                    <div
                      class="hs-dropdown [--auto-close:false] relative inline-flex self-start"
                      ref="timeDropdownRef"
                    >
                      <div
                        class="relative hs-dropdown-toggle rounded-lg border border-gray-200 bg-gray-100 text-gray-600 hover:bg-gray-200"
                      >
                        <input
                          id="hs-dropdown-time-input"
                          type="tel"
                          class="bg-transparent pr-7 border-none py-1 px-2 inline-flex self-start w-20 items-center gap-x-2 text-sm placeholder:text-gray-300 focus:ring-0 focus:outline-hidden disabled:opacity-50 disabled:pointer-events-none"
                          aria-haspopup="menu"
                          v-mask="'##:##'"
                          @change="validateTime($event)"
                          aria-expanded="false"
                          aria-label="Dropdown"
                          autocomplete="off"
                          placeholder="00:00"
                        />
                        <button
                          type="button"
                          @click.stop=""
                          class="absolute end-2 top-1/2 -translate-y-1/2"
                        >
                          <X class="size-4 text-gray-400 hover:text-gray-500" />
                        </button>
                      </div>

                      <div
                        class="hs-dropdown-menu transition-[opacity,margin] duration hs-dropdown-open:opacity-100 opacity-0 w-56 hidden z-10 mt-2 min-w-60 bg-white shadow-md rounded-lg p-2"
                        role="menu"
                        aria-orientation="vertical"
                        aria-labelledby="hs-dropdown-time"
                      >
                        <div class="max-h-60 overflow-y-auto">
                          <a
                            v-for="time in getTimesOptions()"
                            :key="time"
                            class="block py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300 dark:focus:bg-neutral-700"
                            href="#"
                            @click.prevent="timeDropdownInstance?.close()"
                          >
                            {{ time }}
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  class="hs-datepicker"
                  :data-hs-datepicker="JSON.stringify(datepickerOptions)"
                ></div>
                <div class="text-right pt-2 mb-1 mt-2 text-custom-sm border-t-1 border-gray-200">
                  <button
                    type="button"
                    class="text-gray-400 hover:text-gray-600 transition-colors duration-100 focus:outline-hidden"
                  >
                    Удалить всё
                  </button>
                </div>
              </div>
            </div>
          </div>
          <!-- Date End -->

          <!-- Tags -->
          <div class="hs-dropdown [--auto-close:inside] relative inline-flex">
            <button
              id="hs-dropdown-tags"
              type="button"
              class="hs-dropdown-toggle py-1 px-2 inline-flex items-center gap-x-2 text-custom-sm font-medium border border-gray-200 rounded-lg bg-gray-100 text-gray-600 shadow-2xs hover:bg-gray-200 focus:bg-gray-200 transition-colors duration-100 focus:outline-hidden disabled:opacity-50 disabled:pointer-events-none:"
              aria-haspopup="menu"
              aria-expanded="false"
              aria-label="Dropdown"
            >
              <div class="flex items-center gap-x-1">
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

            <button
              id="hs-dropdown-tags"
              type="button"
              class="hs-dropdown-toggle py-1 px-2 inline-flex items-center gap-x-2 text-custom-sm font-medium border border-blue-200 rounded-lg bg-blue-100 text-blue-500 shadow-2xs hover:bg-blue-200 transition-colors duration-100 focus:outline-hidden focus:bg-blue-200 disabled:opacity-50 disabled:pointer-events-none:"
              aria-haspopup="menu"
              aria-expanded="false"
              aria-label="Dropdown"
            >
              <div class="flex items-center gap-x-1">
                <Hash class="size-4" />
                <span>2 тега</span>
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
              class="hs-dropdown-menu transition-[opacity,margin] duration hs-dropdown-open:opacity-100 opacity-0 hidden w-65 bg-white shadow-md rounded-lg mt-2 after:h-4 after:absolute after:-bottom-4 after:start-0 after:w-full before:h-4 before:absolute before:-top-4 before:start-0 before:w-full"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="hs-dropdown-tags"
            >
              <div class="flex flex-col p-2 gap-y-2">
                <div class="flex flex-col gap-y-0.5 flex-grow-1">
                  <span class="text-xs text-gray-400">Теги</span>
                  <div class="flex flex-wrap gap-1">
                    <div
                      v-for="tag in ['важно', 'работа', 'отчеты', 'встречи']"
                      :key="tag"
                      class="inline-flex cursor-text items-center gap-x-1.5 py-0.5 px-2 rounded-sm text-custom-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200"
                    >
                      #{{ tag }}
                      <button type="button" class="focus:outline-hidden">
                        <X class="size-3.5 text-gray-400 hover:text-gray-500" />
                      </button>
                    </div>
                  </div>
                </div>
                <div class="flex flex-col gap-y-1 flex-grow-1">
                  <input
                    id="tags-input"
                    type="text"
                    class="w-full rounded-lg border placeholder:text-gray-300 border-gray-200 bg-gray-100 text-gray-600 hover:bg-gray-200 py-1 px-2 text-sm focus:ring-0 focus:outline-hidden disabled:opacity-50 disabled:pointer-events-none"
                    placeholder="Добавить тег"
                    @keydown.stop=""
                    @keypress.stop=""
                    autocomplete="off"
                  />

                  <ButtonCreate :text="'Добавить'" />
                </div>

                <div class="flex flex-col gap-y-0.5 flex-grow-1">
                  <span class="text-xs text-gray-400">Теги в пространстве</span>
                  <div class="flex flex-wrap gap-1">
                    <span
                      v-for="tag in ['дом', 'семья', 'покупки']"
                      :key="tag"
                      class="inline-flex cursor-pointer items-center gap-x-1.5 py-0.5 px-2 rounded-sm text-custom-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200"
                    >
                      #{{ tag }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="hs-dropdown [--auto-close:inside] relative inline-flex">
            <button
              id="hs-dropdown-color"
              type="button"
              class="hs-dropdown-toggle py-1 px-2 inline-flex items-center gap-x-2 text-custom-sm font-medium border border-gray-200 rounded-lg bg-gray-100 text-gray-600 shadow-2xs hover:bg-gray-200 focus:bg-gray-200 transition-colors duration-100 focus:outline-hidden disabled:opacity-50 disabled:pointer-events-none:"
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
            <button
              id="hs-dropdown-color"
              type="button"
              class="hs-dropdown-toggle py-1 px-2 inline-flex items-center gap-x-2 text-custom-sm font-medium border border-blue-200 rounded-lg bg-blue-100 text-blue-500 shadow-2xs hover:bg-blue-200 transition-colors duration-100 focus:outline-hidden focus:bg-blue-200 disabled:opacity-50 disabled:pointer-events-none:"
              aria-haspopup="menu"
              aria-expanded="false"
              aria-label="Dropdown"
            >
              <div class="flex items-center gap-x-2">
                <div class="size-4 bg-red-400 rounded-sm"></div>
                <span>Красный</span>
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
              class="hs-dropdown-menu transition-[opacity,margin] duration hs-dropdown-open:opacity-100 opacity-0 hidden min-w-60 bg-white shadow-md rounded-lg mt-2 after:h-4 after:absolute after:-bottom-4 after:start-0 after:w-full before:h-4 before:absolute before:-top-4 before:start-0 before:w-full"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="hs-dropdown-color"
            >
              <div class="flex flex-col p-2 gap-y-2">
                <span class="text-xs text-gray-400">Цвет</span>
                <div
                  class="flex rounded-sm items-center text-neutral-400 justify-center p-1 gap-x-1 border-1 border-neutral-300 pointer-events-none"
                >
                  <CircleOff class="size-3" />
                  <span class="text-custom-sm">Без цвета</span>
                </div>
                <div
                  class="flex rounded-sm items-center px-2 py-1 gap-x-2 border-1 border-red-300 pointer-events-none"
                >
                  <span class="text-red-400 text-custom-sm font-medium">Красный</span>
                  <div class="bg-red-400 w-full h-4 rounded-[1px]"></div>
                </div>
                <div
                  class="max-h-50 overflow-y-auto overflow-x-visible pl-[2px] pr-1 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300"
                >
                  <div class="grid grid-cols-4 grid-rows-[repeat(9, minmax(1.75rem, auto))] gap-1">
                    <!-- ==================================== -->
                    <!-- ПЕРВЫЙ РЯД ГРУПП (строки 1-3) -->
                    <!-- ==================================== -->

                    <!-- Красный столбец (col-start-1) -->
                    <button
                      class="h-7 rounded-sm hover:opacity-70 transition-opacity duration-100 col-start-1 row-start-1 bg-red-300"
                    />
                    <button
                      class="h-7 rounded-sm hover:opacity-70 transition-opacity duration-100 col-start-1 outline-2 outline-blue-500 outline-offset-1 row-start-2 bg-red-400"
                    />
                    <button
                      class="h-7 rounded-sm hover:opacity-70 transition-opacity duration-100 col-start-1 row-start-3 bg-red-600"
                    />

                    <!-- Синий столбец (col-start-2) -->
                    <button
                      class="h-7 rounded-sm hover:opacity-70 transition-opacity duration-100 col-start-2 row-start-1 bg-blue-300"
                    />
                    <button
                      class="h-7 rounded-sm hover:opacity-70 transition-opacity duration-100 col-start-2 row-start-2 bg-blue-500"
                    />
                    <button
                      class="h-7 rounded-sm hover:opacity-70 transition-opacity duration-100 col-start-2 row-start-3 bg-blue-600"
                    />

                    <!-- Желтый столбец (col-start-3) -->
                    <button
                      class="h-7 rounded-sm hover:opacity-70 transition-opacity duration-100 col-start-3 row-start-1 bg-yellow-300"
                    />
                    <button
                      class="h-7 rounded-sm hover:opacity-70 transition-opacity duration-100 col-start-3 row-start-2 bg-yellow-500"
                    />
                    <button
                      class="h-7 rounded-sm hover:opacity-70 transition-opacity duration-100 col-start-3 row-start-3 bg-yellow-600"
                    />

                    <!-- НОВЫЙ Четвертый столбец (например, Пурпурный, col-start-4) -->
                    <button
                      class="h-7 rounded-sm hover:opacity-70 transition-opacity duration-100 col-start-4 row-start-1 bg-purple-300"
                    />
                    <button
                      class="h-7 rounded-sm hover:opacity-70 transition-opacity duration-100 col-start-4 row-start-2 bg-purple-500"
                    />
                    <button
                      class="h-7 rounded-sm hover:opacity-70 transition-opacity duration-100 col-start-4 row-start-3 bg-purple-600"
                    />

                    <!-- ==================================== -->
                    <!-- ВТОРОЙ РЯД ГРУПП (строки 4-6) -->
                    <!-- ==================================== -->

                    <!-- Оранжевый столбец (col-start-1) -->
                    <button
                      class="h-7 rounded-sm hover:opacity-70 transition-opacity duration-100 col-start-1 row-start-4 bg-orange-300"
                    />
                    <button
                      class="h-7 rounded-sm hover:opacity-70 transition-opacity duration-100 col-start-1 row-start-5 bg-orange-500"
                    />
                    <button
                      class="h-7 rounded-sm hover:opacity-70 transition-opacity duration-100 col-start-1 row-start-6 bg-orange-600"
                    />

                    <!-- Зеленый столбец (col-start-2) -->
                    <button
                      class="h-7 rounded-sm hover:opacity-70 transition-opacity duration-100 col-start-2 row-start-4 bg-green-300"
                    />
                    <button
                      class="h-7 rounded-sm hover:opacity-70 transition-opacity duration-100 col-start-2 row-start-5 bg-green-500"
                    />
                    <button
                      class="h-7 rounded-sm hover:opacity-70 transition-opacity duration-100 col-start-2 row-start-6 bg-green-600"
                    />

                    <!-- Лайм столбец (col-start-3) -->
                    <button
                      class="h-7 rounded-sm hover:opacity-70 transition-opacity duration-100 col-start-3 row-start-4 bg-lime-300"
                    />
                    <button
                      class="h-7 rounded-sm hover:opacity-70 transition-opacity duration-100 col-start-3 row-start-5 bg-lime-500"
                    />
                    <button
                      class="h-7 rounded-sm hover:opacity-70 transition-opacity duration-100 col-start-3 row-start-6 bg-lime-600"
                    />

                    <!-- НОВЫЙ Четвертый столбец (например, Розовый, col-start-4) -->
                    <button
                      class="h-7 rounded-sm hover:opacity-70 transition-opacity duration-100 col-start-4 row-start-4 bg-pink-300"
                    />
                    <button
                      class="h-7 rounded-sm hover:opacity-70 transition-opacity duration-100 col-start-4 row-start-5 bg-pink-500"
                    />
                    <button
                      class="h-7 rounded-sm hover:opacity-70 transition-opacity duration-100 col-start-4 row-start-6 bg-pink-600"
                    />

                    <!-- ==================================== -->
                    <!-- ТРЕТИЙ РЯД ГРУПП (строки 7-9) -->
                    <!-- ==================================== -->

                    <!-- Фиолетовый столбец (col-start-1) -->
                    <button
                      class="h-7 rounded-sm hover:opacity-70 transition-opacity duration-100 col-start-1 row-start-7 bg-purple-300"
                    />
                    <button
                      class="h-7 rounded-sm hover:opacity-70 transition-opacity duration-100 col-start-1 row-start-8 bg-purple-500"
                    />
                    <button
                      class="h-7 rounded-sm hover:opacity-70 transition-opacity duration-100 col-start-1 row-start-9 bg-purple-600"
                    />

                    <!-- Розовый столбец (col-start-2) -->
                    <button
                      class="h-7 rounded-sm hover:opacity-70 transition-opacity duration-100 col-start-2 row-start-7 bg-pink-300"
                    />
                    <button
                      class="h-7 rounded-sm hover:opacity-70 transition-opacity duration-100 col-start-2 row-start-8 bg-pink-500"
                    />
                    <button
                      class="h-7 rounded-sm hover:opacity-70 transition-opacity duration-100 col-start-2 row-start-9 bg-pink-600"
                    />

                    <!-- Нейтральный столбец (col-start-3) -->
                    <button
                      class="h-7 rounded-sm hover:opacity-70 transition-opacity duration-100 col-start-3 row-start-7 bg-neutral-300"
                    />
                    <button
                      class="h-7 rounded-sm hover:opacity-70 transition-opacity duration-100 col-start-3 row-start-8 bg-neutral-500"
                    />
                    <button
                      class="h-7 rounded-sm hover:opacity-70 transition-opacity duration-100 col-start-3 row-start-9 bg-neutral-600"
                    />

                    <!-- НОВЫЙ Четвертый столбец (допустим, Серый, col-start-4) -->
                    <button
                      class="h-7 rounded-sm hover:opacity-70 transition-opacity duration-100 col-start-4 row-start-7 bg-gray-300"
                    />
                    <button
                      class="h-7 rounded-sm hover:opacity-70 transition-opacity duration-100 col-start-4 row-start-8 bg-gray-500"
                    />
                    <button
                      class="h-7 rounded-sm hover:opacity-70 transition-opacity duration-100 col-start-4 row-start-9 bg-gray-600"
                    />
                  </div>
                </div>

                <div class="text-right text-custom-sm border-t-1 border-gray-200 pt-2 my-1">
                  <button
                    type="button"
                    class="text-gray-400 hover:text-gray-600 transition-colors duration-100 focus:outline-hidden"
                  >
                    Убрать цвет
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
