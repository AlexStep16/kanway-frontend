<script setup lang="ts">
import OTPForm from '~/components/Auth/OTPForm.vue'
import { ArrowLeft } from '@lucide/vue'
import { AllowedAuthStepsEnum } from '~/enums/AllowedAuthStepsEnum'
import { ResendStorageKeysEnum } from '~/enums/ResendStorageKeysEnum'
import { toast } from 'vue-sonner'

const props = defineProps<{
  email: string
  isEmailSending: boolean
}>()

const otpFormRef = ref<InstanceType<typeof OTPForm> | null>(null)
const isNavigating = ref(false)

const { mutate: verifyLoginOTP, isPending: isVerifyingLoginOTP } = useVerificationLoginOTP()
const { mutate: sendMagicLink, isPending: isSendingMagicLink } = useSendMagicLink()

function handleVerifyLoginOTP(code: string) {
  verifyLoginOTP(
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

function handleResendMagicLink() {
  sendMagicLink(props.email, {
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
    @verify="handleVerifyLoginOTP"
    @resend="handleResendMagicLink"
    :is-navigating="isNavigating"
    :is-verifying="isVerifyingLoginOTP"
    :is-resending="isSendingMagicLink || props.isEmailSending"
    :resend-storage-key="ResendStorageKeysEnum.LOGIN_VERIFICATION"
  >
    <template #footer>
      <div class="flex flex-wrap justify-start items-center gap-2 w-full">
        <button
          class="inline-flex items-center gap-x-1 text-sm text-primary transition-colors duration-200 border-b-2 border-transparent hover:border-primary focus:outline-hidden font-medium"
          @click="
            navigateTo({
              path: '/auth',
              query: {
                step: AllowedAuthStepsEnum.SIGN_IN,
                payload: getSafeBase64String(props.email),
              },
            })
          "
        >
          <ArrowLeft class="size-4" /> Назад
        </button>
      </div>
    </template>
  </OTPForm>
</template>
