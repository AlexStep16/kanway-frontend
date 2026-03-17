<script setup lang="ts">
import { computed } from 'vue'
import { Layers } from 'lucide-vue-next'
import { IParent } from '@/interfaces/IParent'

const props = defineProps<{
  beforeСategory: IParent
  afterСategory: IParent
  baseBlockBeforeClasses?: string
  baseBlockAfterClasses?: string
}>()

const hasCategoryChange = computed(() => {
  return props.beforeСategory.id !== props.afterСategory.id
})
</script>

<template>
  <div class="flex items-center gap-x-1" v-if="hasCategoryChange">
    <div class="flex items-center gap-x-1" :class="baseBlockBeforeClasses" v-if="beforeСategory">
      <Layers class="size-3" />
      <span class="text-xs">{{ beforeСategory.name }}</span>
    </div>
    <div class="flex items-center gap-x-1" :class="baseBlockAfterClasses">
      <Layers class="size-3" />
      <span class="text-xs">{{ afterСategory.name }}</span>
    </div>
  </div>
  <div class="flex items-center gap-x-1 text-gray-500" v-else-if="beforeСategory">
    <Layers class="size-3" />
    <span class="text-xs">{{ beforeСategory.name }}</span>
  </div>
</template>
