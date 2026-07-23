<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'

import RegisterButton from '~/components/Buttons/RegisterButton.vue'
import { Mail } from '@lucide/vue'
import z from 'zod'
import { checkEmailExists } from '@/services/auth'
import { getSafeBase64String } from '~/utils/getSafeBase64String'
import { AllowedAuthStepsEnum } from '~/enums/AllowedAuthStepsEnum'

const props = withDefaults(
  defineProps<{
    initialEmail?: string
  }>(),
  {
    initialEmail: '',
  },
)

const schema = toTypedSchema(
  z.object({
    email: z.email('Неверный формат почты'),
  }),
)

const { errors, handleSubmit, submitCount, defineField } = useForm({
  validationSchema: schema,
  initialValues: {
    email: props.initialEmail,
  },
})

const [email, emailAttrs] = defineField('email')
const isCheckingEmail = ref(false)

watch(
  () => props.initialEmail,
  (newEmail) => {
    email.value = newEmail
  },
)

const onSubmit = handleSubmit(async (values) => {
  isCheckingEmail.value = true
  const normalizedEmail = values.email.trim()

  try {
    const isEmailExists = await checkEmailExists(normalizedEmail)

    if (isEmailExists)
      return navigateTo({
        path: '/auth',
        query: {
          step: AllowedAuthStepsEnum.SIGN_IN,
          payload: getSafeBase64String(normalizedEmail),
        },
      })
    else
      return navigateTo({
        path: '/auth',
        query: {
          step: AllowedAuthStepsEnum.SIGN_UP,
          payload: getSafeBase64String(normalizedEmail),
        },
      })
  } finally {
    isCheckingEmail.value = false
  }
})
</script>

<template>
  <form
    @submit.prevent="onSubmit"
    novalidate
  >
    <div class="grid gap-y-2">
      <!-- Form Group -->
      <div class="flex flex-col gap-y-2">
        <div class="flex items-center relative">
          <Mail class="size-4 absolute left-4 text-gray-400" />
          <input
            type="email"
            id="email"
            name="email"
            class="py-2.5 pr-4 pl-10 text-sm block w-full border-muted hover:border-gray-200 hover:bg-white focus-within:bg-white bg-muted rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
            v-model="email"
            v-bind="emailAttrs"
            placeholder="Введите почту"
          />
        </div>
        <ul
          class="text-xs text-red-600"
          id="email-error"
          v-if="errors.email && submitCount > 0"
        >
          <li class="list-inside">{{ errors.email }}</li>
        </ul>
      </div>
      <!-- End Form Group -->

      <RegisterButton
        :isProcessing="isCheckingEmail"
        text="Продолжить"
      />
    </div>
  </form>
</template>
