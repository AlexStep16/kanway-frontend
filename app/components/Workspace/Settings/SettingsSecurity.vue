<script setup lang="ts">
import DeleteUserModal from '~/components/Modals/DeleteUserModal.vue'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import { useForm } from 'vee-validate'

const passwordInputRef = ref<HTMLInputElement | null>(null)
const deleteModalRef = ref<HTMLElement | null>(null)

const uiStore = useUIStore()

const schema = toTypedSchema(
  z.object({
    currentPassword: z.string().min(1, 'Текущий пароль должен быть заполнен'),
    password: z.string().min(10, 'Пароль должен содержать минимум 10 символов'),
  }),
)

const { errors, handleSubmit, submitCount, defineField, resetForm } = useForm({
  validationSchema: schema,
  initialValues: {
    currentPassword: '',
    password: '',
  },
})

const [currentPassword, currentPasswordAttrs] = defineField('currentPassword')
const [password, passwordAttrs] = defineField('password')

// --- Mutations ---
const { mutate: updateUserPassword, isPending: isPasswordUpdating } = useUpdatePassword()

const { mutate: deleteAccount, isPending: isUserDeleting } = useDeleteUser()

const handleSavePassword = handleSubmit((values) => {
  if (isSavePasswordDisabled.value) return

  updateUserPassword(
    { password: values.password, currentPassword: values.currentPassword },
    {
      onSuccess: () => {
        currentPassword.value = ''
        password.value = ''

        if (passwordInputRef.value) {
          passwordInputRef.value.dispatchEvent(new Event('input'))
        }
        resetForm()
      },
    },
  )
})

const isSavePasswordDisabled = computed(
  () => !currentPassword.value || !password.value || isPasswordUpdating.value,
)

const handleDeleteAccount = () => deleteAccount()

const requirements = [
  { label: 'Минимальное количество символов: 10', check: (val: string) => val.length >= 10 },
]

const checklist = computed(() => {
  return requirements.map((req) => ({
    label: req.label,
    isMet: req.check(password.value || ''),
  }))
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
                :class="{ 'ring-1 ring-red-500': errors?.currentPassword && submitCount > 0 }"
                placeholder="Текущий пароль"
                v-model="currentPassword"
                v-bind="currentPasswordAttrs"
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

            <p
              v-if="errors?.currentPassword && submitCount > 0"
              class="text-red-500 text-xs mt-1"
            >
              {{ errors.currentPassword }}
            </p>
          </div>
          <div class="flex flex-col gap-y-1">
            <div class="flex">
              <div class="flex-1">
                <div class="flex flex-col gap-y-1">
                  <div class="relative">
                    <input
                      type="password"
                      id="strong-password"
                      class="w-full border-none bg-gray-100 rounded-md pl-3 pr-10 truncate py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      :class="{ 'ring-1 ring-red-500': errors?.password && submitCount > 0 }"
                      placeholder="Новый пароль"
                      ref="passwordRef"
                      v-model="password"
                      v-bind="passwordAttrs"
                    />
                    <button
                      type="button"
                      data-hs-toggle-password='{
                        "target": "#strong-password"
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

                  <ul
                    class="text-xs my-2"
                    v-if="password && password.length > 0"
                  >
                    <li
                      v-for="(item, index) in checklist"
                      :key="index"
                      class="text-xs transition-colors duration-300 list-disc list-inside"
                      :class="{
                        'text-green-600': item.isMet,
                        'text-gray-400': !item.isMet,
                        'text-red-500': errors.password && submitCount > 0,
                      }"
                    >
                      <span>{{ item.label }}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
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
        <Spinner
          v-if="isPasswordUpdating"
          class="size-3"
        />
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
        Удаление вашего аккаунта является необратимым действием. Все ваши задачи, колонки, данные AI
        и история будут безвозвратно удалены.
      </p>
      <button
        type="button"
        class="flex items-center justify-center gap-x-2 py-2 px-3 text-xs self-start font-semibold rounded-md border border-transparent bg-red-100 text-red-500 transition-colors duration-100 hover:bg-red-200 disabled:opacity-50 disabled:pointer-events-none"
        @click="uiStore.isDeleteUserModalOpen = true"
      >
        <Spinner
          v-if="isUserDeleting"
          class="size-3"
        />
        <span>Удалить аккаунт</span>
      </button>
    </div>
  </div>

  <Teleport to="body">
    <DeleteUserModal
      @connectRef="
        (el: HTMLElement) => {
          deleteModalRef = el
        }
      "
      @confirm="handleDeleteAccount"
    />
  </Teleport>
</template>
