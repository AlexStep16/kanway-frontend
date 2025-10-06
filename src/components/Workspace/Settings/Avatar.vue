<script setup lang="ts">
defineProps<{
  size?: number
  cameraSize?: number
}>()
</script>

<template>
  <div class="rounded-full bg-gray-300 relative">
    <div
      class="shrink-0 size-full rounded-full"
      :style="{ backgroundImage: 'url(https://i.pravatar.cc/150?u=a042581f4e29026704d)' }"
      alt="Аватар"
      v-if="false"
    />

    <div
      class="shrink-0 size-full rounded-full text-4xl font-bold flex items-center justify-center text-white"
      :style="{ backgroundColor: 'green' }"
      alt="Аватар"
    >
      А
    </div>

    <div
      class="size-full flex items-center justify-center absolute cursor-pointer text-white inset-0 rounded-full bg-black outline-2 outline-transparent opacity-0 hover:opacity-70 hover:outline-blue-500 transition-all duration-100"
    >
      <slot></slot>
    </div>
  </div>
</template>
