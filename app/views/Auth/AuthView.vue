<script setup lang="ts">
import KanwayLogo from '~/assets/kanway_logo.svg?skipsvgo'
import EmailOTPForm from '~/components/Auth/EmailOTPForm.vue'
import LoginOTPForm from '~/components/Auth/LoginOTPForm.vue'
import PasswordOTPForm from '~/components/Auth/PasswordOTPForm.vue'
import { AllowedAuthStepsEnum } from '@/enums/AllowedAuthStepsEnum'
import Auth from '~/components/Auth/Auth.vue'
import SignUpForm from '~/components/Auth/SignUpForm.vue'
import SignInForm from '~/components/Auth/SignInForm.vue'
import PasswordRecoveryForm from '~/components/Auth/PasswordRecoveryForm.vue'
import EmailLink from '~/components/Auth/EmailLink.vue'
import LoginLink from '~/components/Auth/LoginLink.vue'
import PasswordLink from '~/components/Auth/PasswordLink.vue'
import { ResendStorageKeysEnum } from '@/enums/ResendStorageKeysEnum'
import FinishSignUpForm from '~/components/Auth/FinishSignUpForm.vue'
import { SquarePen } from '@lucide/vue'

const route = useRoute()

const step: ComputedRef<AllowedAuthStepsEnum | undefined> = computed(
  () => route.query.step as AllowedAuthStepsEnum | undefined,
)
const payload: ComputedRef<string | undefined> = computed(
  () => route.query.payload as string | undefined,
)
const token: ComputedRef<string | undefined> = computed(
  () => route.query.token as string | undefined,
)

const email = computed(() => {
  if (!payload.value) return undefined

  try {
    return atob(payload.value)
  } catch {
    return undefined
  }
})

const { mutate: sendVerificationPasswordEmail, isPending: isSendingVerificationPasswordEmail } =
  useSendVerificationPasswordEmail()

const isAuthStep = computed(() => !step.value)
const isSignInStep = computed(() => step.value === AllowedAuthStepsEnum.SIGN_IN)
const isSignUpStep = computed(() => step.value === AllowedAuthStepsEnum.SIGN_UP)
const isVerifyEmailStep = computed(() => step.value === AllowedAuthStepsEnum.VERIFY_EMAIL)
const isVerifyLoginStep = computed(() => step.value === AllowedAuthStepsEnum.VERIFY_LOGIN)
const isVerifyPasswordStep = computed(() => step.value === AllowedAuthStepsEnum.VERIFY_PASSWORD)
const isPasswordResetCompleteStep = computed(
  () => step.value === AllowedAuthStepsEnum.PASSWORD_RESET_COMPLETE,
)
const isFinishSignUpStep = computed(() => step.value === AllowedAuthStepsEnum.FINISH_SIGN_UP)

function navigateToPasswordVerify() {
  if (!email.value) return

  navigateTo({
    path: '/auth',
    query: {
      step: AllowedAuthStepsEnum.VERIFY_PASSWORD,
      payload: getSafeBase64String(email.value.trim()),
    },
  })
}

function handleForgotPassword() {
  if (!email.value) return

  const remainingResend = getRemainingResend(ResendStorageKeysEnum.PASSWORD_VERIFICATION)

  if (remainingResend > 0) {
    navigateToPasswordVerify()
    return
  }

  sendVerificationPasswordEmail(email.value, {
    onSuccess() {
      navigateToPasswordVerify()
    },
  })
}

const isVerfiyStep = computed(
  () => isVerifyEmailStep.value || isVerifyLoginStep.value || isVerifyPasswordStep.value,
)

const pageTitle = computed(() => {
  if (isAuthStep.value) return 'Вход или регистрация'
  if (isSignInStep.value) return 'С возвращением'
  if (isSignUpStep.value) return 'Создание аккаунта'
  if (isVerifyEmailStep.value) return 'Подтверждение почты'
  if (isVerifyLoginStep.value) return 'Подтверждение входа'
  if (isVerifyPasswordStep.value) return 'Восстановление пароля'
  if (isPasswordResetCompleteStep.value) return 'Восстановление пароля'
  if (isFinishSignUpStep.value) return 'Завершение регистрации'

  return ''
})

useHead({
  title: computed(() => `Kanway | ${pageTitle.value}`),
})
</script>

