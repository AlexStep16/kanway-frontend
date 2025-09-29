<script setup lang="ts">
import { X, Check } from 'lucide-vue-next'
import { ref } from 'vue'

const oldPassword = ref('')
const newPassword = ref('')
const newPasswordAgain = ref('')
</script>

<template>
  <div class="flex flex-col gap-y-2">
    <h3 class="text-sm font-medium text-gray-800 pb-2 border-b border-gray-200">
      Безопасность аккаунта
    </h3>

    <div class="flex flex-col gap-y-3">
      <div class="flex flex-col gap-y-1">
        <div class="max-w-70 flex flex-col gap-y-1">
          <label class="text-custom-sm font-medium text-gray-700">Смена пароля</label>
          <div class="relative">
            <input
              type="password"
              id="settings-old-password"
              class="w-full border-none bg-gray-100 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Прошлый пароль"
              v-model="oldPassword"
            />
            <button
              type="button"
              data-hs-toggle-password='{
              "target": "#settings-old-password"
            }'
              class="absolute inset-y-0 end-0 flex items-center z-20 px-3 cursor-pointer text-gray-400 rounded-e-md focus:outline-hidden focus:text-blue-600 dark:text-neutral-600 dark:focus:text-blue-500"
            >
              <svg
                class="shrink-0 size-4"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path class="hs-password-active:hidden" d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path>
                <path
                  class="hs-password-active:hidden"
                  d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"
                ></path>
                <path
                  class="hs-password-active:hidden"
                  d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"
                ></path>
                <line class="hs-password-active:hidden" x1="2" x2="22" y1="2" y2="22"></line>
                <path
                  class="hidden hs-password-active:block"
                  d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"
                ></path>
                <circle class="hidden hs-password-active:block" cx="12" cy="12" r="3"></circle>
              </svg>
            </button>
          </div>
          <div class="flex flex-col gap-y-1">
            <div class="flex">
              <div class="flex-1">
                <div class="relative">
                  <input
                    type="password"
                    id="settings-new-password"
                    class="w-full border-none bg-gray-100 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Новый пароль"
                    v-model="newPassword"
                  />
                  <button
                    type="button"
                    data-hs-toggle-password='{
              "target": "#settings-new-password"
            }'
                    class="absolute inset-y-0 end-0 flex items-center z-20 px-3 cursor-pointer text-gray-400 rounded-e-md focus:outline-hidden focus:text-blue-600 dark:text-neutral-600 dark:focus:text-blue-500"
                  >
                    <svg
                      class="shrink-0 size-4"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path
                        class="hs-password-active:hidden"
                        d="M9.88 9.88a3 3 0 1 0 4.24 4.24"
                      ></path>
                      <path
                        class="hs-password-active:hidden"
                        d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"
                      ></path>
                      <path
                        class="hs-password-active:hidden"
                        d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"
                      ></path>
                      <line class="hs-password-active:hidden" x1="2" x2="22" y1="2" y2="22"></line>
                      <path
                        class="hidden hs-password-active:block"
                        d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"
                      ></path>
                      <circle
                        class="hidden hs-password-active:block"
                        cx="12"
                        cy="12"
                        r="3"
                      ></circle>
                    </svg>
                  </button>
                </div>
                <div
                  id="settings-strong-password"
                  v-show="newPassword.length > 0"
                  data-hs-strong-password='{
                  "target": "#settings-new-password",
                  "hints": "#settings-strong-password-hints",
                  "stripClasses": "hs-strong-password:opacity-100 hs-strong-password-accepted:bg-teal-500 h-2 flex-auto rounded-full bg-blue-500 opacity-50 mx-1"
                }'
                  class="flex mt-2 -mx-1"
                ></div>
              </div>
            </div>

            <div id="settings-strong-password-hints" class="mb-2" v-show="newPassword.length > 0">
              <div>
                <span class="text-sm text-gray-700 dark:text-neutral-200">Сложность: </span>
                <span
                  data-hs-strong-password-hints-weakness-text='["Нет", "Слабый", "Средний", "Сильный", "Очень Сильный", "Супер Сильный"]'
                  class="text-sm font-semibold text-gray-700 dark:text-neutral-200"
                ></span>
              </div>

              <h4 class="my-2 text-sm font-semibold text-gray-700 dark:text-white">
                Ваш пароль должен содержать:
              </h4>

              <ul class="space-y-1 text-sm text-gray-500 dark:text-neutral-500">
                <li
                  data-hs-strong-password-hints-rule-text="min-length"
                  class="hs-strong-password-active:text-teal-500 flex items-center gap-x-2"
                >
                  <span class="hidden" data-check="">
                    <Check class="shrink-0 size-4" />
                  </span>
                  <span data-uncheck="">
                    <X class="shrink-0 size-4" />
                  </span>
                  Минимальное количество символов - 6.
                </li>
                <li
                  data-hs-strong-password-hints-rule-text="lowercase"
                  class="hs-strong-password-active:text-teal-500 flex items-center gap-x-2"
                >
                  <span class="hidden" data-check="">
                    <Check class="shrink-0 size-4" />
                  </span>
                  <span data-uncheck="">
                    <X class="shrink-0 size-4" />
                  </span>
                  Должен содержать строчные буквы.
                </li>
                <li
                  data-hs-strong-password-hints-rule-text="uppercase"
                  class="hs-strong-password-active:text-teal-500 flex items-center gap-x-2"
                >
                  <span class="hidden" data-check="">
                    <Check class="shrink-0 size-4" />
                  </span>
                  <span data-uncheck="">
                    <X class="shrink-0 size-4" />
                  </span>
                  Должен содержать заглавные буквы.
                </li>
                <li
                  data-hs-strong-password-hints-rule-text="numbers"
                  class="hs-strong-password-active:text-teal-500 flex items-center gap-x-2"
                >
                  <span class="hidden" data-check="">
                    <Check class="shrink-0 size-4" />
                  </span>
                  <span data-uncheck="">
                    <X class="shrink-0 size-4" />
                  </span>
                  Должен содержать цифры.
                </li>
                <li
                  data-hs-strong-password-hints-rule-text="special-characters"
                  class="hs-strong-password-active:text-teal-500 flex items-center gap-x-2"
                >
                  <span class="hidden" data-check="">
                    <Check class="shrink-0 size-4" />
                  </span>
                  <span data-uncheck="">
                    <X class="shrink-0 size-4" />
                  </span>
                  Должен содержать специальные символы.
                </li>
              </ul>
            </div>
          </div>
          <div class="relative">
            <input
              type="password"
              id="settings-new-password-again"
              class="w-full border-none bg-gray-100 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Новый пароль ещё раз"
              v-model="newPasswordAgain"
            />
            <button
              type="button"
              data-hs-toggle-password='{
              "target": "#settings-old-password"
            }'
              class="absolute inset-y-0 end-0 flex items-center z-20 px-3 cursor-pointer text-gray-400 rounded-e-md focus:outline-hidden focus:text-blue-600 dark:text-neutral-600 dark:focus:text-blue-500"
            >
              <svg
                class="shrink-0 size-4"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path class="hs-password-active:hidden" d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path>
                <path
                  class="hs-password-active:hidden"
                  d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"
                ></path>
                <path
                  class="hs-password-active:hidden"
                  d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"
                ></path>
                <line class="hs-password-active:hidden" x1="2" x2="22" y1="2" y2="22"></line>
                <path
                  class="hidden hs-password-active:block"
                  d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"
                ></path>
                <circle class="hidden hs-password-active:block" cx="12" cy="12" r="3"></circle>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="flex items-center justify-start w-full gap-x-2">
      <button
        type="button"
        class="py-2 px-3 bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium rounded-md transition-colors duration-200 focus:outline-hidden disabled:opacity-30 disabled:cursor-default disabled:hover:bg-blue-500"
      >
        Сохранить
      </button>
    </div>
  </div>

  <div class="flex flex-col gap-y-2">
    <h3 class="text-sm font-medium text-gray-800 pb-2 border-b border-gray-200 mt-4">
      Удаление аккаунта
    </h3>

    <div class="flex flex-col gap-y-4">
      <p class="text-sm text-gray-600 max-w-110">
        Удаление вашего аккаунта является необратимым действием. Все ваши задачи, категории, данные
        AI и история будут безвозвратно удалены.
      </p>
      <button
        type="button"
        class="py-2 px-3 text-xs self-start font-semibold rounded-md border border-transparent bg-red-100 text-red-500 transition-colors duration-200 hover:bg-red-200 disabled:opacity-50 disabled:pointer-events-none"
      >
        Удалить аккаунт
      </button>
    </div>
  </div>
</template>
