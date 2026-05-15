<script setup lang="ts">
function getRandomNumber() {
  const randomNumber = Math.floor(Math.random() * 4) + 1

  return randomNumber
}
</script>

<template>
  <ul class="my-1 relative ps-2.5 space-y-1">
    <li
      v-for="n in getRandomNumber()"
      :key="n"
      class="animate-pulse w-full h-9 bg-gray-300 rounded-lg"
    ></li>
  </ul>
</template>
