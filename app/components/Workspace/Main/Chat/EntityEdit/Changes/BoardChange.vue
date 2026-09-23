<script setup lang="ts">
import { computed } from 'vue'
import { SquareKanban } from '@lucide/vue'
import type { IParent } from '~/interfaces/IParent'

const props = defineProps<{
  beforeBoard: IParent | string
  afterBoard: IParent
  baseBlockBeforeClasses?: string
  baseBlockAfterClasses?: string
}>()

const isBeforeBoardExists = computed(() => {
  return typeof props.beforeBoard !== 'string'
})

const hasBoardChange = computed(() => {
  if (!isBeforeBoardExists.value) {
    return true
  } else {
    return (props.beforeBoard as IParent).id !== (props.afterBoard as IParent).id
  }
})
</script>

<template>
  <div
    class="flex items-center gap-x-1"
    v-if="hasBoardChange"
  >
    <div
      class="flex items-center gap-x-1"
      :class="baseBlockBeforeClasses"
      v-if="beforeBoard"
    >
      <SquareKanban class="size-3 shrink-0" />
      <span
        class="text-xs"
        v-if="isBeforeBoardExists"
        >{{ (beforeBoard as IParent).name }}</span
      >
      <span
        class="text-xs"
        v-else
        >Удалено</span
      >
    </div>
    <div
      class="flex items-center gap-x-1"
      :class="baseBlockAfterClasses"
    >
      <SquareKanban class="size-3 shrink-0" />
      <span class="text-xs">{{ afterBoard.name }}</span>
    </div>
  </div>
  <div
    class="flex items-center gap-x-1 text-gray-500"
    v-else-if="beforeBoard"
  >
    <SquareKanban class="size-3 shrink-0" />
    <span class="text-xs">{{ (beforeBoard as IParent).name }}</span>
  </div>
</template>
