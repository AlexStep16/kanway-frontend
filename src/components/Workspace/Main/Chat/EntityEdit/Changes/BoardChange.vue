<script setup lang="ts">
import { computed } from 'vue'
import { SquareKanban } from 'lucide-vue-next'
import { IParent } from '@/interfaces/IParent'

const props = defineProps<{
  beforeBoard: IParent
  afterBoard: IParent
  baseBlockBeforeClasses?: string
  baseBlockAfterClasses?: string
}>()

const hasBoardChange = computed(() => {
  return props.beforeBoard.id !== props.afterBoard.id
})
</script>

<template>
  <div class="flex items-center gap-x-1" v-if="hasBoardChange">
    <div class="flex items-center gap-x-1" :class="baseBlockBeforeClasses" v-if="beforeBoard">
      <SquareKanban class="size-3" />
      <span class="text-xs">{{ beforeBoard.name }}</span>
    </div>
    <div class="flex items-center gap-x-1" :class="baseBlockAfterClasses">
      <SquareKanban class="size-3" />
      <span class="text-xs">{{ afterBoard.name }}</span>
    </div>
  </div>
  <div class="flex items-center gap-x-1 text-gray-500" v-else-if="beforeBoard">
    <SquareKanban class="size-3" />
    <span class="text-xs">{{ beforeBoard.name }}</span>
  </div>
</template>
