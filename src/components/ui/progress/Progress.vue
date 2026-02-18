<script setup lang="ts">
import type { ProgressRootProps } from 'reka-ui'
import { computed, type HTMLAttributes } from 'vue'
import { reactiveOmit } from '@vueuse/core'
import { ProgressIndicator, ProgressRoot } from 'reka-ui'
import { cn } from '@/lib/utils'

const props = withDefaults(
  defineProps<
    ProgressRootProps & { class?: HTMLAttributes['class']; color?: string; isLimit?: boolean }
  >(),
  {
    modelValue: 0,
  },
)

const delegatedProps = reactiveOmit(props, 'class')

const isFull = computed(() => props.modelValue === 100)
const isAlmostFull = computed(
  () => props.modelValue && props.modelValue >= 50 && props.modelValue < 100,
)
</script>

<template>
  <ProgressRoot
    v-bind="delegatedProps"
    :class="
      cn(
        'relative h-2 w-full overflow-hidden rounded-full bg-primary/20',
        props.class,
        isLimit && isFull && 'bg-red-500/20',
        isLimit && isAlmostFull && 'bg-yellow-500/20',
      )
    "
  >
    <ProgressIndicator
      :class="
        cn(
          'h-full w-full flex-1 transition-all bg-primary',
          isLimit && isFull && 'bg-red-500',
          isLimit && isAlmostFull && 'bg-yellow-500',
        )
      "
      :style="`transform: translateX(-${100 - (props.modelValue ?? 0)}%);`"
    />
  </ProgressRoot>
</template>
