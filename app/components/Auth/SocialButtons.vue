<script setup lang="ts">
import YandexAuth from '~/views/Auth/YandexAuth.vue'
import VkAuth from '~/views/Auth/VkAuth.vue'
</script>

<template>
  <div>
    <div
      class="py-3 flex items-center text-xs text-gray-400 uppercase before:flex-1 before:border-t before:border-gray-200 before:me-6 after:flex-1 after:border-t after:border-gray-200 after:ms-6"
    >
      Или
    </div>
    <div class="flex items-center justify-center gap-2">
      <YandexAuth />
      <VkAuth />
    </div>
  </div>
</template>
