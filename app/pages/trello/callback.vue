<script setup lang="ts">
import { TRELLO_AUTH_MESSAGE_SOURCE } from '~/constants/TRELLO_AUTH_MESSAGE_SOURCE'

function handleCallback() {
  const hash = window.location.hash.startsWith('#')
    ? window.location.hash.slice(1)
    : window.location.hash

  const params = new URLSearchParams(hash)
  const token = params.get('token') || undefined

  if (window.opener) {
    window.opener.postMessage({ source: TRELLO_AUTH_MESSAGE_SOURCE, token }, window.location.origin)
    window.close()
  }
}

handleCallback()
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-white">
    <p class="text-sm text-gray-500">Завершаем подключение Trello...</p>
  </div>
</template>
