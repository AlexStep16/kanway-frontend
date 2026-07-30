<script setup lang="ts">
import DeleteUserModal from '~/components/Modals/DeleteUserModal.vue'
import ShowPasswordButton from '~/components/Auth/ShowPasswordButton.vue'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import { useForm } from 'vee-validate'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'
import YandexAuth from '~/views/Auth/YandexAuth.vue'
import VkAuth from '~/views/Auth/VkAuth.vue'
import YandexLogo from '~/assets/yandex_logo.svg?skipsvgo'
import VkLogo from '~/assets/vk_logo.svg?skipsvgo'
import { unlinkAccount } from '~/services/auth'
import dayjs from 'dayjs'

const isPasswordDirty = ref(false)
const passwordRef = ref<HTMLInputElement | null>(null)
const currentPasswordRef = ref<HTMLInputElement | null>(null)
const passwordConfirmationRef = ref<HTMLInputElement | null>(null)
const deleteModalRef = ref<HTMLElement | null>(null)

const uiStore = useUIStore()
const { data: user } = useUser()
const hasPassword = computed(() => user.value?.hasPassword ?? false)

const { mutate: recoverUser, isPending: isUserRecovering } = useRecoverUser()
const { mutate: deleteUser, isPending: isUserDeleting } = useDeleteUser()

const queryClient = useQueryClient()

const schema = toTypedSchema(
  z
    .object({
      currentPassword: z.string().optional(),
      password: z.string().min(10, { message: 'Пароль должен содержать минимум 10 символов' }),
      passwordConfirmation: z.string().min(1, { message: 'Повторите новый пароль' }),
    })
    .superRefine((values, context) => {
      if (hasPassword.value && !values.currentPassword) {
        context.addIssue({
          code: 'custom',
          path: ['currentPassword'],
          message: 'Текущий пароль должен быть заполнен',
        })
      }

      if (values.password !== values.passwordConfirmation) {
        context.addIssue({
          code: 'custom',
          path: ['passwordConfirmation'],
          message: 'Пароли не совпадают',
        })
      }
    }),
)

const { errors, handleSubmit, submitCount, defineField, resetForm } = useForm({
  validationSchema: schema,
  initialValues: {
    currentPassword: '',
    password: '',
    passwordConfirmation: '',
  },
})

const [currentPassword, currentPasswordAttrs] = defineField('currentPassword')
const [password, passwordAttrs] = defineField('password')
const [passwordConfirmation, passwordConfirmationAttrs] = defineField('passwordConfirmation')

// --- Mutations ---
const {
  mutate: updateUserPassword,
  isPending: isPasswordUpdating,
  error: updatePasswordError,
} = useUpdatePassword()

const { mutate: unlinkSocialAccount, isPending: isSocialAccountUpdating } = useMutation({
  mutationFn: unlinkAccount,
  onSuccess: () => {
    toast.success('Аккаунт успешно отвязан')
    queryClient.invalidateQueries({ queryKey: userKeys.me })
  },
})

const handleSavePassword = handleSubmit((values) => {
  if (isSavePasswordDisabled.value) return

  isPasswordDirty.value = false

  updateUserPassword(
    {
      password: values.password,
      ...(hasPassword.value ? { currentPassword: values.currentPassword } : {}),
    },
    {
      onSuccess: () => {
        currentPassword.value = ''
        password.value = ''
        passwordConfirmation.value = ''
        isPasswordDirty.value = false
        isPasswordVisible.value = false
        isPasswordConfirmationVisible.value = false

        if (passwordRef.value) {
          passwordRef.value.type = 'password'
          passwordRef.value.dispatchEvent(new Event('input'))
        }

        if (passwordConfirmationRef.value) {
          passwordConfirmationRef.value.type = 'password'
          passwordConfirmationRef.value.dispatchEvent(new Event('input'))
        }

        resetForm()
      },
    },
  )
})

const isSavePasswordDisabled = computed(
  () =>
    (hasPassword.value && !currentPassword.value) ||
    !password.value ||
    !passwordConfirmation.value ||
    isPasswordUpdating.value,
)

function handleUnlinkSocialAccount(provider: 'yandex' | 'vk') {
  unlinkSocialAccount(provider)
}

