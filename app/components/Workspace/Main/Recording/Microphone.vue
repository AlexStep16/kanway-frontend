<script setup lang="ts">
import { Mic, SendHorizontal } from '@lucide/vue'
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { cn } from '~/lib/utils'

const props = defineProps({
  volumeLevel: {
    type: Number,
    default: null,
  },
  hasCredits: {
    type: Boolean,
    default: true,
  },
  isRecording: {
    type: Boolean,
    default: false,
  },
  isTranscribing: {
    type: Boolean,
    default: false,
  },
})

const internalVolume = ref(10)
const targetVolume = computed(() =>
  props.volumeLevel !== null ? props.volumeLevel : internalVolume.value,
)

const smoothedVolume = ref(0)
const wave1Path = ref('')
const wave2Path = ref('')

let phase = 0
let animationFrameId: number | null = null

const LERP_FACTOR = 0.07

function generateSineCirclePath(
  cx: number,
  cy: number,
  baseRadius: number,
  amplitude: number,
  frequency: number,
  currentPhase: number,
  points = 100,
) {
  let path = ''
  for (let i = 0; i <= points; i++) {
    const angle = (i / points) * Math.PI * 2
    const r = baseRadius + Math.sin(angle * frequency + currentPhase) * amplitude
    const x = cx + r * Math.cos(angle)
    const y = cy + r * Math.sin(angle)

    if (i === 0) {
      path += `M ${x.toFixed(2)} ${y.toFixed(2)}`
    } else {
      path += ` L ${x.toFixed(2)} ${y.toFixed(2)}`
    }
  }
  return path + ' Z'
}

const animate = () => {
  const target = Math.max(0, Math.min(100, targetVolume.value))

  smoothedVolume.value += (target - smoothedVolume.value) * LERP_FACTOR
  const norm = smoothedVolume.value / 100

  phase += 0.045

  const r1 = 34 + norm * 8
  const amp1 = 2 + norm * 7
  wave1Path.value = generateSineCirclePath(100, 100, r1, amp1, 6, phase)

  const r2 = 50 + norm * 14
  const amp2 = 2.5 + norm * 9
  wave2Path.value = generateSineCirclePath(100, 100, r2, amp2, 9, -phase * 0.8)

  animationFrameId = requestAnimationFrame(animate)
}

onMounted(() => {
  animationFrameId = requestAnimationFrame(animate)
})

onUnmounted(() => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }
})

const normalized = computed(() => smoothedVolume.value / 100)

const wave1Style = computed(() => ({
  transform: `scale(${(1 + normalized.value * 0.35).toFixed(3)})`,
  opacity: (0.5 + normalized.value * 0.5).toFixed(3),
}))

const wave2Style = computed(() => ({
  transform: `scale(${(1 + normalized.value * 0.55).toFixed(3)})`,
  opacity: (0.4 + normalized.value * 0.6).toFixed(3),
}))
</script>

<style scoped>
@keyframes morph-1 {
  0% {
    border-radius: 50% 50% 30% 70% / 60% 40% 60% 40%;
    transform: rotate(0deg);
  }
  50% {
    border-radius: 30% 70% 70% 30% / 40% 60% 40% 60%;
  }
  100% {
    border-radius: 50% 50% 30% 70% / 60% 40% 60% 40%;
    transform: rotate(360deg);
  }
}

@keyframes morph-2 {
  0% {
    border-radius: 60% 40% 30% 70% / 50% 60% 40% 50%;
    transform: rotate(360deg);
  }
  50% {
    border-radius: 40% 60% 70% 30% / 60% 30% 70% 40%;
  }
  100% {
    border-radius: 60% 40% 30% 70% / 50% 60% 40% 50%;
    transform: rotate(0deg);
  }
}

@keyframes morph-3 {
  0% {
    border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%;
    transform: rotate(0deg);
  }
  50% {
    border-radius: 70% 30% 40% 60% / 50% 70% 30% 60%;
  }
  100% {
    border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%;
    transform: rotate(360deg);
  }
}

.animate-morph-1 {
  animation: morph-1 5s ease-in-out infinite;
}

.animate-morph-2 {
  animation: morph-2 8s ease-in-out infinite;
}

.animate-morph-3 {
  animation: morph-3 12s ease-in-out infinite;
}
</style>

<template>
  <div class="relative flex items-center justify-center">
    <template v-if="isRecording">
      <div
        class="absolute size-13 pointer-events-none transition-transform duration-75 ease-out"
        :style="wave2Style"
      >
        <div
          class="w-full h-full rounded-[60%_40%_30%_70%/50%_60%_40%_50%] border border-indigo-400/50 bg-linear-to-br from-cyan-400/20 via-indigo-500/20 to-violet-500/15 animate-morph-2"
        ></div>
      </div>

      <div
        class="absolute size-10 pointer-events-none transition-transform duration-75 ease-out"
        :style="wave1Style"
      >
        <div
          class="w-full h-full rounded-[50%_50%_30%_70%/60%_40%_60%_40%] border border-indigo-500/60 bg-linear-to-tr from-indigo-600/25 via-sky-500/20 to-blue-500/25 animate-morph-1"
        ></div>
      </div>
    </template>

    <button
      type="button"
      @click="$emit('toggleRecording')"
      :class="
        cn(
          'relative flex items-center justify-center size-8 rounded-full text-zinc-500 hover:text-zinc-800 transition-colors hover:bg-zinc-100 cursor-pointer',
          !hasCredits && 'cursor-not-allowed opacity-40 hover:bg-transparent',
          isRecording && 'bg-primary/75 text-white hover:bg-primary/20',
        )
      "
      title="Голосовой ввод"
    >
      <Spinner
        v-if="isTranscribing"
        class="size-4.5"
      />
      <Mic
        class="size-4.5"
        v-else-if="!isRecording"
      />
      <SendHorizontal
        class="size-4.5"
        v-else
      />
    </button>
  </div>
</template>
