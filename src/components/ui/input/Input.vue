<script setup lang="ts">
import { nextTick, onMounted, type HTMLAttributes, ref } from 'vue'
import { useVModel } from '@vueuse/core'
import { cn } from '@/lib/utils'
import { InputVariants, inputVariants } from '.'

const props = defineProps<{
  defaultValue?: string | number
  modelValue?: string | number
  variant?: InputVariants['variant']
  class?: HTMLAttributes['class']
  isFocused?: boolean
}>()

const emits = defineEmits<{
  (e: 'update:modelValue', payload: string | number): void
}>()

const inputRef = ref<HTMLInputElement | null>(null)

const modelValue = useVModel(props, 'modelValue', emits, {
  passive: true,
  defaultValue: props.defaultValue,
})

onMounted(() => {
  if (props.isFocused) {
    nextTick(() => {
      if (inputRef.value) inputRef.value.focus()
    })
  }
})

defineExpose({
  inputRef,
})
</script>

<template>
  <input ref="inputRef" v-model="modelValue" :class="cn(inputVariants({ variant }), props.class)" />
</template>
