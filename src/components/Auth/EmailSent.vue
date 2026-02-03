<script setup lang="ts">
import { TokenTypesEnum } from '@/enums/TokenTypesEnum'
import { BadgeCheck } from 'lucide-vue-next'
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps<{
  type: TokenTypesEnum
  isResending: boolean
}>()

const emits = defineEmits<{
  (e: 'resend'): void
}>()

const timer = ref(0)
const timerId = ref<NodeJS.Timeout | null>(null)
const STORAGE_KEY = `resend_timer_${props.type}`

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

onMounted(() => {
  const savedTimestamp = localStorage.getItem(STORAGE_KEY)

  if (savedTimestamp) {
    const diff = Math.floor((Date.now() - parseInt(savedTimestamp)) / 1000)
    const remaining = 60 - diff
    if (remaining > 0) {
      startTimer(remaining)
    } else {
      localStorage.removeItem(STORAGE_KEY)

      handleResend()
    }
  } else {
    handleResend()
  }
})

onUnmounted(() => {
  if (timerId.value) clearInterval(timerId.value)
})

async function handleResend() {
  if (timer.value > 0 || props.isResending) return

  emits('resend')

  localStorage.setItem(STORAGE_KEY, Date.now().toString())
  startTimer(60)
}
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-y-3">
    <BadgeCheck class="size-10 text-green-500" />
    <h1 class="block text-xl font-bold text-gray-800">Письмо отправлено.</h1>

    <p class="text-sm text-gray-600">
      Проверьте вашу почту и перейдите по ссылке для
      {{ type === TokenTypesEnum.EMAIL_CONFIRMATION ? 'подтверждения' : 'восстановления доступа' }}.
    </p>

    <div class="mt-4 flex flex-col items-center">
      <span class="text-sm text-gray-500">Не получили письмо?</span>

      <button
        v-if="timer === 0"
        class="mt-1 text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline disabled:opacity-50"
        :disabled="isResending"
        @click="handleResend"
      >
        {{ isResending ? 'Отправка...' : 'Отправить ещё раз' }}
      </button>

      <span v-else class="mt-1 text-xs text-gray-400">
        Повторная отправка через {{ timer }} сек.
      </span>
    </div>
  </div>
</template>
