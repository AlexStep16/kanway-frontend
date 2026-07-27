<script setup lang="ts">
import VkLogo from '~/assets/vk_logo.svg?skipsvgo'

const props = withDefaults(
  defineProps<{
    isAccountLinking?: boolean
    label?: string
  }>(),
  {
    isAccountLinking: false,
    label: undefined,
  },
)

async function prepareAuth() {
  const codeVerifier = generateRandomString(64)
  const codeChallenge = await generateCodeChallenge(codeVerifier)
  const state = generateRandomString(16)

  localStorage.setItem('vk_code_verifier', codeVerifier)
  localStorage.setItem('vk_auth_state', state)
  if (props.isAccountLinking) {
    localStorage.setItem('vk_auth_mode', 'link')
  } else {
    localStorage.removeItem('vk_auth_mode')
  }

  return { codeChallenge, state }
}

async function startVkAuth() {
  const { codeChallenge, state } = await prepareAuth()

  const runtimeConfig = useRuntimeConfig()

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: runtimeConfig.public.vkUserId as string,
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
      class="flex items-center justify-center gap-x-2 bg-gray-100 rounded-md cursor-pointer hover:bg-gray-200 transition-colors"
      :class="props.label ? 'py-2 px-3 text-xs font-medium' : 'size-11'"
      @click="startVkAuth"
    >
      <VkLogo class="size-6" />
      <span v-if="props.label">{{ props.label }}</span>
    </button>
  </div>
</template>
