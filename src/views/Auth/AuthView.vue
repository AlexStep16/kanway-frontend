<script setup lang="ts">
import { computed } from 'vue'
import KanwayLogo from '@assets/kanway_logo.svg?component'
import YandexAuth from '@/views/Auth/YandexAuth.vue'
import { useSendMagicLink } from '@/composables/auth/mutations/useSendMagicLink'
import Button from '@/components/ui/button/Button.vue'
import Spinner from '@/components/ui/spinner/Spinner.vue'
import { Link } from 'lucide-vue-next'
import VkAuth from './VkAuth.vue'
import BackgroundCircles from '@/components/BackgroundCircles.vue'
import { navigate } from 'vike/client/router'
import { useData } from 'vike-vue/useData'
import { getSafeBase64String } from '@/utils/getSafeBase64String'
import EmailOTPForm from '@/components/Auth/EmailOTPForm.vue'
import LoginOTPForm from '@/components/Auth/LoginOTPForm.vue'
import PasswordOTPForm from '@/components/Auth/PasswordOTPForm.vue'
import { AllowedAuthStepsEnum } from '@/enums/AllowedAuthStepsEnum'
import Auth from '@/components/Auth/Auth.vue'
import SignUpForm from '@/components/Auth/SignUpForm.vue'
import SignInForm from '@/components/Auth/SignInForm.vue'
import PasswordRecoveryForm from '@/components/Auth/PasswordRecoveryForm.vue'
import EmailLink from '@/components/Auth/EmailLink.vue'
import LoginLink from '@/components/Auth/LoginLink.vue'
import PasswordLink from '@/components/Auth/PasswordLink.vue'
import { useSendVerificationPasswordEmail } from '@/composables/auth/mutations/useSendVerificationPasswordEmail'
import ExitButton from '@/components/Auth/ExitButton.vue'
import { getRemainingResend } from '@/helpers/getRemainingResend'
import { ResendStorageKeysEnum } from '@/enums/ResendStorageKeysEnum'
import FinishSignUpForm from '@/components/Auth/FinishSignUpForm.vue'

const data = useData<{
  email?: string
  step?: AllowedAuthStepsEnum
  token?: string
}>()

const { mutate: sendMagicLink, isPending: isSendingMagicLink } = useSendMagicLink()
const { mutate: sendVerificationPasswordEmail, isPending: isSendingVerificationPasswordEmail } =
  useSendVerificationPasswordEmail()

const isAuthStep = computed(() => !data.step)
const isSignInStep = computed(() => data.step === AllowedAuthStepsEnum.SIGN_IN)
const isSignUpStep = computed(() => data.step === AllowedAuthStepsEnum.SIGN_UP)
const isVerifyEmailStep = computed(() => data.step === AllowedAuthStepsEnum.VERIFY_EMAIL)
const isVerifyLoginStep = computed(() => data.step === AllowedAuthStepsEnum.VERIFY_LOGIN)
const isVerifyPasswordStep = computed(() => data.step === AllowedAuthStepsEnum.VERIFY_PASSWORD)
const isPasswordResetCompleteStep = computed(
  () => data.step === AllowedAuthStepsEnum.PASSWORD_RESET_COMPLETE,
)
const isFinishSignUpStep = computed(() => data.step === AllowedAuthStepsEnum.FINISH_SIGN_UP)

function navigateToPasswordVerify() {
  if (!data.email) return

  navigate(
    `/auth?step=${AllowedAuthStepsEnum.VERIFY_PASSWORD}&payload=${getSafeBase64String(data.email)}`,
  )
}

function handleForgotPassword() {
  if (!data.email) return

  const remainingResend = getRemainingResend(ResendStorageKeysEnum.PASSWORD_VERIFICATION)

  if (remainingResend > 0) {
    navigateToPasswordVerify()
    return
  }

  sendVerificationPasswordEmail(data.email, {
    onSuccess() {
      navigateToPasswordVerify()
    },
  })
}

function navigateToLoginVerify() {
  if (!data.email) return

  navigate(
    `/auth?step=${AllowedAuthStepsEnum.VERIFY_LOGIN}&payload=${getSafeBase64String(data.email)}`,
  )
}

function handleSendMagicLink() {
  if (!data.email) return

  const remainingResend = getRemainingResend(ResendStorageKeysEnum.LOGIN_VERIFICATION)

  if (remainingResend > 0) {
    navigateToLoginVerify()
    return
  }

  sendMagicLink(data.email, {
    onSuccess() {
      navigateToLoginVerify()
    },
  })
}

const isVerfiyStep = computed(
  () => isVerifyEmailStep.value || isVerifyLoginStep.value || isVerifyPasswordStep.value,
)
</script>

