<script setup lang="ts">
import { ChevronDown } from 'lucide-vue-next'

defineProps<{
  pluralizedTitle: string
}>()

const isDropdownOpen = ref(false)
</script>

<template>
  <DropdownMenu v-model:open="isDropdownOpen">
    <DropdownMenuTrigger as-child>
      <div
        v-bind="$attrs"
        class="flex items-center gap-x-1 transition-all duration-300 select-none min-w-0 cursor-pointer"
      >
        <span class="truncate">
          {{ pluralizedTitle }}
        </span>
        <ChevronDown
          class="shrink-0 size-4 text-muted-foreground transition-transform duration-300"
          :class="{ 'rotate-180': isDropdownOpen }"
        />
      </div>
    </DropdownMenuTrigger>
    <DropdownMenuContent
      align="start"
      class="w-[min(42rem,calc(100vw-2rem))] max-h-100 overflow-y-auto p-3"
    >
      <slot />
    </DropdownMenuContent>
  </DropdownMenu>
</template>
