<script setup lang="ts">
import { AvailableColors } from '@/enums/AvailableColors'
import { useAuthStore } from '@stores/auth'
import { computed, toRef } from 'vue'

defineProps<{
  imageClasses?: string
}>()

const AUTH_STORE = useAuthStore()

const user = toRef(AUTH_STORE, 'user')

const getAvatarUrl = computed(() => {
  if (user.value?.avatarUrl) {
    return import.meta.env.VITE_SERVER_BASE_URL + '/' + user.value.avatarUrl
  } else {
    return ''
  }
})

const getAvatarColor = computed(() => {
  return user.value?.avatarColor || AvailableColors.BLUE
})

const getUsernameFirstLetter = computed(() => {
  if (user.value?.username) {
    return user.value.username.charAt(0).toUpperCase()
  } else {
    return 'A'
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
    v-if="user?.avatarUrl"
  />

  <div
    class="shrink-0 size-full rounded-full font-bold flex items-center justify-center text-white"
    :class="imageClasses"
    :style="{ backgroundColor: getAvatarColor }"
    alt="Аватар"
    v-else
  >
    {{ getUsernameFirstLetter }}
  </div>
</template>
