<template>
  <meta charset="UTF-8" />
  <link rel="apple-touch-icon" sizes="180x180" :href="`${path}assets/favicon/apple-touch-icon.png`">
  <link rel="icon" type="image/png" sizes="32x32" :href="`${path}assets/favicon/favicon-32x32.png`">
  <link rel="icon" type="image/png" sizes="16x16" :href="`${path}assets/favicon/favicon-16x16.png`">
  <link rel="icon" :href="`${path}favicon.svg`" type="image/svg+xml">
  <link rel="icon" :href="`${path}favicon.ico`">
  <link rel="manifest" :href="`${path}assets/favicon/site.webmanifest`">
  <link rel="mask-icon" :href="`${path}assets/favicon/safari-pinned-tab.svg`" color="#3b82f6">
  <link rel="canonical" href="https://kanbar.ru">
  <meta name="apple-mobile-web-app-title" content="Kanbar">
  <meta name="application-name" content="Kanbar">
  <meta name="msapplication-TileColor" content="#2d89ef">
  <meta name="theme-color" content="#ffffff">

  <meta name="robots" content="index, follow" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
  <meta name="description"
    content="Kanbar - ваш персональный AI-помощник для управления задачами. Создавайте задачи голосом или текстом, организуйте проекты и повышайте свою продуктивность. Попробуйте бесплатно!">
  <title>Kanbar | AI-помощник для управления задачами</title>

  <script src="https://yastatic.net/s3/passport-sdk/autofill/v1/sdk-suggest-with-polyfills-latest.js" async
    defer></script>
  <script src="https://yastatic.net/s3/passport-sdk/autofill/v1/sdk-suggest-token-with-polyfills-latest.js" async
    defer></script>
  <script :src="`${hostUrl}/assets/scripts/yametrika.js`" async defer></script>
  <noscript>
    <div><img src="https://mc.yandex.ru/watch/100558012" style="position:absolute; left:-9999px;" alt="" /></div>
  </noscript>
</template>

<script lang="ts" setup>
const path = import.meta.env.VITE_USER_NODE_ENV === "production" ? "/" : "/src/";
const hostUrl = import.meta.env.VITE_HOST_URL || "https://kanbar.ru";
</script>