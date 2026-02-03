<script setup lang="ts">
import { useTranscriptStore } from '@/stores/transcript'
import { computed, onMounted, ref, watch } from 'vue'
import { Mic } from 'lucide-vue-next'
import Spinner from '@components/Loader/Spinner.vue'

const emit = defineEmits<{
  (e: 'deltaAdd', payload: string): void
  (e: 'transcriptionCompleted', payload: string): void
  (e: 'clearInput'): void
}>()
const props = defineProps<{
  isChat?: boolean
  isWorkspace?: boolean
  isDisabled?: boolean
}>()

// Логика для анимации громкости (остается без изменений)
const audioContextForVolume = ref<AudioContext | null>(null)
const analyser = ref<AnalyserNode | null>(null)
const dataArray = ref<Uint8Array<ArrayBuffer>>()
const sourceForVolume = ref<MediaStreamAudioSourceNode | null>(null)
const getVolumeFrameId = ref<number>(0)
const volumeLevel = ref<number>(0)

const transcriptStore = useTranscriptStore()

function getVolume() {
  if (!analyser.value || !dataArray.value) return

  getVolumeFrameId.value = requestAnimationFrame(getVolume)

  analyser.value.getByteTimeDomainData(dataArray.value)

  let sum = 0
  for (let i = 0; i < dataArray.value.length; i++) {
    const amplitude = dataArray.value[i] - 128
    sum += amplitude * amplitude
  }

  const volume = Math.sqrt(sum / dataArray.value.length)

  volumeLevel.value = volume
}

function stopVolumeAnimation() {
  if (getVolumeFrameId.value) {
    cancelAnimationFrame(getVolumeFrameId.value)
  }
  sourceForVolume.value?.disconnect()
  audioContextForVolume.value?.close()
  analyser.value = null
  sourceForVolume.value = null
  audioContextForVolume.value = null
}

async function setupVolumeAnalyser(stream: MediaStream) {
  audioContextForVolume.value = new (window.AudioContext || (window as any).webkitAudioContext)()
  analyser.value = audioContextForVolume.value.createAnalyser()
  analyser.value.fftSize = 256
  sourceForVolume.value = audioContextForVolume.value.createMediaStreamSource(stream)
  sourceForVolume.value.connect(analyser.value)
  const bufferLength = analyser.value.frequencyBinCount
  dataArray.value = new Uint8Array(bufferLength)
  getVolume()
}

function stopRecording() {
  transcriptStore.stopRecording()
  stopVolumeAnimation()
}

async function toggleRecording() {
  if (props.isDisabled) return

  if (transcriptStore.isRecording) {
    stopRecording()
  } else {
    if (!transcriptStore.isConnected) {
      return
    }

    transcriptStore.activeListener = props.isChat ? 'CHAT' : 'WORKSPACE'
    emit('clearInput')

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { channelCount: 1, sampleRate: 16000, echoCancellation: true },
      })

      setupVolumeAnalyser(stream)
      transcriptStore.startRecording(stream)

      setTimeout(() => {
        if (transcriptStore.isRecording && transcriptStore.transcriptionDelta === '') {
          stopRecording()
        }
      }, 4000)
    } catch (err) {
      console.error('Ошибка доступа к микрофону:', err)
    }
  }
}

const getIsMicrophoneActive = computed(() => {
  if (!transcriptStore.isRecording) return false
  if (props.isChat && transcriptStore.activeListener === 'CHAT') return true
  if (props.isWorkspace && transcriptStore.activeListener === 'WORKSPACE') return true
  if (!props.isChat && !props.isWorkspace) return true
  return false
})

const getIsMicrophoneInit = computed(() => {
  if (transcriptStore.isConnecting) return true
  if (!transcriptStore.isTranscribing) return false

  if (props.isChat && transcriptStore.activeListener === 'CHAT') return true
  if (props.isWorkspace && transcriptStore.activeListener === 'WORKSPACE') return true
  if (!props.isChat && !props.isWorkspace) return true

  return false
})

const currentListener = computed(() => {
  if (props.isChat) return 'CHAT'
  if (props.isWorkspace) return 'WORKSPACE'
  return null
})

watch(
  () => transcriptStore.transcriptionDelta,
  (newText) => {
    if (newText && transcriptStore.activeListener === currentListener.value) {
      emit('deltaAdd', newText)
    }
  },
)

watch(
  () => transcriptStore.transcriptionCompleted,
  (finalText) => {
    if (finalText && transcriptStore.activeListener === currentListener.value) {
      emit('transcriptionCompleted', finalText)
    }
  },
)

const isSpeaking = computed(() => {
  return getIsMicrophoneActive.value && volumeLevel.value > 5
})

onMounted(() => {
  transcriptStore.initialize()
})
</script>
<template>
  <div class="relative flex items-center justify-center z-20">
    <template v-if="getIsMicrophoneActive">
      <div
        class="absolute size-10 bg-red-600 opacity-40 rounded-full transition-transform duration-200 ease-out"
        :class="{
          'scale-130': isSpeaking,
          'scale-100': isSpeaking,
        }"
      ></div>

      <div
        class="absolute size-8 bg-red-500 opacity-40 rounded-full transition-transform duration-200 ease-out"
      ></div>
    </template>

    <button
      type="button"
      @click="toggleRecording"
      class="flex items-center justify-center z-2 size-8 rounded-md text-gray-500 transition-colors"
      :class="{
        'text-white!': getIsMicrophoneActive,
        'hover:bg-gray-100': !getIsMicrophoneActive,
      }"
      title="Голосовой ввод"
      v-if="!getIsMicrophoneInit"
    >
      <Mic class="size-4.5" />
    </button>

    <div class="flex items-center justify-center z-2 size-8 text-gray-500" v-else>
      <Spinner class="size-4.5" />
    </div>
  </div>
</template>
