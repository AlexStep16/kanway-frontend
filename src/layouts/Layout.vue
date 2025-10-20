<template>
  <Toaster position="top-center" richColors closeButton />
  <slot />
</template>

<script setup lang="ts">
import { Toaster } from 'vue-sonner'
</script>
