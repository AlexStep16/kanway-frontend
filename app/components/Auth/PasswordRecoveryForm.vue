<script setup lang="ts">
import RegisterButton from '~/components/Buttons/RegisterButton.vue'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { z } from 'zod'
import { ArrowLeft } from '@lucide/vue'
import PasswordInput from './PasswordInput.vue'
import { toast } from 'vue-sonner'
import { AllowedAuthStepsEnum } from '~/enums/AllowedAuthStepsEnum.js'

const { mutate: recover, isPending: isRecovering, error: recoverError } = usePasswordRecovery()

const isNavigating = ref(false)
const isPasswordModifiedAfterSubmit = ref(false)

const schema = toTypedSchema(
  z.object({
    password: z
      .string()
      .min(10, 'Пароль должен содержать не менее 10 символов')
      .max(128, 'Пароль должен быть не более 128 символов'),
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

const passwordInputRef = ref<InstanceType<typeof PasswordInput> | null>(null)
const passwordStrength = computed(() => passwordInputRef.value?.passwordStrength ?? null)

watch(submitCount, () => {
  isPasswordModifiedAfterSubmit.value = false
})

watch(password, () => {
  if (submitCount.value > 0) {
    isPasswordModifiedAfterSubmit.value = true
  }
})

const isProcessing = computed(() => isRecovering.value || isNavigating.value)
const isRegisterButtonDisabled = computed(
  () => !password.value || (passwordStrength.value ? passwordStrength.value.score < 2 : true),
)
</script>

<template>
  <form
    @submit.prevent="onSubmit"
    novalidate
  >
    <div class="grid gap-y-2">
      <!-- Form Group  -->
      <div class="flex flex-col gap-y-2">
        <PasswordInput
          ref="passwordInputRef"
          v-model="password"
          v-bind="passwordAttrs"
          :error="errors.password"
          :submit-count="submitCount"
          :is-password-modified-after-submit="isPasswordModifiedAfterSubmit"
          placeholder="Введите новый пароль"
          @submit="onSubmit"
        />
        <ul
          class="text-xs text-red-600"
          id="password-auth-error"
          v-if="recoverError && !isPasswordModifiedAfterSubmit"
        >
          <li class="list-inside">{{ recoverError.message }}</li>
        </ul>
      </div>

      <RegisterButton
        :isProcessing="isProcessing"
        :isDisabled="isRegisterButtonDisabled"
        text="Восстановить пароль"
      />
      <div class="flex flex-wrap justify-between items-center mt-2 gap-2">
        <NuxtLink
          class="inline-flex items-center gap-x-1 text-sm text-primary transition-colors duration-200 border-b-2 border-transparent hover:border-primary focus:outline-hidden font-medium"
          :to="
            props.email
              ? `/auth?step=${AllowedAuthStepsEnum.SIGN_IN}&payload=${getSafeBase64String(props.email)}`
              : '/auth'
          "
        >
          <ArrowLeft class="size-4" /> Назад
        </NuxtLink>
      </div>
    </div>
  </form>
</template>
