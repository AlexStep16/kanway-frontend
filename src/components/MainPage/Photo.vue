<script setup lang="ts">
import Blow from '@assets/blow.svg?component'
</script>

<template>
  <div class="px-4 sm:px-6 lg:px-8">
    <div
      data-aos="zoom-out"
      data-aos-duration="1400"
      data-aos-anchor=".hero-text"
      class="my-4 md:my-10 mx-auto max-w-4xl z-1 p-4 md:p-8 bg-white/30 rounded-md relative"
    >
      <div class="border relative z-2 border-gray-100 rounded-md overflow-hidden">
        <img class="w-full h-auto" src="@assets/chat.png" alt="Hero Image" />
      </div>
      <div class="size-full absolute z-1 -top-60 left-0 opacity-60">
        <Blow class="scale-[2.5]" />
      </div>
    </div>
  </div>
</template>
