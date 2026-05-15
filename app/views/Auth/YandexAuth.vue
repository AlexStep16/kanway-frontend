<script setup lang="ts">
import YandexLogo from '~/assets/yandex_logo.svg?skipsvgo'

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

  const runtimeConfig = useRuntimeConfig()

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: runtimeConfig.public.yandexClientId as string,
    redirect_uri: runtimeConfig.public.yandexRedirectUri as string,
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
    state: state,
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
