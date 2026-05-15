<script setup lang="ts">
import WelcomeView from '~/views/WelcomeView.vue'

definePageMeta({
  authOnly: true,
  middleware: ['welcome'],
})
</script>

<template>
  <WelcomeView></WelcomeView>
</template>
