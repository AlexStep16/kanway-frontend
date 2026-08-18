<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'

import RegisterButton from '~/components/Buttons/RegisterButton.vue'
import { CircleX, KeyRound } from '@lucide/vue'
import z from 'zod'
import ShowPasswordButton from './ShowPasswordButton.vue'
import { toast } from 'vue-sonner'
import { ResendStorageKeysEnum } from '~/enums/ResendStorageKeysEnum.js'
import { AllowedAuthStepsEnum } from '~/enums/AllowedAuthStepsEnum.js'

const props = withDefaults(
  defineProps<{
    initialEmail?: string
  }>(),
  {
    initialEmail: '',
  },
)

const { mutate: login, isPending: isLogging, error: loginError } = useLogin()

const passwordRef = ref<HTMLInputElement | null>(null)

const isNavigating = ref(false)
const isPasswordModifiedAfterSubmit = ref(false)

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

watch(submitCount, () => {
  isPasswordModifiedAfterSubmit.value = false
})

watch(password, () => {
  if (submitCount.value > 0) {
    isPasswordModifiedAfterSubmit.value = true
  }
})

const onSubmit = handleSubmit((values) => {
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

const { mutate: sendMagicLink, isPending: isSendingMagicLink } = useSendMagicLink()

function navigateToLoginVerify() {
  if (!email.value) return

  navigateTo({
    path: '/auth',
    query: {
      step: AllowedAuthStepsEnum.VERIFY_LOGIN,
      payload: getSafeBase64String(email.value.trim()),
    },
  })
}

function handleSendMagicLink() {
  if (!email.value) return

  const remainingResend = getRemainingResend(ResendStorageKeysEnum.LOGIN_VERIFICATION)

  if (remainingResend > 0) {
    navigateToLoginVerify()
    return
  }

  sendMagicLink(email.value, {
    onSuccess() {
      navigateToLoginVerify()
    },
  })
}

const isProcessing = computed(() => isLogging.value || isNavigating.value)
const isRegisterButtonDisabled = computed(() => !email.value)
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
            class="py-2.5 px-10 text-sm block w-full border-muted hover:border-gray-200 hover:bg-white focus-within:bg-white bg-muted rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
            :class="{
              'ring-1 ring-red-500 focus:ring-red-500 focus:border-red-500':
                errors.password && submitCount > 0 && !isPasswordModifiedAfterSubmit,
            }"
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
          v-if="errors.password && submitCount > 0 && !isPasswordModifiedAfterSubmit"
        >
          <li class="list-inside flex items-center gap-1">
            <CircleX class="size-3" /><span>{{ errors.password }}</span>
          </li>
        </ul>
        <ul
          class="text-xs text-red-600"
          id="password-auth-error"
          v-if="loginError && !isPasswordModifiedAfterSubmit"
        >
          <li class="list-inside flex items-center gap-1">
            <CircleX class="size-3" /><span>{{ loginError.message }}</span>
          </li>
        </ul>
      </div>
      <!-- End Form Group -->

      <RegisterButton
        :isProcessing="isProcessing"
        :isDisabled="isRegisterButtonDisabled"
        text="Войти"
      />

      <Button
        variant="outlinePrimary"
        size="lg"
        class="w-full"
        @click.prevent="handleSendMagicLink"
      >
        <div
          class="flex items-center gap-x-2"
          v-if="!isSendingMagicLink"
        >
          <Link
            class="size-3.5"
            stroke-width="2.5"
          />
          <span>Отправить ссылку для входа</span>
        </div>
        <Spinner v-else />
      </Button>

      <div class="flex flex-wrap justify-center items-center mt-4 gap-2">
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
