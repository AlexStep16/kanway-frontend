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
      closeButtonPosition="top-right"
    />
  </div>
</template>
