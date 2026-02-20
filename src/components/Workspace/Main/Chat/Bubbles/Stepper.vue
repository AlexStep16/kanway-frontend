<script setup lang="ts">
import Spinner from '@/components/ui/spinner/Spinner.vue'
import { Check, X } from 'lucide-vue-next'

defineProps<{
  steps: {
    id: string
    name: string
    state: 'in_progress' | 'completed' | 'failed'
  }[]
}>()
</script>

<template>
  <div class="flex flex-col items-start justify-start gap-y-1">
    <div
      class="flex items-center justify-start text-foreground gap-x-2"
      v-for="step in steps"
      :key="step.id"
    >
      <div
        class="rounded-full size-4 flex items-center justify-center bg-green-600"
        v-if="step.state === 'completed'"
      >
        <Check class="size-2.5 text-white" strokeWidth="4" />
      </div>
      <div
        class="rounded-full size-4 flex items-center justify-center bg-red-500"
        v-else-if="step.state === 'failed'"
      >
        <X class="size-2.5 text-white" strokeWidth="4" />
      </div>
      <Spinner class="size-4 text-muted-foreground" v-else-if="step.state === 'in_progress'" />
      <span class="text-sm text-muted-foreground">{{ step.name }}</span>
    </div>
  </div>
</template>
