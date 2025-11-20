<script setup lang="ts">
import { HSOverlay, HSStrongPassword, ICollectionItem } from 'preline'
import { computed, onMounted, ref, toRef } from 'vue'
import Spinner from '@components/Loader/Spinner.vue'
import { useAuthStore } from '@stores/auth'
import DeleteUserModal from '@components/Modals/DeleteUserModal.vue'

const AUTH_STORE = useAuthStore()

const oldPassword = ref('')
const newPassword = ref('')
const newPasswordAgain = ref('')
const newPasswordRef = ref<HTMLInputElement | null>(null)

const passwordUpdateError = toRef(AUTH_STORE, 'passwordUpdateError')
const isPasswordUpdating = toRef(AUTH_STORE, 'isPasswordUpdating')
const isUserDeleting = toRef(AUTH_STORE, 'isUserDeleting')

const strongPasswordRef = ref<HTMLElement | null>(null)
const strongPasswordInstance = ref<HSStrongPassword | null>(null)
const passwordRules = ref<Array<string>>([])

const deleteModalRef = ref<HTMLElement | null>(null)

const checkRulesExistence = computed((): boolean => {
  const areAllRequiredRulesPresent = ['min-length', 'lowercase', 'uppercase', 'numbers']

  for (const rule of areAllRequiredRulesPresent) {
    if (!passwordRules.value.includes(rule)) {
      return false
    }
  }

  return true
})

async function handleSavePassword() {
  if (isSavePasswordDisabled.value || isPasswordUpdating.value) return

  const result = await AUTH_STORE.updateUserPassword(oldPassword.value, newPassword.value)

  if (result) {
    oldPassword.value = ''
    newPassword.value = ''
    if (newPasswordRef.value != null) {
      newPasswordRef.value.value = ''
      newPasswordRef.value.dispatchEvent(new Event('input'))
    }
    newPasswordAgain.value = ''

    resetPasswordUpdateError()
  }
}

function showDeleteUserModal() {
  if (deleteModalRef.value) {
    const { element } = HSOverlay.getInstance(
      deleteModalRef.value,
      true,
    ) as ICollectionItem<HSOverlay>

    element.open()
  }
}

async function handleDeleteAccount() {
  if (isUserDeleting.value) return

  await AUTH_STORE.deleteAccount()
}

const isSavePasswordDisabled = computed(() => {
  return (
    oldPassword.value.length === 0 ||
    newPassword.value.length === 0 ||
    newPasswordAgain.value.length === 0 ||
    !checkRulesExistence.value ||
    !arePasswordsMatching.value
  )
})

const arePasswordsMatching = computed((): boolean => {
  return newPassword.value === newPasswordAgain.value && newPassword.value.length > 0
})

const getOldPasswordError = computed(() => {
  return passwordUpdateError.value !== null ? passwordUpdateError.value.oldPassword : ''
})

const getNewPasswordError = computed(() => {
  return passwordUpdateError.value !== null ? passwordUpdateError.value.newPassword : ''
})

function resetPasswordUpdateError() {
  AUTH_STORE.resetPasswordUpdateError()
}

function connectDeleteModalRef(el: HTMLElement) {
  deleteModalRef.value = el
}

onMounted(() => {
  window.HSStaticMethods.autoInit()

  if (strongPasswordRef.value) {
    const { element } = HSStrongPassword.getInstance(
      strongPasswordRef.value,
      true,
    ) as ICollectionItem<HSStrongPassword>

    element.on('change', ({ rules }: { rules: Set<string> }) => {
      passwordRules.value = Array.from(rules)
    })

    strongPasswordInstance.value = element
  }
})
</script>

