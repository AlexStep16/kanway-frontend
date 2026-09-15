<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { CircleUserRound, LockKeyhole, Bot, CreditCard, Gem, PlugZap } from '@lucide/vue'
import { SettingTabs } from '~/enums/SettingTabs'

defineProps<{
  currentTab: SettingTabs
}>()

const emit = defineEmits<{
  (e: 'selectTab', tab: SettingTabs): void
}>()

const tabs = [
  { id: SettingTabs.PROFILE, label: 'Профиль', icon: CircleUserRound },
  { id: SettingTabs.SECURITY, label: 'Безопасность', icon: LockKeyhole },
  { id: SettingTabs.ASSISTANT, label: 'Ассистент', icon: Bot },
  { id: SettingTabs.PLANS, label: 'Тарифы', icon: Gem },
  { id: SettingTabs.PAYMENTS, label: 'Платежи', icon: CreditCard },
  { id: SettingTabs.IMPORT, label: 'Импорт', icon: PlugZap },
]

const scrollContainer = ref<HTMLElement | null>(null)
const canScrollRight = ref(false)
const canScrollLeft = ref(false)

const updateScrollIndicators = () => {
  const el = scrollContainer.value
  if (!el) return

  canScrollLeft.value = el.scrollLeft > 5
  canScrollRight.value = el.scrollLeft + el.clientWidth < el.scrollWidth - 5
}

onMounted(() => {
  updateScrollIndicators()
  window.addEventListener('resize', updateScrollIndicators)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateScrollIndicators)
})
</script>

<template>
  <div class="relative w-full border-b border-gray-200">
    <div
      class="pointer-events-none absolute left-0 top-0 bottom-0 z-10 w-8 bg-linear-to-r from-white to-transparent transition-opacity duration-200"
      :class="canScrollLeft ? 'opacity-100' : 'opacity-0'"
    />

    <nav
      ref="scrollContainer"
      class="flex items-center gap-x-1 overflow-x-auto py-2 px-1 scrollbar-none sm:gap-x-2"
      aria-label="Настройки"
      @scroll="updateScrollIndicators"
    >
      <button
        v-for="tab in tabs"
        :key="tab.id"
        type="button"
        class="flex items-center gap-x-2 py-2 px-3 text-sm font-medium rounded-lg whitespace-nowrap shrink-0 focus:outline-none transition-colors duration-100"
        :class="{
          'bg-blue-100 text-blue-600 hover:bg-blue-200': currentTab === tab.id,
          'text-gray-500 hover:bg-gray-100 hover:text-gray-700': currentTab !== tab.id,
        }"
        @click="emit('selectTab', tab.id)"
      >
        <component
          :is="tab.icon"
          class="size-4.5 shrink-0"
        />
        <span>{{ tab.label }}</span>
      </button>
    </nav>

    <div
      class="pointer-events-none absolute right-0 top-0 bottom-0 z-10 w-10 bg-linear-to-l from-white to-transparent transition-opacity duration-200"
      :class="canScrollRight ? 'opacity-100' : 'opacity-0'"
    />
  </div>
</template>

<style scoped>
.scrollbar-none {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-none::-webkit-scrollbar {
  display: none;
}
</style>
