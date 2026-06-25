<script setup lang="ts">
import AuthView from '~/views/Auth/AuthView.vue'

definePageMeta({
  guestOnly: true,
  middleware: ['auth'],
})
</script>

<template>
  <div
    class="relative size-full isolate bg-gray-100 overflow-hidden min-h-screen flex flex-col px-2"
  >
    <BackgroundCircles />
    <main class="flex items-center justify-center grow">
      <AuthView></AuthView>
    </main>
  </div>
</template>
