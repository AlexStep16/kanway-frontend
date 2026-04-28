<script setup lang="ts">
import Spinner from '@components/Loader/Spinner.vue'
import Button from '../ui/button/Button.vue'

defineProps<{
  isProcessing?: boolean
  text: string
}>()
</script>

<template>
  <Button variant="default" size="lg" :disabled="isProcessing">
    <Spinner class="size-4 absolute" v-if="isProcessing" />
    <span :class="{ 'opacity-0': isProcessing }">{{ text }}</span>
  </Button>
</template>
