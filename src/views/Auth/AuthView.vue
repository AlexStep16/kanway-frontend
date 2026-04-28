<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { HSStaticMethods } from 'preline'
import KanwayLogo from '@assets/kanway_logo.svg?component'
import YandexAuth from '@/views/Auth/YandexAuth.vue'
import AuthForm from '@/components/Auth/AuthForm.vue'
import LoginForm from '@/components/Auth/LoginForm.vue'
import { usePageContext } from 'vike-vue/usePageContext'
import AskCreateForm from '@/components/Auth/AskCreateForm.vue'
import OTPForm from '@/components/Auth/OTPForm.vue'
import { useVerificationLoginOTP } from '@/composables/auth/mutations/useVerificationLoginOTP'
import { useSendMagicLink } from '@/composables/auth/mutations/useSendMagicLink'
import Button from '@/components/ui/button/Button.vue'
import Spinner from '@/components/ui/spinner/Spinner.vue'
import { ArrowLeft, Link } from 'lucide-vue-next'
import { useStorage } from '@vueuse/core'
import { navigate } from 'vike/client/router'
import VkAuth from './VkAuth.vue'
import BackgroundCircles from '@/components/BackgroundCircles.vue'

const savedEmail = useStorage('saved_auth_email', '')
const pageContext = usePageContext()
const otpFormRef = ref<InstanceType<typeof OTPForm> | null>(null)
const showOTP = ref(false)
const allowedSteps = ['email', 'password', 'create'] as const

const { mutate: verifyLoginOTP, isPending: isVerifyingLoginOTP } = useVerificationLoginOTP()
const { mutate: sendMagicLink, isPending: isSendingMagicLink } = useSendMagicLink()

const currentStep = computed<(typeof allowedSteps)[number]>(() => {
  const step = pageContext.urlParsed.searchAll?.step?.[0]
  const isAllowedStep = allowedSteps.includes(step as (typeof allowedSteps)[number])
  const normalizedStep = isAllowedStep ? (step as (typeof allowedSteps)[number]) : 'email'

  if (!savedEmail.value && normalizedStep !== 'email') {
    return 'email'
  }

  return normalizedStep
})

function handleVerifyLoginOTP(code: string) {
  verifyLoginOTP(
    { code, email: savedEmail.value },
    {
      onSettled() {
        otpFormRef.value?.clearOtp()
        otpFormRef.value?.inputRefs?.[0]?.focus()
      },
      onSuccess() {
        navigate('/workspace')
      },
    },
  )
}

function handleResendMagicLink() {
  sendMagicLink(savedEmail.value, {
    onSuccess() {
      otpFormRef.value?.clearOtp()
    },
  })
}

function handleSendMagicLink() {
  sendMagicLink(savedEmail.value, {
    onSuccess() {
      showOTP.value = true
    },
  })
}

function handleSetEmail(newEmail: string) {
  savedEmail.value = newEmail.trim()
}

onMounted(() => {
  HSStaticMethods.autoInit()
})

watch(currentStep, (step) => {
  if (step !== 'password') {
    showOTP.value = false
  }
})
</script>

<template>
  <div class="w-full h-screen flex overflow-hidden items-center justify-center p-2">
    <BackgroundCircles />
    <TransitionGroup name="slide-left">
      <div
        class="size-full sm:w-100 h-auto bg-white border border-gray-200 rounded-xl shadow-2xs overflow-y-auto"
        v-if="!showOTP"
        key="main-forms"
      >
        <div class="p-4 pt-7 sm:p-7">
          <div
            class="relative overflow-hidden text-center flex justify-center flex-col items-center"
          >
            <a href="/">
              <KanwayLogo class="h-8 sm:h-10" />
            </a>

            <div
              class="overflow-hidden relative w-full min-h-8 flex justify-center items-center text-nowrap mt-4"
            >
              <Transition name="slide-up">
                <h1
                  class="block text-xl sm:text-2xl font-bold text-gray-800"
                  v-if="currentStep === 'email'"
                  key="welcome"
                >
                  Добро пожаловать!
                </h1>
                <div v-else-if="currentStep === 'create'" key="create-account">
                  <h1 class="block text-xl sm:text-2xl font-bold text-gray-800">
                    Создать аккаунт?
                  </h1>
                  <p class="text-muted-foreground text-sm mt-2">Кажется такого аккаунта ещё нет</p>
                  <span class="font-medium text-sm text-gray-700">{{ savedEmail }}</span>
                </div>
                <div v-else key="welcome-back">
                  <h1 class="block text-xl sm:text-2xl font-bold text-gray-800">С возвращением!</h1>
                  <span class="font-medium text-sm text-gray-700">{{ savedEmail }}</span>
                </div>
              </Transition>
            </div>
          </div>

          <div class="relative mt-4">
            <AuthForm
              :initial-email="savedEmail"
              v-if="currentStep === 'email'"
              @setEmail="handleSetEmail"
            />
            <AskCreateForm :initial-email="savedEmail" v-else-if="currentStep === 'create'" />
            <LoginForm :initial-email="savedEmail" v-else-if="currentStep === 'password'" />
            <div v-if="['email', 'password'].includes(currentStep)">
              <div
                class="py-3 flex items-center text-xs text-gray-400 uppercase before:flex-1 before:border-t before:border-gray-200 before:me-6 after:flex-1 after:border-t after:border-gray-200 after:ms-6"
              >
                Или
              </div>
              <div class="flex items-center justify-center gap-2" v-if="currentStep === 'email'">
                <YandexAuth />
                <VkAuth />
              </div>

              <Button
                variant="outlinePrimary"
                size="lg"
                class="w-full"
                v-show="currentStep === 'password'"
                @click="handleSendMagicLink"
              >
                <div class="flex items-center gap-x-2" v-if="!isSendingMagicLink">
                  <Link class="size-3.5" stroke-width="2.5" />
                  <span>Отправить ссылку для входа</span>
                </div>
                <Spinner v-else />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <OTPForm
        v-if="showOTP"
        key="otp-login"
        ref="otpFormRef"
        :target-email="savedEmail"
        @verify="handleVerifyLoginOTP"
        @resend="handleResendMagicLink"
        :is-verifying="isVerifyingLoginOTP"
        :is-resending="isSendingMagicLink"
        resend-storage-key="resend_timer_login_email"
      >
        <template #footer>
          <div class="flex flex-wrap justify-start items-center gap-2 w-full">
            <button
              class="inline-flex items-center gap-x-1 text-sm text-primary transition-colors duration-200 border-b-2 border-transparent hover:border-primary focus:outline-hidden font-medium"
              @click="showOTP = false"
            >
              <ArrowLeft class="size-4" /> Назад
            </button>
          </div>
        </template>
      </OTPForm>
    </TransitionGroup>
  </div>
</template>
