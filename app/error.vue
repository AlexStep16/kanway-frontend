<script setup lang="ts">
import type { NuxtError } from '#app'
import Header from '~/components/Header.vue'

const props = defineProps<{
  error: NuxtError
}>()

const is404Error = computed(() => props.error?.status === 404)

const router = useRouter()

const removeGuard = router.beforeEach((to) => {
  removeGuard()
  clearError({ redirect: to.fullPath })
})

const getErrorMessage = computed(() => {
  if (is404Error.value) {
    return 'Страница не найдена'
  }
  return props.error?.message || 'Произошла ошибка'
})
</script>

<template>
  <div class="size-full bg-zinc-50 min-h-screen flex flex-col px-2">
    <Header />

    <main class="flex-1 w-full flex items-center justify-center pt-28 pb-12 px-4 sm:pt-36 sm:pb-24">
      <div class="w-full max-w-md mx-auto text-center flex flex-col items-center">
        <div class="inline-flex items-center justify-center mb-4 sm:mb-6">
          <span class="text-6xl sm:text-8xl font-semibold tracking-tight text-zinc-500">{{
            error?.status
          }}</span>
        </div>

        <h1 class="text-2xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
          {{ getErrorMessage }}
        </h1>

        <p
          class="mt-2 sm:mt-4 text-sm sm:text-base text-zinc-500 leading-relaxed"
          v-if="is404Error"
        >
          Возможно, запрашиваемый адрес устарел, был изменен или страница была перемещена.
        </p>
      </div>
    </main>
  </div>
</template>