<template>
  <div class="size-full bg-gray-100 overflow-hidden fixed inset-0 flex flex-col px-2">
    <BackgroundCircles />
    <header class="w-full py-5 px-4 sm:px-10 flex justify-end items-center">
      <ExitButton />
    </header>
    <main class="flex items-center justify-center grow">
      <TransitionGroup name="slide-left">
        <div
          class="size-full sm:w-100 h-auto bg-white border border-gray-200 rounded-xl shadow-2xs overflow-y-auto"
          v-if="!isVerfiyStep"
          key="auth-forms"
        >
          <div class="p-4 pt-7 sm:p-7">
            <div
              class="relative overflow-hidden text-center flex justify-center flex-col items-center"
            >
              <a href="/">
                <KanwayLogo class="h-8 sm:h-10" />
              </a>

              <div
                class="overflow-hidden relative w-full min-h-8 flex justify-center items-center mt-4"
              >
                <Transition name="slide-up">
                  <h1
                    class="block text-xl sm:text-2xl font-bold text-gray-800"
                    v-if="isAuthStep"
                    key="welcome"
                  >
                    Добро пожаловать!
                  </h1>
                  <div v-else-if="isSignUpStep" key="create-account">
                    <h1 class="block text-xl sm:text-2xl font-bold text-gray-800">
                      Создать аккаунт?
                    </h1>
                    <p class="text-muted-foreground text-sm mt-2">
                      Кажется такого аккаунта ещё нет
                    </p>
                    <span class="font-medium text-sm text-gray-700">{{ data.email }}</span>
                  </div>
                  <div v-else-if="isSignInStep" key="welcome-back">
                    <h1 class="block text-xl sm:text-2xl font-bold text-gray-800">
                      С возвращением!
                    </h1>
                    <span class="font-medium text-sm text-gray-700">{{ data.email }}</span>
                  </div>
                  <div v-else-if="isPasswordResetCompleteStep" key="password-reset">
                    <h1 class="block text-xl sm:text-2xl font-bold text-gray-800">
                      Восстановление пароля
                    </h1>
                    <span class="font-medium text-sm text-gray-700" v-if="data.email">{{
                      data.email
                    }}</span>
                  </div>
                  <div v-else-if="isFinishSignUpStep" key="finish-sign-up">
                    <h1 class="block text-xl sm:text-2xl font-bold text-gray-800">
                      Завершение регистрации
                    </h1>
                    <p class="text-muted-foreground text-sm mt-2">
                      Осталось указать почту, чтобы не потерять доступ к аккаунту
                    </p>
                  </div>
                </Transition>
              </div>
            </div>

            <div class="relative mt-4">
              <Auth :initial-email="data.email" v-if="isAuthStep" />
              <SignInForm
                :initial-email="data.email"
                v-else-if="isSignInStep"
                @forgot-password="handleForgotPassword"
              />
              <SignUpForm :initial-email="data.email" v-else-if="isSignUpStep" />
              <FinishSignUpForm v-else-if="isFinishSignUpStep" />
              <PasswordRecoveryForm :email="data.email" v-else-if="isPasswordResetCompleteStep" />
              <div v-if="isAuthStep || isSignInStep">
                <div
                  class="py-3 flex items-center text-xs text-gray-400 uppercase before:flex-1 before:border-t before:border-gray-200 before:me-6 after:flex-1 after:border-t after:border-gray-200 after:ms-6"
                >
                  Или
                </div>
                <div class="flex items-center justify-center gap-2" v-if="isAuthStep">
                  <YandexAuth />
                  <VkAuth />
                </div>

                <Button
                  variant="outlinePrimary"
                  size="lg"
                  class="w-full"
                  v-if="isSignInStep"
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

        <template v-if="isVerifyPasswordStep">
          <PasswordOTPForm
            :isEmailSending="isSendingVerificationPasswordEmail"
            :email="data.email"
            v-if="data.email && !data.token"
          />
          <PasswordLink :token="data.token" v-if="data.token" />
        </template>

        <template v-if="isVerifyEmailStep">
          <EmailOTPForm :email="data.email" v-if="data.email && !data.token" />
          <EmailLink :token="data.token" v-if="data.token" />
        </template>
        <template v-if="isVerifyLoginStep">
          <LoginOTPForm
            :isEmailSending="isSendingVerificationPasswordEmail"
            :email="data.email"
            v-if="data.email && !data.token"
          />
          <LoginLink :token="data.token" v-if="data.token" />
        </template>
      </TransitionGroup>
    </main>
  </div>
</template>
