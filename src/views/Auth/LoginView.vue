<script setup lang="ts">
import { onMounted } from 'vue'
import { useLogin } from '@/composables/auth/mutations/useLogin'

import { z } from 'zod'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import RegisterButton from '@/components/Buttons/RegisterButton.vue'
import { HttpError } from '@/utils/errors'
import { toast } from 'vue-sonner'
import KanwayLogo from '@assets/kanway_logo.svg?component'
import { initYaAuth } from '@/initYaAuth.js'
import { HSStaticMethods } from 'preline'

const { mutate: login, isPending: isLogging } = useLogin()

const schema = toTypedSchema(
  z.object({
    email: z.email('Неверный формат'),
    password: z.string().min(1, 'Пожалуйста, введите пароль'),
  }),
)

const { errors, handleSubmit, submitCount, defineField } = useForm({
  validationSchema: schema,
  initialValues: {
    email: '',
    password: '',
  },
})

const [email, emailAttrs] = defineField('email')
const [password, passwordAttrs] = defineField('password')

const onSubmit = handleSubmit((values) => {
  login(
    { email: values.email, password: values.password },
    {
      onError: (e) => {
        if (e instanceof HttpError && e.status === 401) {
          toast.error('Неверный логин или пароль')
        } else {
          toast.error('Произошла ошибка при входе')
        }
      },
    },
  )
})

onMounted(() => {
  HSStaticMethods.autoInit()
  initYaAuth()
})
</script>

<template>
  <div class="w-full h-screen flex items-center justify-center">
    <div
      class="size-full sm:w-[400px] sm:h-auto bg-white sm:border sm:border-gray-200 sm:rounded-xl shadow-2xs overflow-y-auto"
    >
      <div class="p-4 pt-7 sm:p-7">
        <div class="text-center flex justify-center flex-col items-center">
          <a href="/">
            <KanwayLogo class="h-8 sm:h-10" />
          </a>
          <h1 class="block text-2xl mt-4 font-bold text-gray-800">Вход</h1>
          <p class="mt-2 text-sm text-gray-600">
            Ещё нет аккаунта?
            <a
              class="text-blue-600 decoration-2 hover:underline focus:outline-hidden focus:underline font-medium"
              href="/sign-up"
            >
              Зарегистрироваться
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
              <div>
                <div class="flex flex-wrap justify-between items-center gap-2">
                  <label for="password" class="block text-sm mb-2">Пароль</label>
                  <a
                    class="inline-flex items-center gap-x-1 text-sm text-blue-500 decoration-2 hover:underline focus:outline-hidden focus:underline font-medium"
                    href="/forgot-password"
                    >Забыли пароль?</a
                  >
                </div>
                <div class="relative">
                  <input
                    type="password"
                    id="password"
                    name="password"
                    class="py-2.5 sm:py-3 px-4 block w-full border-gray-200 rounded-lg sm:text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                    v-model="password"
                    v-bind="passwordAttrs"
                  />
                </div>
                <ul
                  class="text-xs text-red-600 mt-2"
                  id="password-error"
                  v-if="errors.password && submitCount > 0"
                >
                  <li class="list-disc list-inside">{{ errors.password }}</li>
                </ul>
              </div>
              <!-- End Form Group -->

              <RegisterButton :isProcessing="isLogging" text="Войти" />
            </div>
          </form>
          <!-- End Form -->
        </div>
      </div>
    </div>
  </div>
</template>
