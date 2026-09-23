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
    <ClientOnly>
      <Toaster
        position="top-center"
        closeButtonPosition="top-right"
      />
    </ClientOnly>
  </div>
</template>
