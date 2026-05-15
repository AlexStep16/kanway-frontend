<script setup lang="ts">
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
