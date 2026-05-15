<script setup lang="ts">
import { AvailableColors } from '~/enums/AvailableColors'
import { computed } from 'vue'

const props = defineProps<{
  imageClasses?: string
  avatarColor?: string
}>()

const runtimeConfig = useRuntimeConfig()

const { data: user } = useUser()

const getAvatarUrl = computed(() => {
  if (user.value?.avatarUrl) {
    return runtimeConfig.public.serverBaseUrl + '/' + user.value.avatarUrl
  } else {
    return ''
  }
})

const getAvatarColor = computed(() => {
  return props.avatarColor || user.value?.avatarColor || AvailableColors.BLUE
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
