<script setup lang="ts">
import { ChevronDown } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'

defineEmits<{
  (e: 'showMore', event: MouseEvent): void
}>()
</script>

<template>
  <Button variant="primaryMuted" class="gap-1" @click="$emit('showMore', $event)">
    <span class="text-sm">Показать больше</span>
    <ChevronDown class="size-4.5" />
  </Button>
</template>
