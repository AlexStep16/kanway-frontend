<script setup lang="ts">
import RegisterButton from '~/components/Buttons/RegisterButton.vue'
import KanwayLogo from '~/assets/kanway_logo.svg?skipsvgo'

const OTP_LENGTH = 6

interface OTPFormProps {
  targetEmail?: string
  title?: string
  descriptionPrefix?: string
  isVerifying: boolean
  isResending?: boolean
  resendStorageKey?: string
  resendCooldownSeconds?: number
}

const emit = defineEmits<{
  (e: 'resend'): void
  (e: 'verify', code: string): void
}>()

const props = withDefaults(defineProps<OTPFormProps>(), {
  targetEmail: '',
  title: 'Проверьте почту',
  descriptionPrefix: 'Мы отправили 6-значный код на',
  isResending: false,
  resendStorageKey: '',
  resendCooldownSeconds: 60,
})

const otp = reactive(Array.from({ length: OTP_LENGTH }, () => ''))
const inputRefs = ref<HTMLInputElement[]>([])

const timer = ref(0)
const timerId = ref<NodeJS.Timeout | null>(null)

const isComplete = computed(() => otp.every((digit) => digit !== ''))

const startTimer = (seconds: number) => {
  if (timerId.value) clearInterval(timerId.value)
  timer.value = seconds

  timerId.value = setInterval(() => {
    if (timer.value > 0) {
      timer.value -= 1
    } else {
      stopTimer()
    }
  }, 1000)
}

const stopTimer = () => {
  if (timerId.value) clearInterval(timerId.value)
  timerId.value = null
  timer.value = 0

  if (props.resendStorageKey) {
    localStorage.removeItem(props.resendStorageKey)
  }
}

const clearOtp = () => {
  for (let i = 0; i < OTP_LENGTH; i++) {
    otp[i] = ''
  }
}

const handleInput = (event: Event, index: number) => {
  const input = event.target as HTMLInputElement
  const value = input.value.replace(/\D/g, '')

  if (!value) {
    otp[index] = ''
    return
  }

  if (value.length > 1) {
    const chars = value.split('')
    chars.forEach((char, i) => {
      const targetIndex = index + i
      if (targetIndex < OTP_LENGTH) {
        otp[targetIndex] = char
      }
    })

    const lastIndex = Math.min(index + value.length, OTP_LENGTH - 1)
    nextTick(() => {
      inputRefs.value[lastIndex]?.focus()
    })
  } else {
    otp[index] = value
    if (index < OTP_LENGTH - 1) {
      nextTick(() => {
        inputRefs.value[index + 1]?.focus()
      })
    }
  }

  if (isComplete.value) {
    handleVerify()
  }
}

function handleResend() {
  emit('resend')
  startTimer(props.resendCooldownSeconds)
}

const handleKeyDown = (event: KeyboardEvent, index: number) => {
  if (event.key === 'Backspace' && !otp[index] && index > 0) {
    otp[index - 1] = ''
    inputRefs.value[index - 1]?.focus()
  }
}

const handlePaste = (event: ClipboardEvent) => {
  event.preventDefault()
  const text = event.clipboardData?.getData('text') || ''
  const pasteData = text.replace(/\D/g, '').slice(0, OTP_LENGTH).split('')

  pasteData.forEach((char, index) => {
    if (index < OTP_LENGTH) {
      otp[index] = char
    }
  })

  const nextIndex = Math.min(pasteData.length, OTP_LENGTH - 1)
  inputRefs.value[nextIndex]?.focus()

  if (isComplete.value) {
    handleVerify()
  }
}

const handleVerify = () => {
  if (!isComplete.value) return

  const finalCode = otp.join('')

  emit('verify', finalCode)
}

onMounted(() => {
  if (!props.resendStorageKey) return

  const remaining = getRemainingResend(props.resendStorageKey, props.resendCooldownSeconds)

  if (remaining > 0) {
    startTimer(remaining)
  } else {
    localStorage.removeItem(props.resendStorageKey)
  }
})

onUnmounted(() => {
  if (timerId.value) {
    clearInterval(timerId.value)
    timerId.value = null
  }
})

defineExpose({
  clearOtp,
  inputRefs,
})
</script>

<template>
  <div
    class="size-full sm:w-100 h-auto bg-white border border-gray-200 rounded-xl shadow-2xs overflow-y-auto"
  >
    <div class="p-4 pt-7 sm:p-7">
      <div class="text-center flex justify-center flex-col items-center">
        <div class="relative flex justify-center items-center w-full">
          <a href="/">
            <KanwayLogo class="h-8 sm:h-10" />
          </a>
        </div>
        <h1 class="block mt-4 text-2xl font-bold text-gray-900">{{ title }}</h1>
        <p class="mt-2 text-sm text-gray-500 leading-relaxed">
          {{ descriptionPrefix }}
          <span class="font-medium text-gray-900">{{ targetEmail }}</span>
        </p>

        <div class="mt-8 flex flex-col items-center gap-y-6 w-full">
          <div class="flex gap-x-2 sm:gap-x-3">
            <input
              v-for="(digit, index) in otp"
              :key="index"
              :id="'otp-' + index"
              v-model="otp[index]"
              type="text"
              inputmode="numeric"
              autocomplete="one-time-code"
              pattern="\d*"
              maxlength="6"
              :disabled="isVerifying"
              class="w-10 h-12 sm:w-12 sm:h-14 text-center text-xl font-bold text-gray-900 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all uppercase disabled:opacity-50 disabled:pointer-events-none"
              @input="handleInput($event, index)"
              @keydown="handleKeyDown($event, index)"
              @paste="handlePaste"
              ref="inputRefs"
            />
          </div>

          <RegisterButton :isProcessing="isVerifying" text="Подтвердить" @click="handleVerify" />

          <div class="flex flex-col items-center">
            <span class="text-sm text-gray-500">Не получили письмо?</span>

            <button
              v-if="timer === 0"
              class="mt-1 text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline disabled:opacity-50"
              :disabled="isVerifying"
              @click="handleResend"
            >
              {{ isResending ? 'Отправляем...' : 'Отправить ещё раз' }}
            </button>

            <span v-else class="mt-1 text-sm text-gray-400"
              >Повторная отправка через {{ timer }} сек.</span
            >
          </div>

          <slot name="footer" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
