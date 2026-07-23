<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'

import RegisterButton from '~/components/Buttons/RegisterButton.vue'
import { ArrowLeft, KeyRound } from '@lucide/vue'
import z from 'zod'
import ShowPasswordButton from './ShowPasswordButton.vue'
import { toast } from 'vue-sonner'

const props = withDefaults(
  defineProps<{
    initialEmail?: string
  }>(),
  {
    initialEmail: '',
  },
)

const { mutate: login, isPending: isLogging, error: loginError } = useLogin()

const isPasswordDirty = ref(false)
const passwordRef = ref<HTMLInputElement | null>(null)
const isNavigating = ref(false)

const schema = toTypedSchema(
  z.object({
    email: z.email('Неверный формат почты'),
    password: z.string().min(1, 'Пожалуйста, введите пароль'),
  }),
)

const { errors, handleSubmit, submitCount, defineField } = useForm({
  validationSchema: schema,
  initialValues: {
    email: props.initialEmail || '',
    password: '',
  },
})

const [email] = defineField('email')
const [password, passwordAttrs] = defineField('password')

watch(
  () => props.initialEmail,
  (newEmail) => {
    email.value = newEmail
  },
)

const onSubmit = handleSubmit((values) => {
  isPasswordDirty.value = false
  login(
    { email: values.email.trim(), password: values.password },
    {
      onSuccess: async () => {
        try {
          isNavigating.value = true
          await navigateTo('/workspace')
        } catch {
          toast.error('Произошла ошибка при переходе в пространство')
        } finally {
          isNavigating.value = false
        }
      },
    },
  )
})

const isPasswordVisible = ref(false)

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

const isProcessing = computed(() => isLogging.value || isNavigating.value)
</script>

<template>
  <form
    @submit.prevent="onSubmit"
    novalidate
  >
    <div class="grid gap-y-2">
      <!-- Form Group  -->
      <div class="flex flex-col gap-y-2">
        <div class="flex items-center relative">
          <KeyRound class="size-4 absolute left-4 text-gray-400" />
          <input
            type="password"
            id="password"
            name="password"
            ref="passwordRef"
            placeholder="Введите пароль"
            @input="isPasswordDirty = true"
            class="py-2.5 pr-4 pl-10 text-sm block w-full border-muted hover:border-gray-200 hover:bg-white focus-within:bg-white bg-muted rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
            v-model="password"
            v-bind="passwordAttrs"
          />
          <ShowPasswordButton
            :isPasswordVisible="isPasswordVisible"
            @toggle-password-visibility="handleTogglePasswordVisibility"
          />
        </div>
        <ul
          class="text-xs text-red-600"
          id="password-validation-error"
          v-if="errors.password && submitCount > 0"
        >
          <li class="list-inside">{{ errors.password }}</li>
        </ul>
        <ul
          class="text-xs text-red-600"
          id="password-auth-error"
          v-if="loginError && !isPasswordDirty"
        >
          <li class="list-inside">{{ loginError.message }}</li>
        </ul>
      </div>
      <!-- End Form Group -->

      <RegisterButton
        :isProcessing="isProcessing"
        text="Войти"
      />
      <div class="flex flex-wrap justify-between items-center mt-2 gap-2">
        <NuxtLink
          class="inline-flex items-center gap-x-1 text-sm text-primary transition-colors duration-200 border-b-2 border-transparent hover:border-primary focus:outline-hidden font-medium"
          to="/auth"
        >
          <ArrowLeft class="size-4" /> Назад
        </NuxtLink>

        <button
          class="inline-flex items-center gap-x-1 text-sm text-primary transition-colors duration-200 border-b-2 border-transparent hover:border-primary focus:outline-hidden font-medium"
          @click.prevent="$emit('forgot-password')"
        >
          Забыли пароль?
        </button>
      </div>
    </div>
  </form>
</template>
