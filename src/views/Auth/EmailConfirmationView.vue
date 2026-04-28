<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useData } from 'vike-vue/useData'
import { useVerificationEmail } from '@/composables/auth/mutations/useVerificationEmail'
import { BadgeCheck } from 'lucide-vue-next'
import Spinner from '@/components/Loader/Spinner.vue'
import { BackendError } from '@/utils/errors'
import ExpiredToken from '../../components/Auth/ExpiredToken.vue'
import InvalidToken from '../../components/Auth/InvalidToken.vue'
import { TokenTypesEnum } from '@/enums/TokenTypesEnum'
import { useSendVerificationEmailByToken } from '@/composables/auth/mutations/useSendVerificationEmailByToken'
import { navigate } from 'vike/client/router'
import RegisterButton from '@/components/Buttons/RegisterButton.vue'
import AlreadyVerified from '@/components/Auth/AlreadyVerified.vue'
import KanwayLogo from '@assets/kanway_logo.svg?component'
import EmailOTPView from './EmailOTPView.vue'
import { HSStaticMethods } from 'preline'
import BackgroundCircles from '@/components/BackgroundCircles.vue'

const { mutate: verifyToken, isPending: isVerifying, error } = useVerificationEmail()
const { mutate: resend, isPending: isResending } = useSendVerificationEmailByToken()

const { token } = useData<{ token: string }>()

const isSuccess = ref(false)
const redirectTimer = ref(3)

async function handleResend() {
  resend({ token })
}

watch(isSuccess, (newVal) => {
  if (newVal) {
    const intervalId = setInterval(() => {
      if (redirectTimer.value > 0) {
        redirectTimer.value -= 1
      } else {
        clearInterval(intervalId)
        navigate('/workspace')
      }
    }, 1000)
  }
})

onMounted(() => {
  HSStaticMethods.autoInit()

  if (token) {
    verifyToken(
      { token },
      {
        onSuccess: () => {
          isSuccess.value = true
        },
      },
    )
  }
})
</script>

<template>
  <div class="w-full h-screen flex items-center justify-center">
    <BackgroundCircles />
    <div
      class="size-full sm:w-100 h-auto bg-white border border-gray-200 rounded-xl shadow-2xs overflow-y-auto"
      v-if="token"
    >
      <div class="p-4 pt-7 sm:p-7" v-if="!isVerifying">
        <div class="text-center flex justify-center flex-col items-center">
          <a href="/" class="mb-4">
            <KanwayLogo class="h-8 sm:h-10" />
          </a>

          <div class="flex flex-col items-center justify-center gap-y-2" v-if="isSuccess">
            <BadgeCheck class="size-10 text-green-500" />
            <h1 class="block text-2xl font-bold text-gray-800">Email успешно подтвержден.</h1>

            <p class="text-sm text-gray-600">Вам доступны все функции сервиса!</p>

            <RegisterButton :text="`На главную (${redirectTimer})`" />
          </div>

          <template v-else-if="error">
            <ExpiredToken
              :type="TokenTypesEnum.EMAIL_CONFIRMATION"
              :isResending="isResending"
              @resend="handleResend"
              v-if="(error as BackendError).code === 410"
            />
            <InvalidToken v-else-if="(error as BackendError).code === 404" />
            <AlreadyVerified v-else-if="(error as BackendError).code === 409" />
          </template>
        </div>
      </div>

      <div
        class="size-full sm:h-[400px] flex flex-col gap-y-2 items-center justify-center text-gray-500"
        v-else
      >
        <Spinner class="size-7" />

        <p class="text-sm">Подтверждаем почту</p>
      </div>
    </div>

    <EmailOTPView v-else />
  </div>
</template>
