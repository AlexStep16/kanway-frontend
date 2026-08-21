<script setup lang="ts">
import MainPageView from '~/views/MainPageView.vue'

useSeoMeta({
  title: 'Kanway | AI-агент для управления проектами',
  ogTitle: 'Kanway | AI-агент для управления проектами',
  description:
    'Персональный AI-агент для управления проектами. Создавайте задачи голосом или текстом, организуйте проекты и повышайте свою продуктивность. Попробуйте бесплатно!',
  ogDescription:
    'Персональный AI-агент для управления проектами. Создавайте задачи голосом или текстом, организуйте проекты и повышайте свою продуктивность. Попробуйте бесплатно!',
})

useHead({
  script: [
    {
      innerHTML: `
        if (document.cookie.split('; ').some(row => row.startsWith('is_logged_in=true'))) {
          window.location.replace('/workspace');
        }
      `,
      tagPosition: 'head',
    },
  ],
})
</script>

<template>
  <MainPageView></MainPageView>
</template>
