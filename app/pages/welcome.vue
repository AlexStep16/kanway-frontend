<script setup lang="ts">
import WelcomeView from '~/views/WelcomeView.vue'

definePageMeta({
  authOnly: true,
  middleware: ['welcome'],
})

useHead({
  title: 'Kanway | Давайте начнем',
})
</script>

<template>
  <WelcomeView></WelcomeView>
</template>
