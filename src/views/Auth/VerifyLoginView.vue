<script setup lang="ts">
import { onMounted } from 'vue'
import { useData } from 'vike-vue/useData'
import Spinner from '@/components/Loader/Spinner.vue'
import InvalidLink from '../../components/Auth/InvalidLink.vue'
import { HSStaticMethods } from 'preline'
import BackgroundCircles from '@/components/BackgroundCircles.vue'
import { useVerificationLogin } from '@/composables/auth/mutations/useVerificationLogin'

const { mutate: verifyToken, error } = useVerificationLogin()

const { token } = useData<{ token: string }>()

onMounted(() => {
  HSStaticMethods.autoInit()

  if (token) {
    verifyToken({ token })
  }
})
</script>

<template>
  <div class="size-full bg-gray-100 fixed inset-0 flex flex-col px-2">
    <BackgroundCircles />

    <main class="flex items-center justify-center grow">
      <div
        class="size-full sm:w-100 h-auto bg-white border border-gray-200 rounded-xl shadow-2xs overflow-y-auto"
        v-if="!error"
      >
        <div
          class="size-full sm:h-100 flex flex-col gap-y-2 items-center justify-center text-gray-500"
        >
          <Spinner class="size-7" />

          <p class="text-sm">Подтверждаем вход</p>
        </div>
      </div>
      <InvalidLink v-else />
    </main>
  </div>
</template>
