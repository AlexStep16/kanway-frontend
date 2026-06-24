<script setup lang="ts">
import { XCircle } from 'lucide-vue-next'

defineProps<{
  title: string
  stateClasses: Record<string, boolean>
}>()
</script>

<template>
  <div class="flex flex-col gap-y-1 transition-all duration-300 select-none min-w-0">
    <div class="flex items-center gap-x-1 transition-all duration-300 select-none min-w-0">
      <XCircle
        class="size-3 text-red-500 shrink-0"
        stroke-width="3"
      />
      <span
        class="truncate"
        :class="stateClasses"
      >
        {{ title }}
      </span>
    </div>
  </div>
</template>