const requirements = [
  { label: 'Минимальное количество символов: 10', check: (val: string) => val.length >= 10 },
]

const checklist = computed(() => {
  return requirements.map((req) => ({
    label: req.label,
    isMet: req.check(password.value || ''),
  }))
})

const isPasswordVisible = ref(false)
const isCurrentPasswordVisible = ref(false)
const isPasswordConfirmationVisible = ref(false)

function handleToggleCurrentPasswordVisibility() {
  if (!currentPasswordRef.value) return

  if (currentPasswordRef.value.type === 'password') {
    currentPasswordRef.value.type = 'text'
    isCurrentPasswordVisible.value = true
  } else {
    currentPasswordRef.value.type = 'password'
    isCurrentPasswordVisible.value = false
  }
}

function handleTogglePasswordVisibility() {
  if (!passwordRef.value) return

  if (passwordRef.value.type === 'password') {
    passwordRef.value.type = 'text'
    isPasswordVisible.value = true
  } else {
    passwordRef.value.type = 'password'
    isPasswordVisible.value = false
  }
}

function handleTogglePasswordConfirmationVisibility() {
  if (!passwordConfirmationRef.value) return

  if (passwordConfirmationRef.value.type === 'password') {
    passwordConfirmationRef.value.type = 'text'
    isPasswordConfirmationVisible.value = true
  } else {
    passwordConfirmationRef.value.type = 'password'
    isPasswordConfirmationVisible.value = false
  }
}

const deleteTime = computed(() => {
  if (!user.value?.deletedTime) return null

  return dayjs(user.value.deletedTime).calendar()
})
</script>

