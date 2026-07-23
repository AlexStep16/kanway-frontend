<script lang="ts" setup>
import { Eye, EyeOff } from '@lucide/vue'

defineProps<{
  isPasswordVisible: boolean
}>()
</script>

<template>
  <button
    class="absolute cursor-pointer right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400 hover:text-primary transition-colors duration-200"
    :class="{
      'text-primary': isPasswordVisible,
    }"
    @click.prevent="$emit('toggle-password-visibility')"
  >
    <Eye
      class="size-4.5"
      v-if="isPasswordVisible"
    />
    <EyeOff
      class="size-4.5"
      v-else
    />
  </button>
</template>