<template>
  <div class="flex flex-col gap-y-2">
    <h3 class="text-sm font-medium text-gray-800 pb-1 sm:pb-2 border-b border-gray-200">
      Безопасность аккаунта
    </h3>

    <div class="flex flex-col gap-y-3">
      <div class="flex flex-col gap-y-1">
        <div class="max-w-80 flex flex-col gap-y-1">
          <div class="flex flex-col gap-y-1">
            <label class="text-custom-sm font-medium text-gray-700">Смена пароля</label>
            <div class="relative">
              <input
                type="password"
                id="settings-old-password"
                class="w-full border-none bg-gray-100 rounded-md pl-3 pr-10 truncate py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                :class="{
                  'ring-1 ring-red-500!': getOldPasswordError && getOldPasswordError.length > 0,
                }"
                placeholder="Текущий пароль"
                v-model="oldPassword"
                @input="resetPasswordUpdateError"
              />
              <button
                type="button"
                data-hs-toggle-password='{
                  "target": "#settings-old-password"
                }'
                class="absolute inset-y-0 end-0 flex items-center z-20 px-3 cursor-pointer text-gray-400 rounded-e-md focus:outline-hidden focus:text-blue-600"
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

            <span
              v-if="getOldPasswordError && getOldPasswordError.length > 0"
              class="text-red-500 text-xs"
            >
              {{ getOldPasswordError }}
            </span>
          </div>
          <div class="flex flex-col gap-y-1">
            <div class="flex">
              <div class="flex-1">
                <div class="flex flex-col gap-y-1">
                  <div class="relative">
                    <input
                      type="password"
                      id="settings-new-password"
                      class="w-full border-none bg-gray-100 rounded-md pl-3 pr-10 truncate py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      :class="{
                        'ring-1 ring-red-500!':
                          getNewPasswordError && getNewPasswordError.length > 0,
                      }"
                      @input="resetPasswordUpdateError"
                      placeholder="Новый пароль"
                      ref="newPasswordRef"
                      v-model="newPassword"
                    />
                    <button
                      type="button"
                      data-hs-toggle-password='{
                        "target": "#settings-new-password"
                      }'
                      class="absolute inset-y-0 end-0 flex items-center z-20 px-3 cursor-pointer text-gray-400 rounded-e-md focus:outline-hidden focus:text-blue-600"
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
                        <line
                          class="hs-password-active:hidden"
                          x1="2"
                          x2="22"
                          y1="2"
                          y2="22"
                        ></line>
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

                  <span
                    v-if="getNewPasswordError && getNewPasswordError.length > 0"
                    class="text-red-500 text-xs"
                  >
                    {{ getNewPasswordError }}
                  </span>
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
                  ref="strongPasswordRef"
                ></div>
              </div>
            </div>

            <div id="settings-strong-password-hints" class="flex flex-col gap-y-2 mb-2">
              <div class="flex items-center gap-x-1" v-show="newPassword.length > 0">
                <span class="text-xs text-gray-700">Сложность: </span>
                <span
                  data-hs-strong-password-hints-weakness-text='["Нет", "Слабый", "Средний", "Сильный", "Очень Сильный", "Супер Сильный"]'
                  class="text-xs font-semibold text-gray-700"
                ></span>
              </div>

              <ul class="space-y-1 text-xs text-gray-500">
                <li
                  data-hs-strong-password-hints-rule-text="min-length"
                  class="hs-strong-password-active:text-teal-500 flex items-center gap-x-2"
                >
                  <span class="hidden" data-check="">•</span>
                  <span data-uncheck="">•</span>
                  <span>Минимальное количество символов - 6</span>
                </li>
                <li
                  data-hs-strong-password-hints-rule-text="lowercase"
                  class="hs-strong-password-active:text-teal-500 flex items-center gap-x-2"
                >
                  <span class="hidden" data-check="">•</span>
                  <span data-uncheck="">•</span>
                  <span>Должен содержать строчные буквы</span>
                </li>
                <li
                  data-hs-strong-password-hints-rule-text="uppercase"
                  class="hs-strong-password-active:text-teal-500 flex items-center gap-x-2"
                >
                  <span class="hidden" data-check="">•</span>
                  <span data-uncheck="">•</span>
                  <span>Должен содержать заглавные буквы</span>
                </li>
                <li
                  data-hs-strong-password-hints-rule-text="numbers"
                  class="hs-strong-password-active:text-teal-500 flex items-center gap-x-2"
                >
                  <span class="hidden" data-check="">•</span>
                  <span data-uncheck="">•</span>
                  <span>Должен содержать цифры</span>
                </li>
                <li
                  class="flex items-center gap-x-2"
                  :class="{ 'text-teal-500': arePasswordsMatching }"
                >
                  <span class="hidden" data-check="">•</span>
                  <span data-uncheck="">•</span>
                  <span>Пароли должны совпадать</span>
                </li>
              </ul>
            </div>
          </div>
          <div class="relative">
            <input
              type="password"
              id="settings-new-password-again"
              class="w-full border-none bg-gray-100 rounded-md pl-3 pr-10 truncate py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Новый пароль ещё раз"
              v-model="newPasswordAgain"
            />
            <button
              type="button"
              data-hs-toggle-password='{
                "target": "#settings-new-password-again"
              }'
              class="absolute inset-y-0 end-0 flex items-center z-20 px-3 cursor-pointer text-gray-400 rounded-e-md focus:outline-hidden focus:text-blue-600"
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
        class="flex items-center justify-center gap-x-2 py-2 px-3 bg-blue-500 hover:opacity-90 transition-[opacity,colors] text-white text-xs font-medium rounded-md duration-100 focus:outline-hidden disabled:opacity-30 disabled:bg-gray-300 disabled:text-gray-600 disabled:cursor-default"
        :disabled="isSavePasswordDisabled && !isPasswordUpdating"
        @click="handleSavePassword"
      >
        <Spinner v-if="isPasswordUpdating" class="size-3" />
        <span>Сохранить</span>
      </button>
    </div>
  </div>

  <div class="flex flex-col gap-y-2">
    <h3
      class="text-sm font-medium text-gray-800 pb-1 sm:pb-2 border-b border-gray-200 mt-2 sm:mt-4"
    >
      Удаление аккаунта
    </h3>

    <div class="flex flex-col gap-y-4">
      <p class="text-sm text-gray-600 max-w-110">
        Удаление вашего аккаунта является необратимым действием. Все ваши задачи, категории, данные
        AI и история будут безвозвратно удалены.
      </p>
      <button
        type="button"
        class="flex items-center justify-center gap-x-2 py-2 px-3 text-xs self-start font-semibold rounded-md border border-transparent bg-red-100 text-red-500 transition-colors duration-100 hover:bg-red-200 disabled:opacity-50 disabled:pointer-events-none"
        @click="showDeleteUserModal"
      >
        <Spinner v-if="isUserDeleting" class="size-3" />
        <span>Удалить аккаунт</span>
      </button>
    </div>
  </div>

  <Teleport to="body">
    <DeleteUserModal @connectRef="connectDeleteModalRef" @confirm="handleDeleteAccount" />
  </Teleport>
</template>
