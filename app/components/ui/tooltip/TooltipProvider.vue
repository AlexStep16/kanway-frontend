<script setup lang="ts">
import type { TooltipProviderProps } from 'reka-ui'
import { TooltipProvider } from 'reka-ui'

const props = withDefaults(defineProps<TooltipProviderProps>(), {
  delayDuration: 0,
})

const isMobile = useMediaQuery('(max-width: 768px)')
</script>

<template>
  <TooltipProvider
    v-bind="props"
    :disabled="isMobile"
  >
    <slot />
  </TooltipProvider>
</template>