<template>
  <TransitionGroup name="slide-left">
    <div
      class="size-full sm:w-100 h-auto bg-white border border-gray-200 rounded-xl shadow-2xs overflow-y-auto"
      v-if="!isVerfiyStep"
    >
      <div class="p-4 pt-7 sm:p-7">
        <div class="relative overflow-hidden text-center flex justify-center flex-col items-center">
          <NuxtLink to="/">
            <KanwayLogo class="h-8 sm:h-10" />
          </NuxtLink>

          <div
            class="overflow-hidden relative w-full min-h-8 flex justify-center items-center mt-4"
          >
            <Transition name="slide-up">
              <h2
                class="block sm:text-lg font-bold text-gray-800"
                v-if="isAuthStep"
                key="welcome"
              >
                Вход или регистрация
              </h2>
              <div
                v-else-if="isSignUpStep"
                key="create-account"
              >
                <h2 class="block sm:text-lg font-bold text-gray-800">Создание аккаунта</h2>
                <NuxtLink
                  :to="`/auth?payload=${getSafeBase64String(email)}`"
                  class="flex gap-1 justify-center items-center text-gray-700 hover:text-primary hover:underline"
                  v-if="email"
                >
                  <span class="font-medium text-sm">{{ email }}</span>
                  <SquarePen class="size-3.5" />
                </NuxtLink>
              </div>
              <div
                v-else-if="isSignInStep"
                key="welcome-back"
              >
                <h2 class="block sm:text-lg font-bold text-gray-800">С возвращением!</h2>
                <NuxtLink
                  :to="`/auth?payload=${getSafeBase64String(email)}`"
                  class="flex gap-1 justify-center items-center text-gray-700 hover:text-primary hover:underline"
                  v-if="email"
                >
                  <span class="font-medium text-sm">{{ email }}</span>
                  <SquarePen class="size-3.5" />
                </NuxtLink>
              </div>
              <div
                v-else-if="isPasswordResetCompleteStep"
                key="password-reset"
              >
                <h2 class="block sm:text-lg font-bold text-gray-800">Восстановление пароля</h2>
                <NuxtLink
                  :to="`/auth?payload=${getSafeBase64String(email)}`"
                  class="flex gap-1 justify-center items-center text-gray-700 hover:text-primary hover:underline"
                  v-if="email"
                >
                  <span class="font-medium text-sm">{{ email }}</span>
                  <SquarePen class="size-3.5" />
                </NuxtLink>
              </div>
              <div
                v-else-if="isFinishSignUpStep"
                key="finish-sign-up"
              >
                <h2 class="block sm:text-lg font-bold text-gray-800">Завершение регистрации</h2>
                <p class="text-muted-foreground text-sm mt-2">
                  Осталось указать почту, чтобы не потерять доступ к аккаунту
                </p>
              </div>
            </Transition>
          </div>
        </div>

        <div class="relative mt-4">
          <Auth
            :initial-email="email"
            v-if="isAuthStep"
          />
          <SignInForm
            :initial-email="email"
            v-else-if="isSignInStep"
            @forgot-password="handleForgotPassword"
          />
          <SignUpForm
            :initial-email="email"
            v-else-if="isSignUpStep"
          />
          <FinishSignUpForm v-else-if="isFinishSignUpStep" />
          <PasswordRecoveryForm
            :email="email"
            v-else-if="isPasswordResetCompleteStep"
          />

          <SocialButtons v-if="isAuthStep" />
        </div>
      </div>
    </div>

    <template v-if="isVerifyPasswordStep">
      <PasswordOTPForm
        :isEmailSending="isSendingVerificationPasswordEmail"
        :email="email"
        v-if="email && !token"
      />
      <PasswordLink
        :token="token"
        v-if="token"
      />
    </template>

    <template v-if="isVerifyEmailStep">
      <EmailOTPForm
        :email="email"
        v-if="email && !token"
      />
      <EmailLink
        :token="token"
        v-if="token"
      />
    </template>
    <template v-if="isVerifyLoginStep">
      <LoginOTPForm
        :isEmailSending="isSendingVerificationPasswordEmail"
        :email="email"
        v-if="email && !token"
      />
      <LoginLink
        :token="token"
        v-if="token"
      />
    </template>
  </TransitionGroup>
</template>
