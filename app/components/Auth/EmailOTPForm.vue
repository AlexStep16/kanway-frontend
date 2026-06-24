<script setup lang="ts">
import { toast } from 'vue-sonner'
import OTPForm from '~/components/Auth/OTPForm.vue'
import { ResendStorageKeysEnum } from '~/enums/ResendStorageKeysEnum'

const props = defineProps<{
  email: string
}>()

const otpFormRef = ref<InstanceType<typeof OTPForm> | null>(null)
const isNavigating = ref(false)

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
  />
</template>
