<script setup lang="ts">
import { vkAuthApi } from '@/api/auth'
import dayjs from 'dayjs'
import { navigate } from 'vike/client/router'

async function handleCallback() {
  const urlParams = new URLSearchParams(window.location.search)
  const code = urlParams.get('code')
  const state = urlParams.get('state')
  const deviceId = urlParams.get('device_id') || undefined

  // Проверка state для защиты от CSRF
  const savedState = localStorage.getItem('vk_auth_state')
  if (state !== savedState) {
    console.error('Invalid state')
    return
  }

  const codeVerifier = localStorage.getItem('vk_code_verifier')

  if (!code || !state || !codeVerifier) {
    console.error('Missing required parameters')
    return
  }

  try {
    await vkAuthApi({ code, state, codeVerifier, timezone: dayjs.tz.guess(), deviceId })
    navigate('/workspace')
  } catch (error) {
    console.error('Authentication failed', error)
  } finally {
    // Чистим данные из localStorage
    localStorage.removeItem('vk_auth_state')
    localStorage.removeItem('vk_code_verifier')
  }
}

handleCallback()
</script>

<template>
  <div></div>
</template>
