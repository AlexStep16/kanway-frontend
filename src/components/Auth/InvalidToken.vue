<script setup lang="ts">
import RegisterButton from '@/components/Buttons/RegisterButton.vue'
import { BadgeX } from 'lucide-vue-next'
import { navigate } from 'vike/client/router'
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-y-3">
    <BadgeX class="size-10 text-red-500" />
    <h1 class="block text-xl font-bold text-gray-800">Ссылка недействительна.</h1>

    <p class="text-sm text-gray-600">Возможно, в ссылке ошибка.</p>

    <form @submit.prevent="() => navigate('/')">
      <RegisterButton text="На главный" />
    </form>
  </div>
</template>
