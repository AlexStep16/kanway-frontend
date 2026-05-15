<script setup lang="ts">
import { ChevronDown } from 'lucide-vue-next'

defineProps<{
  title: string
  disabled?: boolean
}>()
</script>

<template>
  <button
    type="button"
    :disabled="disabled"
    class="group inline-flex items-center gap-x-2 min-w-0 py-1.5 px-2 text-xs sm:text-sm font-medium rounded-lg border border-transparent bg-secondary text-secondary-foreground hover:bg-secondary-foreground/20 transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:pointer-events-none data-[state=open]:bg-secondary-foreground/20"
  >
    <div class="flex items-center gap-x-2 min-w-0">
      <slot />
      <span class="truncate min-w-0 max-w-30 sm:max-w-50">
        {{ title }}
      </span>
    </div>

    <ChevronDown
      v-if="!disabled"
      class="size-3.5 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180 text-muted-foreground"
    />
  </button>
</template>
