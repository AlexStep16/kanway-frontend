<script setup lang="ts">
import { ArrowLeft } from '@lucide/vue'
import { toast } from 'vue-sonner'
import OTPForm from '~/components/Auth/OTPForm.vue'
import { AllowedAuthStepsEnum } from '~/enums/AllowedAuthStepsEnum'
import { ResendStorageKeysEnum } from '~/enums/ResendStorageKeysEnum'

const props = defineProps<{
  email: string
  backStep: AllowedAuthStepsEnum
}>()

const otpFormRef = ref<InstanceType<typeof OTPForm> | null>(null)
const isNavigating = ref(false)

const { mutate: logout } = useLogout()
const { mutate: verifyEmail, isPending: isVerifying } = useVerificationEmailOTP()
const { mutate: resendEmail, isPending: isResending } = useSendVerificationEmail()

function handleVerifyEmailOTP(code: string) {
  verifyEmail(
    { code, email: props.email },
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
      onError() {
        otpFormRef.value?.clearOtp()
        otpFormRef.value?.inputRefs?.[0]?.focus()
      },
    },
  )
}

function handleBack() {
  logout(false, {
    onSuccess: async () => {
      navigateTo({
        path: '/auth',
        query: {
          step: props.backStep,
          payload: getSafeBase64String(props.email),
        },
      })
    },
  })
}

function handleResendEmail() {
  resendEmail(undefined, {
    onSuccess() {
      otpFormRef.value?.clearOtp()
    },
  })
}
</script>

<template>
  <OTPForm
    ref="otpFormRef"
    :target-email="props.email"
    @verify="handleVerifyEmailOTP"
    @resend="handleResendEmail"
    :is-navigating="isNavigating"
    :is-verifying="isVerifying"
    :is-resending="isResending"
    :resend-storage-key="ResendStorageKeysEnum.EMAIL_VERIFICATION"
  >
    <template #footer>
      <div class="flex flex-wrap justify-start items-center gap-2 w-full">
        <button
          class="inline-flex items-center gap-x-1 text-sm text-primary transition-colors duration-200 border-b-2 border-transparent hover:border-primary focus:outline-hidden font-medium"
          @click="handleBack"
        >
          <ArrowLeft class="size-4" /> Назад
        </button>
      </div>
    </template>
  </OTPForm>
</template>
