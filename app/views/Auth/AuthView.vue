<script setup lang="ts">
import KanwayLogo from '~/assets/kanway_logo.svg?skipsvgo'
import YandexAuth from '~/views/Auth/YandexAuth.vue'
import { Link } from 'lucide-vue-next'
import VkAuth from './VkAuth.vue'
import BackgroundCircles from '~/components/BackgroundCircles.vue'
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

const { mutate: sendMagicLink, isPending: isSendingMagicLink } = useSendMagicLink()
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

  navigateTo(
    `/auth?step=${AllowedAuthStepsEnum.VERIFY_PASSWORD}&payload=${getSafeBase64String(email.value)}`,
  )
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

function navigateToLoginVerify() {
  if (!email.value) return

  navigateTo(
    `/auth?step=${AllowedAuthStepsEnum.VERIFY_LOGIN}&payload=${getSafeBase64String(email.value)}`,
  )
}

function handleSendMagicLink() {
  if (!email.value) return

  const remainingResend = getRemainingResend(ResendStorageKeysEnum.LOGIN_VERIFICATION)

  if (remainingResend > 0) {
    navigateToLoginVerify()
    return
  }

  sendMagicLink(email.value, {
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
  <div
    class="relative size-full isolate bg-gray-100 overflow-hidden min-h-screen flex flex-col px-2"
  >
    <BackgroundCircles />
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
                  <div
                    v-else-if="isSignUpStep"
                    key="create-account"
                  >
                    <h1 class="block text-xl sm:text-2xl font-bold text-gray-800">
                      Создать аккаунт?
                    </h1>
                    <p class="text-muted-foreground text-sm mt-2">
                      Кажется такого аккаунта ещё нет
                    </p>
                    <span class="font-medium text-sm text-gray-700">{{ email }}</span>
                  </div>
                  <div
                    v-else-if="isSignInStep"
                    key="welcome-back"
                  >
                    <h1 class="block text-xl sm:text-2xl font-bold text-gray-800">
                      С возвращением!
                    </h1>
                    <span class="font-medium text-sm text-gray-700">{{ email }}</span>
                  </div>
                  <div
                    v-else-if="isPasswordResetCompleteStep"
                    key="password-reset"
                  >
                    <h1 class="block text-xl sm:text-2xl font-bold text-gray-800">
                      Восстановление пароля
                    </h1>
                    <span
                      class="font-medium text-sm text-gray-700"
                      v-if="email"
                      >{{ email }}</span
                    >
                  </div>
                  <div
                    v-else-if="isFinishSignUpStep"
                    key="finish-sign-up"
                  >
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
              <div v-if="isAuthStep || isSignInStep">
                <div
                  class="py-3 flex items-center text-xs text-gray-400 uppercase before:flex-1 before:border-t before:border-gray-200 before:me-6 after:flex-1 after:border-t after:border-gray-200 after:ms-6"
                >
                  Или
                </div>
                <div
                  class="flex items-center justify-center gap-2"
                  v-if="isAuthStep"
                >
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
                  <div
                    class="flex items-center gap-x-2"
                    v-if="!isSendingMagicLink"
                  >
                    <Link
                      class="size-3.5"
                      stroke-width="2.5"
                    />
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
    </main>
  </div>
</template>
