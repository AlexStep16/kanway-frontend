<script setup lang="ts">
import OTPForm from '@/components/Auth/OTPForm.vue'
import { useSendVerificationEmail } from '@/composables/auth/mutations/useSendVerificationEmail'
import { useVerificationEmailOTP } from '@/composables/auth/mutations/useVerificationEmailOTP'
import { useUser } from '@/composables/auth/queries/useUser'
import { ref } from 'vue'

const otpFormRef = ref<InstanceType<typeof OTPForm> | null>(null)

const { data: user } = useUser()
const { mutate: verifyEmail, isPending: isVerifying } = useVerificationEmailOTP()
const { mutate: resendEmail, isPending: isResending } = useSendVerificationEmail()

function handleVerifyEmailOTP(code: string) {
  verifyEmail(
    { code },
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
    :target-email="user?.email || ''"
    @verify="handleVerifyEmailOTP"
    @resend="handleResendEmail"
    :is-verifying="isVerifying"
    :is-resending="isResending"
    resend-storage-key="resend_timer_verification_email"
  />
</template>
