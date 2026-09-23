<script setup lang="ts">
import { SquarePen } from '@lucide/vue'

defineProps<{
  name: string
}>()
</script>

<template>
  <div class="flex gap-x-1 items-center min-w-0 overflow-hidden">
    <Button
      variant="secondary"
      class="px-3 group max-w-full"
      size="sm"
    >
      <div class="shrink-0 size-4 relative flex items-center justify-center">
        <slot />
      </div>
      <span class="truncate">{{ name }}</span>
      <SquarePen class="size-3.5 text-muted-foreground opacity-0 group-hover:opacity-100" />
    </Button>
  </div>
</template>
