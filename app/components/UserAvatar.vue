<script lang="ts" setup>
import { AvailableColors } from '~/enums/AvailableColors'

withDefaults(
  defineProps<{
    size?: 'base' | 'sm' | 'lg' | null
    shape?: 'circle' | 'square'
  }>(),
  {
    size: 'sm',
    shape: 'square',
  },
)

const runtimeConfig = useRuntimeConfig()

const { data: user } = useUser()

const avatarUrl = computed(() => {
  if (user.value?.avatarUrl) {
    return runtimeConfig.public.serverApiUrl + '/' + user.value.avatarUrl
  } else {
    return ''
  }
})

const avatarColor = computed(() => {
  return user.value?.avatarColor || AvailableColors.BLUE
})

const usernameFirstLetter = computed(() => {
  if (user.value?.username) {
    return user.value.username.charAt(0).toUpperCase()
  } else {
    return 'A'
  }
})
</script>

<template>
  <Avatar
    :size="size"
    :shape="shape"
    :style="`background-color: ${avatarColor}`"
  >
    <AvatarImage
      v-if="user?.avatarUrl"
      :src="avatarUrl"
      :alt="user.username"
    />
    <AvatarFallback
      v-else
      class="text-white text-base"
    >
      {{ usernameFirstLetter }}
    </AvatarFallback>
  </Avatar>
</template>