<template>
  <div class="flex flex-col gap-y-3">
    <div>
      <h3 class="text-lg font-medium text-gray-800 pb-1 sm:pb-2">Безопасность</h3>
      <h4 class="text-sm font-medium text-gray-800">Связанные аккаунты</h4>
      <p class="text-sm text-gray-600">Используйте их для входа в Kanway.</p>
    </div>

    <div class="max-w-110 divide-y divide-gray-200 border-y border-gray-200">
      <div class="flex items-center justify-between gap-3 py-3">
        <div class="flex items-center gap-3 min-w-0">
          <YandexLogo class="size-6 shrink-0" />
          <div class="min-w-0">
            <p class="text-sm font-medium text-gray-800">Яндекс</p>
            <p class="text-xs text-gray-500">
              {{ user?.yandexUserId ? 'Аккаунт привязан' : 'Аккаунт не привязан' }}
            </p>
          </div>
        </div>
        <button
          v-if="user?.yandexUserId"
          type="button"
          class="shrink-0 py-2 px-3 text-xs font-medium rounded-md text-red-600 hover:bg-red-50 disabled:opacity-50"
          :disabled="isSocialAccountUpdating"
          @click="handleUnlinkSocialAccount('yandex')"
        >
          Отвязать
        </button>
        <YandexAuth
          v-else
          is-account-linking
          label="Привязать"
        />
      </div>

      <div class="flex items-center justify-between gap-3 py-3">
        <div class="flex items-center gap-3 min-w-0">
          <VkLogo class="size-6 shrink-0" />
          <div class="min-w-0">
            <p class="text-sm font-medium text-gray-800">VK</p>
            <p class="text-xs text-gray-500">
              {{ user?.vkUserId ? 'Аккаунт привязан' : 'Аккаунт не привязан' }}
            </p>
          </div>
        </div>
        <button
          v-if="user?.vkUserId"
          type="button"
          class="shrink-0 py-2 px-3 text-xs font-medium rounded-md text-red-600 hover:bg-red-50 disabled:opacity-50"
          :disabled="isSocialAccountUpdating"
          @click="handleUnlinkSocialAccount('vk')"
        >
          Отвязать
        </button>
        <VkAuth
          v-else
          is-account-linking
          label="Привязать"
        />
      </div>
    </div>
  </div>

  <div class="flex flex-col gap-y-2">
    <h3 class="text-lg font-medium text-gray-800 pb-1 sm:pb-2">
      {{ hasPassword ? 'Сменить пароль' : 'Задать пароль' }}
    </h3>

    <div class="flex flex-col gap-y-3">
      <div class="flex flex-col gap-y-1">
        <div class="max-w-80 flex flex-col gap-y-1">
          <div
            v-if="hasPassword"
            class="flex flex-col gap-y-1"
          >
            <label class="text-custom-sm font-medium text-gray-500">Текущий пароль</label>
            <div class="relative">
              <input
                type="password"
                ref="currentPasswordRef"
                id="settings-old-password"
                class="w-full border-none bg-gray-100 rounded-md pl-3 pr-10 truncate py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                :class="{ 'ring-1 ring-red-500': errors?.currentPassword && submitCount > 0 }"
                placeholder="Текущий пароль"
                v-model="currentPassword"
                v-bind="currentPasswordAttrs"
              />
              <ShowPasswordButton
                :isPasswordVisible="isCurrentPasswordVisible"
                @toggle-password-visibility="handleToggleCurrentPasswordVisibility"
              />
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
                  <label class="text-custom-sm font-medium text-gray-500">Новый пароль</label>
                  <div class="relative">
                    <input
                      type="password"
                      id="strong-password"
                      class="w-full border-none bg-gray-100 rounded-md pl-3 pr-10 truncate py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      :class="{ 'ring-1 ring-red-500': errors?.password && submitCount > 0 }"
                      placeholder="Новый пароль"
                      ref="passwordRef"
                      @input="isPasswordDirty = true"
                      v-model="password"
                      v-bind="passwordAttrs"
                    />
                    <ShowPasswordButton
                      :isPasswordVisible="isPasswordVisible"
                      @toggle-password-visibility="handleTogglePasswordVisibility"
                    />
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
                  <div class="flex flex-col gap-y-1">
                    <label class="text-custom-sm font-medium text-gray-500">
                      Повторите новый пароль
                    </label>
                    <div class="relative">
                      <input
                        type="password"
                        id="settings-password-confirmation"
                        class="w-full border-none bg-gray-100 rounded-md pl-3 pr-10 truncate py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        :class="{
                          'ring-1 ring-red-500': errors?.passwordConfirmation && submitCount > 0,
                        }"
                        placeholder="Повторите новый пароль"
                        ref="passwordConfirmationRef"
                        @input="isPasswordDirty = true"
                        v-model="passwordConfirmation"
                        v-bind="passwordConfirmationAttrs"
                      />
                      <ShowPasswordButton
                        :isPasswordVisible="isPasswordConfirmationVisible"
                        @toggle-password-visibility="handleTogglePasswordConfirmationVisibility"
                      />
                    </div>
                    <p
                      v-if="errors?.passwordConfirmation && submitCount > 0"
                      class="text-red-500 text-xs mt-1"
                    >
                      {{ errors.passwordConfirmation }}
                    </p>
                  </div>
                  <ul
                    class="text-xs text-red-600"
                    id="password-auth-error"
                    v-if="updatePasswordError && !isPasswordDirty"
                  >
                    <li class="list-inside">{{ updatePasswordError.message }}</li>
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

    <div
      class="flex flex-col gap-y-4"
      v-if="!user?.isDeleted"
    >
      <p class="text-sm text-gray-600 max-w-110">
        Удаление вашего аккаунта является необратимым действием. Все ваши задачи, колонки, данные AI
        и история будут безвозвратно удалены через 30 дней.
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
    <div
      class="flex flex-col gap-y-4"
      v-else
    >
      <p class="text-sm text-gray-600 max-w-110">
        Удаление вашего аккаунта запланировано. Все ваши задачи, колонки, данные AI и история будут
        безвозвратно удалены <b>{{ deleteTime }}</b
        >.
      </p>
      <button
        type="button"
        class="flex items-center justify-center gap-x-2 py-2 px-3 text-xs self-start font-semibold rounded-md border border-transparent bg-blue-100 text-blue-500 transition-colors duration-100 hover:bg-blue-200 disabled:opacity-50 disabled:pointer-events-none"
        @click="recoverUser()"
      >
        <Spinner
          v-if="isUserRecovering"
          class="size-3"
        />
        <span>Восстановить аккаунт</span>
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
      @confirm="deleteUser"
      v-model:open="uiStore.isDeleteUserModalOpen"
    />
  </Teleport>
</template>
