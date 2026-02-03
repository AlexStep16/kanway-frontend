<script setup lang="ts">
import RegisterButton from '@/components/Buttons/RegisterButton.vue'
import { BadgeInfo } from 'lucide-vue-next'
import { navigate } from 'vike/client/router'
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-y-3">
    <BadgeInfo class="size-10 text-blue-500" />
    <h1 class="block text-xl font-bold text-gray-800">Почта уже подтверждена.</h1>

    <p class="text-sm text-gray-600">Можете пользоваться всеми функциями сервиса.</p>

    <form @submit.prevent="() => navigate('/workspace')">
      <RegisterButton text="На главный" />
    </form>
  </div>
</template>
