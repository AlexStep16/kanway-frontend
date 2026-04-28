<script setup lang="ts">
import RegisterButton from '@/components/Buttons/RegisterButton.vue'
import { toTypedSchema } from '@vee-validate/zod'
import { onMounted, ref } from 'vue'
import { useForm } from 'vee-validate'
import { z } from 'zod'
import { toast } from 'vue-sonner'
import { useSendPasswordRecoveryEmail } from '@/composables/auth/mutations/useSendPasswordRecoveryEmail'
import EmailSent from '@/components/Auth/EmailSent.vue'
import { TokenTypesEnum } from '@/enums/TokenTypesEnum'
import KanwayLogo from '@assets/kanway_logo.svg?component'
import { HSStaticMethods } from 'preline'
import { Mail } from 'lucide-vue-next'
import BackgroundCircles from '@/components/BackgroundCircles.vue'

const { mutate: sendEmail, isPending: isSending } = useSendPasswordRecoveryEmail()

const schema = toTypedSchema(
  z.object({
    email: z.string().email('Неверный формат'),
  }),
)

const isEmailSent = ref(false)

const { errors, handleSubmit, submitCount, defineField } = useForm({
  validationSchema: schema,
  initialValues: {
    email: localStorage.getItem('saved_auth_email') || '',
  },
})

const [email, emailAttrs] = defineField('email')

const onSubmit = handleSubmit(
  () => {
    isEmailSent.value = true
  },
  (values) => {
    if (values.errors.email) toast.error(values.errors.email)
  },
)

function handleResend() {
  sendEmail({ email: email.value! })
}

onMounted(() => {
  HSStaticMethods.autoInit()
})
</script>

<template>
  <div class="w-full h-screen flex items-center justify-center">
    <BackgroundCircles />
    <div
      class="size-full sm:w-[400px] sm:h-auto bg-white sm:border sm:border-gray-200 sm:rounded-xl shadow-2xs overflow-y-auto"
    >
      <div class="p-4 pt-7 sm:p-7">
        <div class="text-center flex justify-center flex-col items-center">
          <a href="/" class="mb-4">
            <KanwayLogo class="h-8 sm:h-10" />
          </a>

          <template v-if="!isEmailSent">
            <h1 class="block text-2xl font-bold text-gray-800">Забыли пароль?</h1>

            <p class="mt-2 text-sm text-gray-600">
              Введите вашу почту и мы отправим вам ссылку для восстановления пароля.
            </p>
          </template>
          <template v-else>
            <EmailSent
              :type="TokenTypesEnum.RESET_PASSWORD"
              :isResending="isSending"
              @resend="handleResend"
            />
          </template>
        </div>

        <div class="mt-5" v-if="!isEmailSent">
          <!-- Form -->
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
                    class="py-2.5 pr-4 pl-10 block w-full border-muted hover:border-gray-200 hover:bg-white focus-within:bg-white bg-muted rounded-lg sm:text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
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
                  <li class="list-inside">{{ errors.email }}</li>
                </ul>
              </div>
              <!-- End Form Group -->

              <RegisterButton :isProcessing="isSending" text="Отправить ссылку" />

              <p class="text-sm text-gray-600">
                Вспомнили пароль?
                <a
                  class="text-blue-500 decoration-2 hover:underline focus:outline-hidden focus:underline font-medium"
                  href="/auth"
                >
                  Войти
                </a>
              </p>
            </div>
          </form>
          <!-- End Form -->
        </div>
      </div>
    </div>
  </div>
</template>
