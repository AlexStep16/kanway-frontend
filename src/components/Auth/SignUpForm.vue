<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'

import { navigate } from 'vike/client/router'
import RegisterButton from '@/components/Buttons/RegisterButton.vue'
import z from 'zod'
import { ArrowLeft, KeyRound } from 'lucide-vue-next'
import { useRegister } from '@/composables/auth/mutations/useRegister'
import { computed, onMounted, ref, watch } from 'vue'
import { HSStaticMethods } from 'preline'
import { AllowedAuthStepsEnum } from '@/enums/AllowedAuthStepsEnum'
import { getSafeBase64String } from '@/utils/getSafeBase64String'

const props = withDefaults(
  defineProps<{
    initialEmail?: string
  }>(),
  {
    initialEmail: '',
  },
)

const { mutate: register, isPending: isRegistering, error: registerError } = useRegister()

const isPasswordDirty = ref(false)

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
      onSuccess: () => {
        navigate(
          '/' + AllowedAuthStepsEnum.VERIFY_EMAIL + '/' + getSafeBase64String(values.email.trim()),
        )
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

onMounted(() => {
  HSStaticMethods.autoInit()
})
</script>

<template>
  <form @submit.prevent="onSubmit" novalidate>
    <div class="grid gap-y-2">
      <div class="flex flex-col gap-y-2">
        <div class="flex items-center relative">
          <KeyRound class="size-4 absolute left-4 text-gray-400" />
          <input
            type="password"
            id="password"
            name="password"
            @input="isPasswordDirty = true"
            class="py-2.5 pr-4 pl-10 text-sm block w-full border-muted hover:border-gray-200 hover:bg-white focus-within:bg-white bg-muted rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
            v-model="password"
            v-bind="passwordAttrs"
            placeholder="Пароль"
          />
          <button
            type="button"
            data-hs-toggle-password='{
              "target": "#password"
            }'
            class="absolute inset-y-0 end-0 flex items-center z-20 px-3 cursor-pointer text-gray-400 rounded-e-md focus:outline-hidden"
          >
            <svg
              class="shrink-0 size-4"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path class="hs-password-active:hidden" d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path>
              <path
                class="hs-password-active:hidden"
                d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"
              ></path>
              <path
                class="hs-password-active:hidden"
                d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"
              ></path>
              <line class="hs-password-active:hidden" x1="2" x2="22" y1="2" y2="22"></line>
              <path
                class="hidden hs-password-active:block"
                d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"
              ></path>
              <circle class="hidden hs-password-active:block" cx="12" cy="12" r="3"></circle>
            </svg>
          </button>
        </div>
        <ul class="text-xs my-2" v-if="password && password.length > 0">
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
        <ul class="text-xs text-red-600" v-if="registerError && !isPasswordDirty">
          <li class="list-inside">{{ registerError.message }}</li>
        </ul>
      </div>

      <RegisterButton :isProcessing="isRegistering" text="Создать аккаунт" />

      <div class="flex flex-wrap justify-start items-center mt-2 gap-2">
        <a
          class="inline-flex items-center gap-x-1 text-sm text-primary transition-colors duration-200 border-b-2 border-transparent hover:border-primary focus:outline-hidden font-medium"
          href="/auth"
        >
          <ArrowLeft class="size-4" /> Назад
        </a>
      </div>
    </div>
  </form>
</template>
