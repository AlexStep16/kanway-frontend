<script setup lang="ts">
import BackgroundCircles from '@/components/BackgroundCircles.vue'
import dayjs from 'dayjs'

async function handleCallback() {
  const urlParams = new URLSearchParams(window.location.search)
  const code = urlParams.get('code')
  const state = urlParams.get('state')

  // Проверка state для защиты от CSRF
  const savedState = localStorage.getItem('yandex_auth_state')
  if (state !== savedState) {
    console.error('Invalid state')
    return
  }

  const codeVerifier = localStorage.getItem('yandex_code_verifier')

  if (!code || !state || !codeVerifier) {
    console.error('Missing required parameters')
    return
  }

  try {
    await yandexAuthApi({ code, state, codeVerifier, timezone: dayjs.tz.guess() })
    navigateTo('/workspace')
  } catch (error) {
    console.error('Authentication failed', error)
  } finally {
    // Чистим данные из localStorage
    localStorage.removeItem('yandex_auth_state')
    localStorage.removeItem('yandex_code_verifier')
  }
}

handleCallback()

useHead({
  title: 'Kanway | Выполняется вход...',
})
</script>

<template>
  <BackgroundCircles />
  <div class="w-full h-screen flex overflow-hidden items-center justify-center p-2">
    <div
      class="flex flex-col gap-2 items-center justify-center size-100 bg-white text-gray-400 border border-gray-200 rounded-xl shadow-2xs"
    >
      <Spinner class="size-7" />
      <span class="text-sm">Выполняется вход...</span>
    </div>
  </div>
</template>
