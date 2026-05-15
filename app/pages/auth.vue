<script setup lang="ts">
import AuthView from '~/views/Auth/AuthView.vue'

definePageMeta({
  guestOnly: true,
  middleware: ['auth']
})
</script>

<template>
  <AuthView></AuthView>
</template>
