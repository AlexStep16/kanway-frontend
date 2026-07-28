<script setup lang="ts">
import { Toaster } from 'vue-sonner'
</script>

<template>
  <div>
    <NuxtLoadingIndicator color="#3b82f6" />
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <Toaster
      position="top-center"
      closeButton
      closeButtonPosition="top-right"
      :toastOptions="{
        actionButtonStyle: {
          backgroundColor: 'var(--color-blue-500)',
        },
      }"
    />
  </div>
</template>
