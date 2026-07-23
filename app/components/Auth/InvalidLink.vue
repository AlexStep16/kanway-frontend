<script setup lang="ts">
import RegisterButton from '~/components/Buttons/RegisterButton.vue'
import { BadgeInfo } from '@lucide/vue'
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-y-2">
    <BadgeInfo class="size-10 text-yellow-500" />
    <div class="flex flex-col items-center justify-center text-center gap-y-1">
      <h1 class="text-xl font-bold text-gray-800">Ссылка больше не работает</h1>
      <p class="text-sm text-gray-600">
        Срок её действия истёк или она указана неверно.<br />Пожалуйста, запросите новую ссылку.
      </p>
    </div>
    <form
      @submit.prevent="() => navigateTo('/')"
      class="mt-2"
    >
      <RegisterButton text="На главную" />
    </form>
  </div>
</template>
