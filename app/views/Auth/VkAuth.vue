<script setup lang="ts">
import VkLogo from '~/assets/vk_logo.svg?skipsvgo'

async function prepareAuth() {
  const codeVerifier = generateRandomString(64)
  const codeChallenge = await generateCodeChallenge(codeVerifier)
  const state = generateRandomString(16)

  localStorage.setItem('vk_code_verifier', codeVerifier)
  localStorage.setItem('vk_auth_state', state)

  return { codeChallenge, state }
}

async function startVkAuth() {
  const { codeChallenge, state } = await prepareAuth()

  const runtimeConfig = useRuntimeConfig()

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: runtimeConfig.public.vkClientId as string,
    redirect_uri: runtimeConfig.public.vkRedirectUri as string,
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
    state: state,
  })

  window.location.href = `https://id.vk.ru/authorize?${params.toString()}`
}
</script>

<template>
  <div class="flex items-center justify-center">
    <button
      class="flex items-center justify-center bg-gray-100 rounded-md size-11 cursor-pointer hover:bg-gray-200 transition-colors"
      @click="startVkAuth"
    >
      <VkLogo class="size-6" />
    </button>
  </div>
</template>
