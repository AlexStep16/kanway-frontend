<script setup lang="ts">
import YandexLogo from '@assets/yandex_logo.svg?component'
import { generateRandomString } from '@/utils/generateRandomString'
import { generateCodeChallenge } from '@/utils/generateCodeChallenge'

async function prepareAuth() {
  const codeVerifier = generateRandomString(64)
  const codeChallenge = await generateCodeChallenge(codeVerifier)
  const state = generateRandomString(16)

  localStorage.setItem('yandex_code_verifier', codeVerifier)
  localStorage.setItem('yandex_auth_state', state)

  return { codeChallenge, state }
}

async function startYandexAuth() {
  const { codeChallenge, state } = await prepareAuth()

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: import.meta.env.VITE_YANDEX_CLIENT_ID,
    redirect_uri: import.meta.env.VITE_YANDEX_REDIRECT_URI,
    code_challenge: encodeURIComponent(codeChallenge),
    code_challenge_method: 'S256',
    state: encodeURIComponent(state),
  })

  window.location.href = `https://oauth.yandex.ru/authorize?${params.toString()}`
}
</script>

<template>
  <div class="flex items-center justify-center">
    <button
      class="flex items-center justify-center bg-gray-100 rounded-md size-11 cursor-pointer hover:bg-gray-200 transition-colors"
      @click="startYandexAuth"
    >
      <YandexLogo class="size-7" />
    </button>
  </div>
</template>
