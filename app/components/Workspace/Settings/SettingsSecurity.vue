<script setup lang="ts">
import DeleteUserModal from '~/components/Modals/DeleteUserModal.vue'
import ShowPasswordButton from '~/components/Auth/ShowPasswordButton.vue'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import { useForm } from 'vee-validate'

const isPasswordDirty = ref(false)
const passwordRef = ref<HTMLInputElement | null>(null)
const currentPasswordRef = ref<HTMLInputElement | null>(null)
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
const {
  mutate: updateUserPassword,
  isPending: isPasswordUpdating,
  error: updatePasswordError,
} = useUpdatePassword()

const { mutate: deleteAccount, isPending: isUserDeleting } = useDeleteUser()

const handleSavePassword = handleSubmit((values) => {
  if (isSavePasswordDisabled.value) return

  isPasswordDirty.value = false

  updateUserPassword(
    { password: values.password, currentPassword: values.currentPassword },
    {
      onSuccess: () => {
        currentPassword.value = ''
        password.value = ''
        isPasswordDirty.value = false
        isPasswordVisible.value = false

        if (passwordRef.value) {
          passwordRef.value.type = 'password'
          passwordRef.value.dispatchEvent(new Event('input'))
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

const isPasswordVisible = ref(false)
const isCurrentPasswordVisible = ref(false)

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
</script>

<template>
  <div class="flex flex-col gap-y-2">
    <h3 class="text-lg font-medium text-gray-800 pb-1 sm:pb-2">Безопасность аккаунта</h3>

    <div class="flex flex-col gap-y-3">
      <div class="flex flex-col gap-y-1">
        <div class="max-w-80 flex flex-col gap-y-1">
          <div class="flex flex-col gap-y-1">
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
