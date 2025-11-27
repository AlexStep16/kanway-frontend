<template>
  <Toaster
    position="top-center"
    richColors
    closeButton
    :toastOptions="{
      actionButtonStyle: {
        backgroundColor: 'var(--color-blue-500)',
      },
    }"
  />
  <slot />
</template>

<script setup lang="ts">
import { Toaster } from 'vue-sonner'
</script>
