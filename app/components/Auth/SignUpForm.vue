<script setup lang="ts">
import z from 'zod'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'

import RegisterButton from '~/components/Buttons/RegisterButton.vue'
import { AllowedAuthStepsEnum } from '~/enums/AllowedAuthStepsEnum'
import PasswordInput from './PasswordInput.vue'
import { toast } from 'vue-sonner'
import { CircleX } from '@lucide/vue'

const route = useRoute()
const redirect: ComputedRef<string | undefined> = computed(
  () => route.query.redirect as string | undefined,
)

const props = withDefaults(
  defineProps<{
    initialEmail?: string
  }>(),
  {
    initialEmail: '',
  },
)

const {
  mutate: register,
  isPending: isRegistering,
  error: registerError,
  reset: resetRegister,
} = useRegister()

const isNavigating = ref(false)
const isPasswordModifiedAfterSubmit = ref(false)

const schema = toTypedSchema(
  z.object({
    email: z.email('Неверный формат почты'),
    password: z
      .string()
      .min(10, 'Пароль должен быть не менее 10 символов')
      .max(128, 'Пароль должен быть не более 128 символов'),
  }),
)

const { errors, handleSubmit, defineField, submitCount } = useForm({
  validationSchema: schema,
  initialValues: {
    email: props.initialEmail || '',
    password: '',
  },
})

const [email] = defineField('email')
const [password, passwordAttrs] = defineField('password')

watch(submitCount, () => {
  isPasswordModifiedAfterSubmit.value = false
})

watch([email, password], () => {
  if (registerError.value) {
    resetRegister()
  }
})

watch(password, () => {
  if (submitCount.value > 0) {
    isPasswordModifiedAfterSubmit.value = true
  }
})

watch(
  () => props.initialEmail,
  (newEmail) => {
    email.value = newEmail
  },
)

const onSubmit = handleSubmit((values) => {
  register(
    { email: values.email.trim(), password: values.password },
    {
      onSuccess: async () => {
        try {
          isNavigating.value = true
          await navigateTo({
            path: '/auth',
            query: {
              step: AllowedAuthStepsEnum.VERIFY_EMAIL,
              payload: getSafeBase64String(values.email.trim()),
              backStep: AllowedAuthStepsEnum.SIGN_UP,
              redirect: redirect.value,
            },
          })
        } catch {
          toast.error('Произошла ошибка при переходе на страницу подтверждения почты')
        } finally {
          isNavigating.value = false
        }
      },
    },
  )
})

const passwordStrength = computed(() => passwordInputRef.value?.passwordStrength ?? null)
const passwordInputRef = ref<InstanceType<typeof PasswordInput> | null>(null)

const isProcessing = computed(() => isRegistering.value || isNavigating.value)
const isRegisterButtonDisabled = computed(() =>
  passwordStrength.value ? passwordStrength.value.score < 2 : true,
)
</script>

<template>
  <form
    @submit.prevent="onSubmit"
    novalidate
  >
    <div class="grid gap-y-2">
      <PasswordInput
        ref="passwordInputRef"
        v-model="password"
        v-bind="passwordAttrs"
        :error="errors.password"
        :is-password-modified-after-submit="isPasswordModifiedAfterSubmit"
        :submit-count="submitCount"
        placeholder="Пароль"
        @submit="onSubmit"
      />

      <ul
        class="text-xs text-red-600"
        id="password-auth-error"
        v-if="registerError && !isPasswordModifiedAfterSubmit"
      >
        <li class="list-inside flex items-center gap-1">
          <CircleX class="size-3 shrink-0" /><span>{{ registerError.message }}</span>
        </li>
      </ul>

      <RegisterButton
        :isProcessing="isProcessing"
        :is-disabled="isRegisterButtonDisabled"
        text="Создать аккаунт"
      />
      <p class="text-xs text-gray-500 text-center">
        Создавая аккаунт, вы соглашаетесь с нашими
        <NuxtLink
          to="/terms"
          class="text-blue-500 hover:underline"
        >
          Условиями использования
        </NuxtLink>
        и
        <NuxtLink
          to="/privacy"
          class="text-blue-500 hover:underline"
        >
          Политикой конфиденциальности
        </NuxtLink>
      </p>

      <SocialButtons />
    </div>
  </form>
</template>
