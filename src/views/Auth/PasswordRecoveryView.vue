<script setup lang="ts">
import RegisterButton from '@/components/Buttons/RegisterButton.vue'
import { toTypedSchema } from '@vee-validate/zod'
import { onMounted, ref } from 'vue'
import { useForm } from 'vee-validate'
import { z } from 'zod'
import { toast } from 'vue-sonner'
import { useData } from 'vike-vue/useData'
import { usePasswordRecovery } from '@/composables/auth/mutations/usePasswordRecovery'
import { useValidateToken } from '@/composables/auth/mutations/useValidateToken'
import { TokenTypesEnum } from '@/enums/TokenTypesEnum'
import { BackendError } from '@/utils/errors'
import ExpiredToken from '../../components/Auth/ExpiredToken.vue'
import Spinner from '@/components/Loader/Spinner.vue'
import InvalidToken from '../../components/Auth/InvalidToken.vue'
import { useSendPasswordRecoveryEmailByToken } from '@/composables/auth/mutations/useSendPasswordRecoveryEmailByToken'
import KanwayLogo from '@assets/kanway_logo.svg?component'
import { HSStaticMethods } from 'preline'
import BackgroundCircles from '@/components/BackgroundCircles.vue'

const { mutate: recover } = usePasswordRecovery()
const { mutate: resend, isPending: isResending } = useSendPasswordRecoveryEmailByToken()
const { mutate: validateToken, isPending: isValidating, error } = useValidateToken()

const isTokenValid = ref(false)

const schema = toTypedSchema(
  z.object({
    password: z.string().min(10, 'Пароль должен содержать минимум 10 символов'),
  }),
)

const { token } = useData<{ token: string }>()

const { handleSubmit, defineField } = useForm({
  validationSchema: schema,
  initialValues: {
    password: '',
  },
})

const [password, passwordAttrs] = defineField('password')

const onSubmit = handleSubmit(
  (values) => {
    recover(
      { password: values.password, token },
      {
        onSuccess: () => {
          // Handle successful registration, e.g., redirect to dashboard
        },
      },
    )
  },
  (values) => {
    if (values.errors.password) toast.error(values.errors.password)
  },
)

async function handleResend() {
  resend({ token })
}

validateToken(
  { token, type: TokenTypesEnum.RESET_PASSWORD },
  {
    onSuccess: () => {
      isTokenValid.value = true
    },
  },
)

onMounted(() => {
  HSStaticMethods.autoInit()
})
</script>

<template>
  <div class="w-full h-screen flex items-center justify-center">
    <BackgroundCircles />
    <div
      class="size-full sm:w-[400px] sm:h-auto bg-white sm:border sm:border-gray-200 sm:rounded-xl shadow-2xs overflow-y-auto"
    >
      <div class="p-4 pt-7 sm:p-7" v-if="!isValidating">
        <div class="text-center flex justify-center flex-col items-center">
          <a href="/" class="mb-4">
            <KanwayLogo class="h-8 sm:h-10" />
          </a>

          <template v-if="isTokenValid">
            <h1 class="block text-2xl font-bold text-gray-800">Восстановление пароля</h1>

            <p class="mt-2 text-sm text-gray-600">Придумайте новый пароль</p>
          </template>

          <template v-else-if="error">
            <ExpiredToken
              :type="TokenTypesEnum.RESET_PASSWORD"
              :isResending="isResending"
              @resend="handleResend"
              v-if="(error as BackendError).code === 410"
            />
            <InvalidToken v-if="(error as BackendError).code === 404" />
          </template>
        </div>

        <div class="mt-5" v-if="isTokenValid">
          <!-- Form -->
          <form @submit.prevent="onSubmit" novalidate>
            <div class="grid gap-y-4">
              <!-- Form Group -->
              <div class="flex flex-col gap-y-2">
                <div>
                  <label for="password" class="block text-sm mb-2">Новый пароль</label>
                  <div class="relative">
                    <input
                      id="password"
                      type="password"
                      name="password"
                      class="py-2.5 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                      v-model="password"
                      v-bind="passwordAttrs"
                    />
                    <button
                      type="button"
                      data-hs-toggle-password='{
                        "target": "#password"
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
                </div>

                <div
                  class="flex items-center text-gray-500 gap-x-2 text-custom-sm"
                  :class="{
                    'text-green-500': password.length >= 10,
                  }"
                  v-if="password"
                >
                  <span>•</span>
                  <span>Минимальное количество символов - 10</span>
                </div>
              </div>
              <!-- End Form Group -->

              <RegisterButton :isProcessing="false" text="Сохранить и войти" />
            </div>
          </form>
          <!-- End Form -->
        </div>
      </div>

      <div
        class="size-full sm:h-[400px] flex flex-col gap-y-2 items-center justify-center text-gray-500"
        v-else
      >
        <Spinner class="size-7" />

        <p class="text-sm">Проверяем ссылку</p>
      </div>
    </div>
  </div>
</template>
