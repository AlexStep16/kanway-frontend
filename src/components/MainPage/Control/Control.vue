<script setup lang="ts">
import { Check, Map, Undo } from 'lucide-vue-next'
import { onMounted } from 'vue'
import Plan from '@components/MainPage/Control/Chat/Plan.vue'
import Confirmation from '@components/MainPage/Control/Chat/Confirmation.vue'
import Cancellation from '@components/MainPage/Control/Chat/Cancellation.vue'

defineProps<{
  tasks: Array<{
    id: number
    name: string
    is_completed: boolean
    due_date?: string
    color?: string
    tags?: string[]
  }>
  activeTab: typeof Plan | typeof Confirmation | typeof Cancellation
}>()

onMounted(() => {
  if (window.HSStaticMethods) window.HSStaticMethods.autoInit()
})
</script>

<template>
  <section class="relative z-1 overflow-hidden bg-gray-900 pb-16 md:pb-24">
    <div
      data-aos="fade-down"
      data-aos-duration="1000"
      data-aos-once="true"
      class="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 pt-16 md:pt-24 pb-10"
    >
      <!-- Title -->
      <div class="max-w-2xl text-center mx-auto">
        <h1 class="block font-bold text-gray-100 text-2xl md:text-3xl lg:text-4xl">
          Вы всегда за рулем.
        </h1>
      </div>
      <!-- End Title -->

      <div class="mt-4 max-w-2xl text-center mx-auto">
        <p class="md:text-lg text-gray-300">
          Мощный AI требует полного контроля. Мы создали систему, в которой вы всегда имеете
          последнее слово. Никаких сюрпризов.
        </p>
      </div>
    </div>

    <div
      data-aos="fade"
      data-aos-delay="300"
      data-aos-duration="1000"
      data-aos-once="true"
      class="grid grid-cols-1 sm:grid-cols-3 sm:justify-center mx-auto gap-2 p-1 w-full mb-8 bg-white/10 rounded-2xl lg:rounded-full max-w-fit"
    >
      <button
        @click="$emit('update:activeTab', Plan)"
        :class="{
          'bg-white text-gray-800': activeTab === Plan,
          'text-gray-400 bg-transparent': activeTab !== Plan,
        }"
        class="flex items-center justify-center h-12 gap-2 px-4 py-3 text-sm font-medium transition-colors duration-200 rounded-full"
      >
        <Map class="size-5" />
        Планирование
      </button>

      <button
        @click="$emit('update:activeTab', Confirmation)"
        :class="{
          'bg-white text-gray-800': activeTab === Confirmation,
          'text-gray-400 bg-transparent': activeTab !== Confirmation,
        }"
        class="flex items-center justify-center h-12 gap-2 px-4 py-3 text-sm font-medium transition-colors duration-200 rounded-full"
      >
        <Check class="size-5" />
        Подтверждение
      </button>

      <button
        @click="$emit('update:activeTab', Cancellation)"
        :class="{
          'bg-white text-gray-800': activeTab === Cancellation,
          'text-gray-400 bg-transparent': activeTab !== Cancellation,
        }"
        class="flex items-center justify-center h-12 gap-2 px-4 py-3 text-sm font-medium transition-colors duration-200 rounded-full"
      >
        <Undo class="size-5" />
        Отмена
      </button>
    </div>

    <!-- Tab Content -->
    <div class="px-4 sm:px-6 lg:px-8 tab-content">
      <div
        data-aos="fade"
        data-aos-duration="1000"
        data-aos-once="true"
        class="sm:p-5 bg-white/10 mx-auto max-w-[45rem] rounded-2xl"
      >
        <div class="rounded-xl md:rounded-2xl bg-white p-2 sm:p-4">
          <Transition name="fade" mode="out-in">
            <component :is="activeTab" :tasks />
          </Transition>
        </div>
      </div>
    </div>
  </section>
</template>
