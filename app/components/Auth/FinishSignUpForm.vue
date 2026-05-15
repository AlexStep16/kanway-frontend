<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'

import RegisterButton from '~/components/Buttons/RegisterButton.vue'
import z from 'zod'
import { Mail } from 'lucide-vue-next'
import { AllowedAuthStepsEnum } from '~/enums/AllowedAuthStepsEnum'

const { mutate: finishSignup, isPending: isRegistering, error: registerError } = useFinishSignup()

const isPasswordDirty = ref(false)

const schema = toTypedSchema(
  z.object({
    email: z.email('Неверный формат почты'),
  }),
)

const { errors, handleSubmit, defineField, submitCount } = useForm({
  validationSchema: schema,
  initialValues: {
    email: '',
  },
})

const [email, emailAttrs] = defineField('email')

const onSubmit = handleSubmit((values) => {
  isPasswordDirty.value = false
  finishSignup(
    { email: values.email.trim() },
    {
      onSuccess: () => {
        navigateTo(
          `/auth?step=${AllowedAuthStepsEnum.VERIFY_EMAIL}&payload=${getSafeBase64String(values.email.trim())}`,
        )
      },
    },
  )
})
</script>

<template>
  <form @submit.prevent="onSubmit" novalidate>
    <div class="grid gap-y-2">
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
        <ul class="text-xs text-red-600" id="email-error" v-if="errors.email && submitCount > 0">
          <li class="list-inside">{{ errors.email }}</li>
        </ul>
        <ul class="text-xs text-red-600" v-if="registerError && !isPasswordDirty">
          <li class="list-inside">{{ registerError.message }}</li>
        </ul>
      </div>

      <RegisterButton :isProcessing="isRegistering" text="Завершить регистрацию" />
    </div>
  </form>
</template>
