<script setup lang="ts">
import { onMounted } from 'vue'
import Spinner from '@/components/Loader/Spinner.vue'
import InvalidLink from '../../components/Auth/InvalidLink.vue'
import { HSStaticMethods } from 'preline'
import { useVerificationLogin } from '@/composables/auth/mutations/useVerificationLogin'

const { mutate: verifyToken, error } = useVerificationLogin()

const props = defineProps<{
  token: string
}>()

onMounted(() => {
  HSStaticMethods.autoInit()

  if (props.token) {
    verifyToken({ token: props.token })
  }
})
</script>

<template>
  <InvalidLink v-if="error" />
  <div
    class="size-full sm:w-100 h-auto bg-white border border-gray-200 rounded-xl shadow-2xs overflow-y-auto"
    v-else
  >
    <div class="size-full sm:h-100 flex flex-col gap-y-2 items-center justify-center text-gray-500">
      <Spinner class="size-7" />

      <p class="text-sm">Подтверждаем вход</p>
    </div>
  </div>
</template>
