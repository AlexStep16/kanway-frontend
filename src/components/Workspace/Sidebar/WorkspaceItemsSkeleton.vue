<script setup lang="ts">
function getRandomNumber() {
  const randomNumber = Math.floor(Math.random() * 4) + 1

  return randomNumber
}
</script>

<template>
  <ul class="p-1 space-y-1">
    <li
      v-for="n in getRandomNumber()"
      :key="n"
      class="w-full h-9 bg-gray-200 animate-pulse rounded-lg flex items-center p-2.5 gap-2"
    >
      <div class="size-5 rounded-sm bg-gray-300 animate-pulse"></div>
      <div class="h-4 rounded-sm bg-gray-300 animate-pulse w-[60%]"></div>
    </li>
  </ul>
</template>
