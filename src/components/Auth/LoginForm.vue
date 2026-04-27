<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'

import RegisterButton from '@/components/Buttons/RegisterButton.vue'
import { ArrowLeft, KeyRound, Mail } from 'lucide-vue-next'
import z from 'zod'
import { useLogin } from '@/composables/auth/mutations/useLogin'

const { mutate: login, isPending: isLogging } = useLogin()

const schema = toTypedSchema(
  z.object({
    email: z.email('Неверный формат почты'),
    password: z.string().min(1, 'Пожалуйста, введите пароль'),
  }),
)

const { errors, handleSubmit, submitCount, defineField } = useForm({
  validationSchema: schema,
  initialValues: {
    email: sessionStorage.getItem('saved_auth_email') || '',
    password: '',
  },
})

const [email, emailAttrs] = defineField('email')
const [password, passwordAttrs] = defineField('password')

const onSubmit = handleSubmit((values) => {
  login({ email: values.email.trim(), password: values.password })
})
</script>

<template>
  <form @submit.prevent="onSubmit" novalidate>
    <div class="grid gap-y-2">
      <!-- Form Group -->
      <div>
        <div class="flex items-center relative">
          <Mail class="size-4 absolute left-4 text-gray-400" />
          <input
            type="email"
            id="email"
            name="email"
            class="py-2.5 sm:py-3 pr-4 pl-10 block w-full border-muted hover:border-gray-200 hover:bg-white focus-within:bg-white bg-muted rounded-lg sm:text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
            v-model="email"
            v-bind="emailAttrs"
            placeholder="Введите почту"
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

      <!-- Form Group  -->
      <div>
        <div class="flex items-center relative">
          <KeyRound class="size-4 absolute left-4 text-gray-400" />
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Введите пароль"
            class="py-2.5 sm:py-3 pr-4 pl-10 block w-full border-muted hover:border-gray-200 hover:bg-white focus-within:bg-white bg-muted rounded-lg sm:text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
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
      <div class="flex flex-wrap justify-between items-center mt-2 gap-2">
        <a
          class="inline-flex items-center gap-x-1 text-sm text-primary transition-colors duration-200 border-b-2 border-transparent hover:border-primary focus:outline-hidden font-medium"
          href="/auth"
        >
          <ArrowLeft class="size-4" /> Назад
        </a>

        <a
          class="inline-flex items-center gap-x-1 text-sm text-primary transition-colors duration-200 border-b-2 border-transparent hover:border-primary focus:outline-hidden font-medium"
          href="/forgot-password"
          >Забыли пароль?</a
        >
      </div>
    </div>
  </form>
</template>
