<script setup lang="ts">
import BackgroundCircles from '@/components/BackgroundCircles.vue'
import dayjs from 'dayjs'
import { toast } from 'vue-sonner'
import { linkYandexAccount, yandexAuth } from '~/services/auth'
import { useQueryClient } from '@tanstack/vue-query'
import { AllowedAuthStepsEnum } from '~/enums/AllowedAuthStepsEnum'

const queryClient = useQueryClient()

async function handleCallback() {
  const urlParams = new URLSearchParams(window.location.search)
  const code = urlParams.get('code')
  const state = urlParams.get('state')

  // Проверка state для защиты от CSRF
  const savedState = localStorage.getItem('yandex_auth_state')
  const authMode = localStorage.getItem('yandex_auth_mode')

  if (authMode === 'tracker-import') {
    const isValid = Boolean(code && state && state === savedState)

    // codeVerifier stays in localStorage for the opener window to read and clean up itself
    window.opener?.postMessage(
      { source: 'kanway-yandex-tracker-auth', code: isValid ? code : undefined },
      window.location.origin,
    )
    window.close()
    return
  }

  if (state !== savedState) {
    console.error('Invalid state')
    return
  }

  const codeVerifier = localStorage.getItem('yandex_code_verifier')
  const isAccountLinking = authMode === 'link'

  if (!code || !state || !codeVerifier) {
    console.error('Missing required parameters')
    return
  }

  try {
    const payload = { code, state, codeVerifier, timezone: dayjs.tz.guess() }

    if (isAccountLinking) {
      const user = await linkYandexAccount(payload)
      queryClient.setQueryData(userKeys.me, user)
    } else {
      const user = await yandexAuth(payload)
      if (!user) {
        await navigateTo({ path: '/auth', query: { step: AllowedAuthStepsEnum.FINISH_SIGN_UP } })
        return
      }
      queryClient.setQueryData(userKeys.me, user)
    }
    navigateTo('/workspace')
  } catch (error) {
    console.error('Authentication failed', error)
    toast.error(error instanceof Error ? error.message : 'Не удалось привязать аккаунт Яндекс')
    await navigateTo('/workspace')
  } finally {
    // Чистим данные из localStorage
    localStorage.removeItem('yandex_auth_state')
    localStorage.removeItem('yandex_code_verifier')
    localStorage.removeItem('yandex_auth_mode')
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
