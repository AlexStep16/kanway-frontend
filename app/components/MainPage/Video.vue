<script setup lang="ts">
import { onMounted } from 'vue'
import Plyr from 'plyr'
import 'plyr/dist/plyr.css'

onMounted(() => {
  new Plyr('#player', {
    controls: ['play-large', 'play', 'progress', 'current-time', 'fullscreen'],
    settings: [],
  })
})
</script>

<template>
  <div class="px-4 sm:px-6 lg:px-8">
    <div
      data-aos="zoom-out"
      data-aos-duration="1400"
      data-aos-anchor=".hero-text"
      class="my-4 md:my-10 mx-auto max-w-4xl z-1 p-4 md:p-8 bg-white/30 rounded-md relative"
    >
      <div class="video-container rounded-md overflow-hidden">
        <video id="player" controls>
          <source src="~/assets/demo.webm" type="video/webm" />
          <source src="~/assets/demo.mp4" type="video/mp4" />
          Ваш браузер не поддерживает видео.
        </video>
      </div>
    </div>
  </div>
</template>
