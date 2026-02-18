<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <ul
    data-sidebar="menu-badge"
    :class="cn('flex min-w-0 flex-col gap-1', 'group-data-[collapsible=icon]:hidden', props.class)"
  >
    <slot />
  </ul>
</template>
