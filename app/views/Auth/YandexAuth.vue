<script setup lang="ts">
import YandexLogo from '~/assets/yandex_logo.svg?skipsvgo'

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

  localStorage.setItem('yandex_code_verifier', codeVerifier)
  localStorage.setItem('yandex_auth_state', state)
  if (props.isAccountLinking) {
    localStorage.setItem('yandex_auth_mode', 'link')
  } else {
    localStorage.removeItem('yandex_auth_mode')
  }

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
      class="flex items-center justify-center gap-x-2 bg-gray-100 rounded-md cursor-pointer hover:bg-gray-200 transition-colors"
      :class="props.label ? 'py-2 px-3 text-xs font-medium' : 'size-11'"
      @click="startYandexAuth"
    >
      <YandexLogo class="size-7" />
      <span v-if="props.label">{{ props.label }}</span>
    </button>
  </div>
</template>
