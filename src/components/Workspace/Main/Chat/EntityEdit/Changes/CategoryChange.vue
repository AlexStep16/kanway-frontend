<script setup lang="ts">
import { computed } from 'vue'
import { Layers } from 'lucide-vue-next'
import { IParent } from '@/interfaces/IParent'

const props = defineProps<{
  beforeСategory: IParent | string
  afterСategory: IParent
  baseBlockBeforeClasses?: string
  baseBlockAfterClasses?: string
}>()

const isBeforeCategoryExists = computed(() => {
  return typeof props.beforeСategory !== 'string'
})

const hasCategoryChange = computed(() => {
  if (!isBeforeCategoryExists.value) {
    return true
  } else {
    return (props.beforeСategory as IParent).id !== (props.afterСategory as IParent).id
  }
})
</script>

<template>
  <div class="flex items-center gap-x-1" v-if="hasCategoryChange">
    <div class="flex items-center gap-x-1" :class="baseBlockBeforeClasses" v-if="beforeСategory">
      <Layers class="size-3 shrink-0" />
      <span class="text-xs" v-if="isBeforeCategoryExists">{{
        (beforeСategory as IParent).name
      }}</span>
      <span class="text-xs" v-else>Удалено</span>
    </div>
    <div class="flex items-center gap-x-1" :class="baseBlockAfterClasses">
      <Layers class="size-3 shrink-0" />
      <span class="text-xs">{{ afterСategory.name }}</span>
    </div>
  </div>
  <div class="flex items-center gap-x-1 text-gray-500" v-else-if="beforeСategory">
    <Layers class="size-3 shrink-0" />
    <span class="text-xs">{{ (beforeСategory as IParent).name }}</span>
  </div>
</template>
