<script setup lang="ts">
import OTPForm from '@/components/Auth/OTPForm.vue'
import { getSafeBase64String } from '@/utils/getSafeBase64String'
import { navigate } from 'vike/client/router'
import { ref } from 'vue'
import { ArrowLeft } from 'lucide-vue-next'
import { useVerificationPasswordOTP } from '@/composables/auth/mutations/useVerificationPasswordOTP'
import { useSendVerificationPasswordEmail } from '@/composables/auth/mutations/useSendVerificationPasswordEmail'
import { AllowedAuthStepsEnum } from '@/enums/AllowedAuthStepsEnum'
import { ResendStorageKeysEnum } from '@/enums/ResendStorageKeysEnum'

const otpFormRef = ref<InstanceType<typeof OTPForm> | null>(null)

const props = defineProps<{
  email: string
  isEmailSending: boolean
}>()

const { mutate: verifyPasswordOTP, isPending: isVerifyingPasswordOTP } =
  useVerificationPasswordOTP()
const { mutate: sendVerificationPasswordEmail, isPending: isSendingPasswordEmail } =
  useSendVerificationPasswordEmail()

function handleVerifyPasswordOTP(code: string) {
  verifyPasswordOTP(
    { code, email: props.email },
    {
      onError() {
        otpFormRef.value?.clearOtp()
        otpFormRef.value?.inputRefs?.[0]?.focus()
      },
    },
  )
}

function handleResendPasswordEmail() {
  sendVerificationPasswordEmail(props.email, {
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
    @verify="handleVerifyPasswordOTP"
    @resend="handleResendPasswordEmail"
    :is-verifying="isVerifyingPasswordOTP"
    :is-resending="isSendingPasswordEmail || props.isEmailSending"
    :resend-storage-key="ResendStorageKeysEnum.PASSWORD_VERIFICATION"
  >
    <template #footer>
      <div class="flex flex-wrap justify-start items-center gap-2 w-full">
        <button
          class="inline-flex items-center gap-x-1 text-sm text-primary transition-colors duration-200 border-b-2 border-transparent hover:border-primary focus:outline-hidden font-medium"
          @click="
            navigate(
              `/auth?step=${AllowedAuthStepsEnum.SIGN_IN}&payload=${getSafeBase64String(props.email)}`,
            )
          "
        >
          <ArrowLeft class="size-4" /> Назад
        </button>
      </div>
    </template>
  </OTPForm>
</template>
