<script setup lang="ts">
import { yandexAuthApi } from '@/api/auth'
import dayjs from 'dayjs'
import { navigate } from 'vike/client/router'

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
    navigate('/workspace')
  } catch (error) {
    console.error('Authentication failed', error)
  } finally {
    // Чистим данные из localStorage
    localStorage.removeItem('yandex_auth_state')
    localStorage.removeItem('yandex_code_verifier')
  }
}

handleCallback()
</script>

<template>
  <div></div>
</template>
