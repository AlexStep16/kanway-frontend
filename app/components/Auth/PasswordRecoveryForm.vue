<script setup lang="ts">
import RegisterButton from '~/components/Buttons/RegisterButton.vue'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { z } from 'zod'
import { KeyRound, ArrowLeft } from 'lucide-vue-next'
import { AllowedAuthStepsEnum } from '~/enums/AllowedAuthStepsEnum'
import ShowPasswordButton from './ShowPasswordButton.vue'
import { toast } from 'vue-sonner'

const { mutate: recover, isPending: isRecovering, error: recoverError } = usePasswordRecovery()

const isPasswordDirty = ref(false)
const passwordRef = ref<HTMLInputElement | null>(null)
const isNavigating = ref(false)

const schema = toTypedSchema(
  z.object({
    password: z.string().min(10, 'Пароль должен содержать минимум 10 символов'),
  }),
)

const props = defineProps<{
  email?: string
}>()

const { errors, handleSubmit, defineField, submitCount } = useForm({
  validationSchema: schema,
  initialValues: {
    password: '',
  },
})

const [password, passwordAttrs] = defineField('password')

const onSubmit = handleSubmit((values) => {
  recover(
    { password: values.password },
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

const isProcessing = computed(() => isRecovering.value || isNavigating.value)
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
            placeholder="Введите новый пароль"
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
          v-if="recoverError && !isPasswordDirty"
        >
          <li class="list-inside">{{ recoverError.message }}</li>
        </ul>
      </div>
      <!-- End Form Group -->

      <RegisterButton
        :isProcessing="isProcessing"
        text="Восстановить пароль"
      />
      <div class="flex flex-wrap justify-between items-center mt-2 gap-2">
        <a
          class="inline-flex items-center gap-x-1 text-sm text-primary transition-colors duration-200 border-b-2 border-transparent hover:border-primary focus:outline-hidden font-medium"
          :href="
            props.email
              ? `/auth?step=${AllowedAuthStepsEnum.SIGN_IN}&payload=${getSafeBase64String(props.email)}`
              : '/auth'
          "
        >
          <ArrowLeft class="size-4" /> Назад
        </a>
      </div>
    </div>
  </form>
</template>
