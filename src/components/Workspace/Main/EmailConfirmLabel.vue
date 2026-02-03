<script setup lang="ts">
import { useSendVerificationEmail } from '@/composables/auth/mutations/useSendVerificationEmail'
import { TokenTypesEnum } from '@/enums/TokenTypesEnum'
import { IUser } from '@/interfaces/domain/IUser'
import { X, Mail } from 'lucide-vue-next'
import { onMounted, onUnmounted, ref } from 'vue'

defineProps<{
  user: IUser
  isConfirmShown: boolean
}>()

const { mutate: resend, isPending: isResending } = useSendVerificationEmail()

const timer = ref(0)
const timerId = ref<NodeJS.Timeout | null>(null)
const STORAGE_KEY = `resend_timer_${TokenTypesEnum.EMAIL_CONFIRMATION}`

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

async function handleResend() {
  if (timer.value > 0) return

  resend()

  localStorage.setItem(STORAGE_KEY, Date.now().toString())
  startTimer(60)
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
    class="flex gap-x-2 items-center bg-yellow-50 text-yellow-700 text-xs p-2 rounded-md mb-1 border border-yellow-400"
  >
    <Mail class="size-3.5 shrink-0" />
    <span class="grow-1">
      Ваш email ({{ user.email }}) не подтвержден. Проверьте почту или
      <button type="button" class="underline" @click="handleResend" v-if="timer === 0">
        {{ isResending ? 'Отправка...' : 'Отправить ещё раз' }}
      </button>
      <span v-else class="mt-1 text-xs text-gray-400">
        повторная отправка через {{ timer }} сек.
      </span>
    </span>

    <button
      class="ml-auto text-yellow-700 hover:opacity-90 transition-opacity duration-100"
      @click="$emit('close')"
      title="Закрыть"
    >
      <X class="size-4" />
    </button>
  </div>
</template>
