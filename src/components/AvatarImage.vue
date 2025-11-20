<script setup lang="ts">
import { useAuthStore } from '@stores/auth'
import { computed } from 'vue'

defineProps<{
  mockImageClasses?: string
}>()

const AUTH_STORE = useAuthStore()

const getAvatarUrl = computed(() => {
  if (AUTH_STORE.user?.avatarUrl) {
    return import.meta.env.VITE_SERVER_BASE_URL + '/' + AUTH_STORE.user.avatarUrl
  } else {
    return ''
  }
})
</script>

<template>
  <div
    class="shrink-0 size-full rounded-full"
    :style="{
      backgroundImage: `url(${getAvatarUrl})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }"
    alt="Аватар"
    v-if="AUTH_STORE.user?.avatarUrl"
  />

  <div
    class="shrink-0 size-full rounded-full font-bold flex items-center justify-center text-white"
    :class="mockImageClasses"
    :style="{ backgroundColor: 'green' }"
    alt="Аватар"
    v-else
  >
    А
  </div>
</template>
