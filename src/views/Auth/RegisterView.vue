<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useRegister } from '@/composables/auth/mutations/useRegister'
import { z } from 'zod'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { toast } from 'vue-sonner'
import RegisterButton from '@/components/Buttons/RegisterButton.vue'
import KanwayLogo from '@assets/kanway_logo.svg?component'
import OTPForm from './OTPForm.vue'
import { initYaAuth } from '@/initYaAuth.js'
import { HSStaticMethods } from 'preline'

const { mutate: register, isPending: isRegistering } = useRegister()

const showOTPInput = ref(false)

const schema = toTypedSchema(
  z.object({
    email: z.email('Неверный формат'),
    password: z.string().min(10, 'Пароль должен содержать минимум 10 символов'),
    agreement: z.boolean().refine((val) => val === true, {
      message: 'Необходимо согласие с политикой конфиденциальности',
    }),
  }),
)

const { errors, handleSubmit, submitCount, defineField } = useForm({
  validationSchema: schema,
  initialValues: {
    email: '',
    password: '',
    agreement: false,
  },
})

const [email, emailAttrs] = defineField('email')
const [password, passwordAttrs] = defineField('password')
const [agreement, agreementAttrs] = defineField('agreement')

const onSubmit = handleSubmit(
  (values) => {
    register(
      { email: values.email, password: values.password },
      {
        onSuccess: () => {
          showOTPInput.value = true
        },
      },
    )
  },
  (values) => {
    if (values.errors.password) toast.error(values.errors.password)
    if (values.errors.agreement) toast.error(values.errors.agreement)
  },
)

onMounted(() => {
  HSStaticMethods.autoInit()
  initYaAuth()
})
</script>

<template>
  <div class="w-full h-screen flex items-center justify-center">
    <div
      class="size-full sm:w-100 sm:h-auto bg-white sm:border sm:border-gray-200 sm:rounded-xl shadow-2xs overflow-y-auto"
      v-if="!showOTPInput"
    >
      <div class="p-4 pt-7 sm:p-7">
        <div class="text-center flex justify-center flex-col items-center">
          <a href="/">
            <KanwayLogo class="h-8 sm:h-10" />
          </a>
          <h1 class="block mt-4 text-2xl font-bold text-gray-800">Регистрация</h1>
          <p class="mt-2 text-sm text-gray-600">
            Уже есть аккаунт?
            <a
              class="text-blue-500 decoration-2 hover:underline focus:outline-hidden focus:underline font-medium"
              href="/sign-in"
            >
              Войти
            </a>
          </p>
        </div>

        <div class="mt-5">
          <div id="yandex-auth"></div>

          <div
            class="py-3 flex items-center text-xs text-gray-400 uppercase before:flex-1 before:border-t before:border-gray-200 before:me-6 after:flex-1 after:border-t after:border-gray-200 after:ms-6"
          >
            Или
          </div>

          <!-- Form -->
          <form @submit.prevent="onSubmit" novalidate>
            <div class="grid gap-y-4">
              <!-- Form Group -->
              <div>
                <label for="email" class="block text-sm mb-2">Почта</label>
                <div class="relative">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    class="py-2.5 sm:py-3 px-4 block w-full border-gray-200 rounded-lg sm:text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                    v-model="email"
                    v-bind="emailAttrs"
                  />
                </div>
                <ul
                  class="text-xs text-red-600 mt-2"
                  id="email-error"
                  v-if="errors.email && submitCount > 0"
                >
                  <li class="list-disc list-inside">{{ errors.email }}</li>
                </ul>
              </div>
              <!-- End Form Group -->

              <!-- Form Group -->
              <div class="flex flex-col gap-y-2">
                <div>
                  <label for="password" class="block text-sm mb-2">Пароль</label>
                  <div class="relative">
                    <input
                      id="password"
                      type="password"
                      name="password"
                      class="py-2.5 sm:py-3 px-4 block w-full border-gray-200 rounded-lg sm:text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
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

              <!-- Checkbox -->
              <div class="flex items-center">
                <div class="flex">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    class="shrink-0 mt-0.5 border-gray-200 cursor-pointer rounded-sm text-blue-500 focus:ring-blue-500"
                    :class="{
                      'border-red-400! bg-red-100': errors.agreement,
                    }"
                    v-model="agreement"
                    v-bind="agreementAttrs"
                  />
                </div>
                <div class="ms-3 text-wrap">
                  <label for="remember-me" class="text-sm"
                    >Я принимаю
                    <a
                      class="text-blue-500 decoration-2 hover:underline focus:outline-hidden focus:underline font-medium"
                      href="#"
                      >Правила и политику конфиденциальности</a
                    ></label
                  >
                </div>
              </div>
              <!-- End Checkbox -->

              <RegisterButton :isProcessing="isRegistering" text="Регистрация" />
            </div>
          </form>
          <!-- End Form -->
        </div>
      </div>
    </div>

    <OTPForm v-else />
  </div>
</template>
