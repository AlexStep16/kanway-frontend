<script setup lang="ts">
import type { AllowedAuthStepsEnum } from '~/enums/AllowedAuthStepsEnum'
import AuthView from '~/views/Auth/AuthView.vue'

definePageMeta({
  guestOnly: true,
  middleware: ['auth'],
})

const route = useRoute()

const step: ComputedRef<AllowedAuthStepsEnum | undefined> = computed(
  () => route.query.step as AllowedAuthStepsEnum | undefined,
)

const key = computed(() => {
  if (!step.value) return 'auth'
  return step.value
})
</script>

<template>
  <div
    class="relative size-full isolate bg-gray-100 overflow-hidden min-h-screen flex flex-col px-2"
  >
    <BackgroundCircles />
    <main class="flex items-center justify-center grow">
      <TransitionGroup name="slide-left">
        <div
          class="flex items-center justify-center"
          :key="key"
        >
          <AuthView></AuthView>
        </div>
      </TransitionGroup>
    </main>
  </div>
</template>
