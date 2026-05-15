<script setup lang="ts">
import OTPForm from '~/components/Auth/OTPForm.vue'
import { ResendStorageKeysEnum } from '~/enums/ResendStorageKeysEnum'

const otpFormRef = ref<InstanceType<typeof OTPForm> | null>(null)

const props = defineProps<{
  email: string
}>()

const { mutate: verifyEmail, isPending: isVerifying } = useVerificationEmailOTP()
const { mutate: resendEmail, isPending: isResending } = useSendVerificationEmail()

function handleVerifyEmailOTP(code: string) {
  verifyEmail(
    { code, email: props.email },
    {
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
    :is-verifying="isVerifying"
    :is-resending="isResending"
    :resend-storage-key="ResendStorageKeysEnum.EMAIL_VERIFICATION"
  />
</template>
