<script setup lang="ts">
import CreateBody from '@components/Dropdowns/Create/CreateBody.vue'
import { HSDropdown } from 'preline'
import { onMounted, ref } from 'vue'

const dropdown = ref<HTMLElement | null>(null)
const dropdownMenu = ref<HTMLElement | null>(null)

defineProps<{
  dropdownClasses?: string
  dropdownMenuWidth?: number
  id: string
}>()

onMounted(() => {
  if (window.HSStaticMethods) window.HSStaticMethods.autoInit()

  if (dropdown.value && dropdown.value instanceof HTMLElement) {
    const dropdownInstance = HSDropdown.getInstance(dropdown.value) as HSDropdown | null

    if (dropdownInstance) {
      document.addEventListener('click', (e: any) => {
        if (dropdownInstance && dropdownMenu.value && !dropdownMenu.value.contains(e.target)) {
          if (dropdownInstance) {
            dropdownInstance.close()
          }
        }
      })
    }
  }
})
</script>

<template>
  <div
    class="hs-dropdown [--strategy:absolute] [--offset:2] [--auto-close:false] relative w-full inline-flex"
    :class="dropdownClasses"
    ref="dropdown"
  >
    <slot />

    <div
      class="hs-dropdown-menu hs-dropdown-open:opacity-100 transition-[opacity,margin] duration opacity-0 hidden z-80 bg-white border border-gray-200 rounded-lg shadow-lg"
      role="menu"
      ref="dropdownMenu"
      aria-orientation="vertical"
      aria-labelledby="hs-sidebar-workspace-create"
    >
      <CreateBody :dropdownMenuWidth="dropdownMenuWidth" :id="id" />
    </div>
  </div>
</template>
