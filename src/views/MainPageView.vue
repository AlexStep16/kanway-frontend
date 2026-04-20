<script setup lang="ts">
import { onMounted, ref, shallowRef } from 'vue'

import AOS from 'aos'
import Header from '@components/MainPage/Header.vue'
import Hero from '@components/MainPage/Hero.vue'
import Video from '@components/MainPage/Video.vue'
import Problem from '@components/MainPage/Problem.vue'
import CommandCenter from '@components/MainPage/CommandCenter.vue'
import Control from '@components/MainPage/Control/Control.vue'
import Prices from '@components/MainPage/Prices.vue'
import FAQ from '@components/MainPage/FAQ.vue'
import Ready from '@components/MainPage/Ready.vue'
import Footer from '@components/MainPage/Footer.vue'
import Plan from '@components/MainPage/Control/Chat/Plan.vue'
import { ITaskState } from '@/stores/interfaces/ITaskState'
import { HSStaticMethods } from 'preline'

const activeTab = shallowRef<typeof Plan>(Plan)

const tasks = ref<(ITaskState & { isSelected: boolean })[]>([])

function updateCircle() {
  const circle = document.getElementById('blue-circle')
  const textOverlay = document.getElementById('white-text-overlay')
  if (!circle || !textOverlay) return

  const textRect = textOverlay.getBoundingClientRect()
  const circleRect = circle.getBoundingClientRect()
  const textLeftX = textRect.left
  const textBottomY = textOverlay.offsetTop

  if (window.innerWidth <= 768) {
    if (window.innerWidth <= 500) {
      circle.style.top = `${textBottomY + 450}px`
    } else {
      circle.style.top = `${textBottomY + 350}px`
    }
    circle.style.left = `calc(50% - ${circleRect.width / 2}px)`
  } else {
    circle.style.top = `-40px`
    circle.style.left = `${textLeftX}px`
  }
}

function updateClip() {
  const textOverlay = document.getElementById('white-text-overlay')
  const hOverlay = document.getElementById('white-h-overlay')
  const circle = document.getElementById('blue-circle')

  if (!textOverlay || !circle || !hOverlay) return

  const textRect = textOverlay.getBoundingClientRect()
  const hRect = hOverlay.getBoundingClientRect()
  const circleRect = circle.getBoundingClientRect()

  const circleCenterX = circleRect.left + circleRect.width / 2
  const circleCenterY = circleRect.top + circleRect.height / 2
  const circleRadius = circleRect.width / 2

  const relativeTextX = circleCenterX - textRect.left
  const relativeTextY = circleCenterY - textRect.top

  const relativeHOverlayX = circleCenterX - hRect.left
  const relativeHOverlayY = circleCenterY - hRect.top

  const clipPathHValue = `circle(${circleRadius}px at ${relativeHOverlayX}px ${relativeHOverlayY}px)`
  const clipPathValue = `circle(${circleRadius}px at ${relativeTextX}px ${relativeTextY}px)`

  textOverlay.style.clipPath = clipPathValue
  hOverlay.style.clipPath = clipPathHValue
  ;(textOverlay.style as any).webkitClipPath = clipPathValue
  ;(hOverlay.style as any).webkitClipPath = clipPathHValue
}

onMounted(() => {
  HSStaticMethods.autoInit()

  AOS.init()

  updateCircle()
  updateClip()

  window.addEventListener('scroll', updateClip)
  window.addEventListener('scroll', updateCircle)
  window.addEventListener('resize', updateClip)
  window.addEventListener('resize', updateCircle)
})
</script>

<template>
  <div class="flex flex-col min-h-screen w-full bg-white">
    <div class="flex flex-col relative h-full overflow-hidden">
      <Header />
      <Hero />
      <Video />

      <div
        class="w-full min-h-140 sm:min-h-200 md:min-h-260 absolute z-0 bottom-0 bg-[linear-gradient(180deg,rgba(122,90,248,0)0%,#5a8bf8_100%)]"
      ></div>
    </div>

    <Problem />
    <CommandCenter />

    <Control v-model:activeTab="activeTab" :tasks />

    <Prices />

    <FAQ />
    <Ready />

    <Footer />
  </div>
</template>
