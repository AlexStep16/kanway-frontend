<script setup lang="ts">
import Chat from './Chat/Chat.vue'
</script>
<template>
  <div class="size-full flex items-center justify-center relative">
    <Chat :is-main-chat="true" />
  </div>
</template>
