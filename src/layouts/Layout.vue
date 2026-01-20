<script setup lang="ts">
import { VueQueryDevtools } from '@tanstack/vue-query-devtools'
import { Toaster } from 'vue-sonner'
</script>

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
  <VueQueryDevtools />

  <slot />
</template>
