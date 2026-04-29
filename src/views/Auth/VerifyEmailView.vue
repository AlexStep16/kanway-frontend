<script setup lang="ts">
import { onMounted } from 'vue'
import { useData } from 'vike-vue/useData'
import { useVerificationEmail } from '@/composables/auth/mutations/useVerificationEmail'
import Spinner from '@/components/Loader/Spinner.vue'
import InvalidToken from '../../components/Auth/InvalidLink.vue'
import EmailOTPForm from '../../components/Auth/EmailOTPForm.vue'
import { HSStaticMethods } from 'preline'
import BackgroundCircles from '@/components/BackgroundCircles.vue'
import ExitButton from '@/components/Auth/ExitButton.vue'
import { useUser } from '@/composables/auth/queries/useUser'

const { mutate: verifyToken, isPending: isVerifying } = useVerificationEmail()

const { data: user, isPending: isUserPending } = useUser()

const { token } = useData<{ token?: string }>()

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

    <header class="w-full py-5 px-4 sm:px-10 flex justify-end items-center">
      <ExitButton />
    </header>
    <main class="flex items-center justify-center grow">
      <div
        class="size-full sm:w-100 h-auto bg-white border border-gray-200 rounded-xl shadow-2xs overflow-y-auto"
        v-if="isUserPending || isVerifying"
      >
        <div
          class="size-full sm:h-100 flex flex-col gap-y-2 items-center justify-center text-gray-500"
        >
          <Spinner class="size-7" />

          <p class="text-sm" v-if="isVerifying">Подтверждаем почту</p>
        </div>
      </div>

      <EmailOTPForm v-else-if="user" />
      <InvalidToken v-else />
    </main>
  </div>
</template>
