<script setup lang="ts">
import { BadgeX } from 'lucide-vue-next'
import RegisterButton from '@/components/Buttons/RegisterButton.vue'
import { ref } from 'vue'
import EmailSent from './EmailSent.vue'
import { TokenTypesEnum } from '@/enums/TokenTypesEnum'

defineProps<{
  isResending: boolean
  type: TokenTypesEnum
}>()

const isEmailSent = ref(false)
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-y-3" v-if="!isEmailSent">
    <BadgeX class="size-10 text-red-500" />
    <h1 class="block text-xl font-bold text-gray-800">Срок действия ссылки истёк.</h1>

    <p class="text-sm text-gray-600">Чтобы получить новую ссылку, нажмите на кнопку ниже.</p>

    <form @submit.prevent="() => (isEmailSent = true)">
      <RegisterButton text="Отправить ссылку" />
    </form>
  </div>

  <EmailSent :type :isResending v-else></EmailSent>
</template>
