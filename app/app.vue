<script setup lang="ts">
import { Toaster } from 'vue-sonner'

</script>

<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtPage />
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
  </div>
</template>
