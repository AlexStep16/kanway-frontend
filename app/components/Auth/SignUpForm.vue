<script setup lang="ts">
import z from 'zod'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'

import RegisterButton from '~/components/Buttons/RegisterButton.vue'
import { KeyRound } from '@lucide/vue'
import { AllowedAuthStepsEnum } from '~/enums/AllowedAuthStepsEnum'
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

const { mutate: register, isPending: isRegistering } = useRegister()

const isPasswordDirty = ref(false)
const isPasswordVisible = ref(false)

const isNavigating = ref(false)

const passwordRef = ref<HTMLInputElement | null>(null)

const schema = toTypedSchema(
  z.object({
    email: z.email('Неверный формат почты'),
    password: z.string().min(10, 'Пароль должен быть не менее 10 символов'),
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

watch(
  () => props.initialEmail,
  (newEmail) => {
    email.value = newEmail
  },
)

const onSubmit = handleSubmit((values) => {
  isPasswordDirty.value = false
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

const requirements = [
  { label: 'Минимальное количество символов: 10', check: (val: string) => val.length >= 10 },
]

const checklist = computed(() => {
  return requirements.map((req) => ({
    label: req.label,
    isMet: req.check(password.value || ''),
  }))
})

const isProcessing = computed(() => isRegistering.value || isNavigating.value)

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
  <form
    @submit.prevent="onSubmit"
    novalidate
  >
    <div class="grid gap-y-2">
      <div class="flex flex-col gap-y-2">
        <div class="flex items-center relative">
          <KeyRound class="size-4 absolute left-4 text-gray-400" />
          <input
            type="password"
            id="password"
            name="password"
            @input="isPasswordDirty = true"
            class="py-2.5 px-10 text-sm block w-full border-muted hover:border-gray-200 hover:bg-white focus-within:bg-white bg-muted rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
            v-model="password"
            v-bind="passwordAttrs"
            placeholder="Пароль"
            ref="passwordRef"
          />
          <ShowPasswordButton
            :isPasswordVisible="isPasswordVisible"
            @toggle-password-visibility="handleTogglePasswordVisibility"
          />
        </div>
        <ul
          class="text-xs mb-2"
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

      <RegisterButton
        :isProcessing="isProcessing"
        text="Создать аккаунт"
      />

      <SocialButtons />
    </div>
  </form>
</template>
