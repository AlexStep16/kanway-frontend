<script setup lang="ts">
import InvalidToken from '~/components/Auth/InvalidLink.vue'

const { mutate: verifyToken, error } = useVerificationEmail()

const props = defineProps<{
  token: string
}>()

onMounted(() => {
  if (props.token) {
    verifyToken({ token: props.token })
  }
})
</script>

<template>
  <InvalidToken v-if="error" />
  <div
    class="size-full sm:w-100 h-auto bg-white border border-gray-200 rounded-xl shadow-2xs overflow-y-auto"
    v-else
  >
    <div class="size-full sm:h-100 flex flex-col gap-y-2 items-center justify-center text-gray-500">
      <Spinner class="size-7" />

      <p class="text-sm">Подтверждаем почту</p>
    </div>
  </div>
</template>
