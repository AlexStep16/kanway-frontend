<script setup lang="ts">
import RegisterButton from '@/components/Buttons/RegisterButton.vue'
import { useVerificationOTP } from '@/composables/auth/mutations/useVerificationOTP'
import { useUser } from '@/composables/auth/queries/useUser'
import { navigate } from 'vike/client/router'
import KanwayLogo from '@assets/kanway_logo.svg?component'
import { ref, reactive, computed, nextTick, onMounted, onUnmounted } from 'vue'
import { useSendVerificationEmail } from '@/composables/auth/mutations/useSendVerificationEmail'
import ExitButton from '@/components/Auth/ExitButton.vue'

const { mutate: verify, isPending: isVerifying } = useVerificationOTP()
const { mutate: resend, isPending: isResending } = useSendVerificationEmail()

const { data: user } = useUser()

const otp = reactive(['', '', '', '', '', ''])
const inputRefs = ref<HTMLInputElement[]>([])

const timer = ref(0)
const timerId = ref<NodeJS.Timeout | null>(null)
const STORAGE_KEY = `resend_timer_verification`

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
  timer.value = 0
  localStorage.removeItem(STORAGE_KEY)
}

const isComplete = computed(() => otp.every((digit) => digit !== ''))

// Обработка ввода цифры
const handleInput = (event: Event, index: number) => {
  const input = event.target as HTMLInputElement
  const value = input.value

  // Оставляем только последнюю введенную цифру (если ввели больше одной)
  if (value.length > 1) {
    otp[index] = value.slice(-1)
  }

  // Если введена цифра, прыгаем вперед
  if (value && index < 5) {
    nextTick(() => {
      inputRefs.value[index + 1]?.focus()
    })
  }

  // Если всё заполнено, можно вызывать проверку
  if (isComplete.value) {
    handleVerify()
  }
}

function handleResend() {
  if (timer.value > 0) return

  resend()

  localStorage.setItem(STORAGE_KEY, Date.now().toString())
  startTimer(60)
}

// Обработка удаления (Backspace)
const handleKeyDown = (event: KeyboardEvent, index: number) => {
  if (event.key === 'Backspace' && !otp[index] && index > 0) {
    // Если текущее поле пустое и нажат Backspace, прыгаем назад
    otp[index - 1] = ''
    inputRefs.value[index - 1]?.focus()
  }
}

// Обработка вставки (Paste)
const handlePaste = (event: ClipboardEvent) => {
  event.preventDefault()
  const pasteData = event.clipboardData?.getData('text').slice(0, 6).split('') || []

  pasteData.forEach((char, index) => {
    if (index < 6) {
      otp[index] = char
    }
  })

  // Ставим фокус на последнее заполненное поле или на кнопку
  const nextIndex = Math.min(pasteData.length, 5)
  inputRefs.value[nextIndex]?.focus()

  if (isComplete.value) {
    handleVerify()
  }
}

const handleVerify = () => {
  if (!isComplete.value) return

  const finalCode = otp.join('')

  verify(
    { code: finalCode },
    {
      onSuccess: () => {
        // Очистка OTP после успешной проверки
        for (let i = 0; i < 6; i++) {
          otp[i] = ''
        }

        navigate('/workspace')
      },
      onError: () => {
        for (let i = 0; i < 6; i++) {
          otp[i] = ''
        }
        inputRefs.value[0]?.focus()
      },
    },
  )
}

onMounted(() => {
  const savedTimestamp = localStorage.getItem(STORAGE_KEY)

  if (savedTimestamp) {
    const diff = Math.floor((Date.now() - parseInt(savedTimestamp)) / 1000)
    const remaining = 60 - diff
    if (remaining > 0) {
      startTimer(remaining)
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  }
})

onUnmounted(() => {
  if (timerId.value) clearInterval(timerId.value)
})
</script>

<template>
  <div
    class="size-full sm:w-100 sm:h-auto bg-white sm:border sm:border-gray-200 sm:rounded-xl shadow-2xs overflow-y-auto"
  >
    <div class="p-4 pt-7 sm:p-7">
      <div class="text-center flex justify-center flex-col items-center">
        <div class="relative flex justify-center items-center w-full">
          <a href="/">
            <KanwayLogo class="h-8 sm:h-10" />
          </a>

          <ExitButton class="absolute top-0 right-0" />
        </div>
        <h1 class="block mt-4 text-2xl font-bold text-gray-900">Проверьте почту</h1>
        <p class="mt-2 text-sm text-gray-500 leading-relaxed">
          Мы отправили 6-значный код на
          <span class="font-medium text-gray-900">{{ user?.email }}</span>
        </p>

        <!-- Поля ввода OTP -->
        <div class="mt-8 flex flex-col items-center gap-y-6 w-full">
          <div class="flex gap-x-2 sm:gap-x-3">
            <input
              v-for="(digit, index) in otp"
              :key="index"
              :id="'otp-' + index"
              v-model="otp[index]"
              type="text"
              maxlength="1"
              class="w-10 h-12 sm:w-12 sm:h-14 text-center text-xl font-bold text-gray-900 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all uppercase"
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

            <span v-else class="mt-1 text-sm text-gray-400">
              Повторная отправка через {{ timer }} сек.
            </span>
          </div>
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
