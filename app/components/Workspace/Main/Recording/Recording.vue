<script setup lang="ts">
import { VoiceRecorder } from '~/services/VoiceRecorder'
import { computed, ref } from 'vue'
import { toast } from 'vue-sonner'

const MAX_RECORD_SECONDS = 120

const props = defineProps<{
  isDisabled?: boolean
}>()

const emit = defineEmits<{
  (e: 'sendMessage', message: string): void
}>()

const { data: user } = useUser()
const { mutate: transcribeVoice, isPending: isTranscribing } = useTranscribeVoice()

const recorder = new VoiceRecorder()

const isRecording = ref<boolean>(false)
const recordedSeconds = ref<number>(0)
const recordedBlob = ref<Blob | null>(null)
const timer = ref<ReturnType<typeof setInterval> | null>(null)

const hasRecording = computed(() => !!recordedBlob.value && !isRecording.value)

// Логика для анимации громкости
const audioContextForVolume = ref<AudioContext | null>(null)
const analyser = ref<AnalyserNode | null>(null)
const dataArray = ref<Uint8Array<ArrayBuffer>>()
const sourceForVolume = ref<MediaStreamAudioSourceNode | null>(null)
const getVolumeFrameId = ref<number>(0)
const volumeLevel = ref<number>(0)

function getVolume() {
  if (!analyser.value || !dataArray.value) return

  getVolumeFrameId.value = requestAnimationFrame(getVolume)

  analyser.value.getByteTimeDomainData(dataArray.value)

  let sum = 0
  for (let i = 0; i < dataArray.value.length; i++) {
    const amplitude = dataArray.value[i]! - 128
    sum += amplitude * amplitude
  }

  const rms = Math.sqrt(sum / dataArray.value.length)

  const noiseFloor = 1.5
  const cleanRms = Math.max(0, rms - noiseFloor)

  const sensitivity = 5

  volumeLevel.value = Math.min(100, cleanRms * sensitivity)
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

async function setupVolumeAnalyser() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

    audioContextForVolume.value = new AudioContext()
    analyser.value = audioContextForVolume.value.createAnalyser()
    analyser.value.fftSize = 256
    sourceForVolume.value = audioContextForVolume.value.createMediaStreamSource(stream)
    sourceForVolume.value.connect(analyser.value)
    const bufferLength = analyser.value.frequencyBinCount
    dataArray.value = new Uint8Array(bufferLength)
    getVolume()
  } catch {
    // Игнорируем ошибки визуализации громкости - запись голоса от этого не зависит
  }
}

const userCredits = computed(() => user.value?.credits ?? 0)
const userPaidCredits = computed(() => user.value?.paidCredits ?? 0)
const hasCredits = computed(() => userCredits.value > 0 || userPaidCredits.value > 0)

function formatDuration(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60

  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

function clearTimer() {
  if (timer.value) {
    clearInterval(timer.value)
    timer.value = null
  }
}

function toggleRecording() {
  if (isTranscribing.value) return

  if (isRecording.value) {
    stopRecording()
  } else {
    startRecording()
  }
}

async function startRecording() {
  if (props.isDisabled || !hasCredits.value || isRecording.value || !recorder.isSupported) return

  try {
    await recorder.start()
  } catch (error) {
    console.error('Ошибка доступа к микрофону:', error)
    toast.error('Не удалось получить доступ к микрофону')
    return
  }

  recordedBlob.value = null
  recordedSeconds.value = 0
  isRecording.value = true

  setupVolumeAnalyser()

  clearTimer()
  timer.value = setInterval(() => {
    recordedSeconds.value += 1

    if (recordedSeconds.value >= MAX_RECORD_SECONDS) {
      stopRecording()
    }
  }, 1000)
}

async function stopRecording() {
  if (!isRecording.value) return

  clearTimer()
  isRecording.value = false
  stopVolumeAnimation()

  const result = await recorder.stop()

  recordedBlob.value = result.blob
  recordedSeconds.value = result.durationSeconds

  try {
    transcribeVoice(recordedBlob.value, {
      onSuccess: (transcript) => {
        if (!transcript) {
          toast.error('Кажется, вы ничего не сказали. Попробуйте еще раз.')
          return
        }

        emit('sendMessage', transcript)
      },
    })
  } catch {
    toast.error('Не удалось распознать голосовое сообщение')
    return
  }
}

function clearRecording() {
  clearTimer()
  stopVolumeAnimation()

  if (isRecording.value) {
    recorder.cancel()
  }

  isRecording.value = false
  recordedBlob.value = null
  recordedSeconds.value = 0
}

function getRecordingBlob(): Blob | null {
  return recordedBlob.value
}

defineExpose({
  isRecording,
  isTranscribing,
  hasRecording,
  getRecordingBlob,
  clearRecording,
})
</script>
<template>
  <div class="relative flex items-center gap-x-4 z-20">
    <div
      class="flex items-center gap-x-2"
      v-if="isRecording"
    >
      <button
        type="button"
        @click="clearRecording"
        class="flex items-center gap-x-1 text-xs text-zinc-500 hover:text-red-500 transition-colors cursor-pointer"
        title="Отменить запись"
      >
        Отмена
      </button>
      <div class="text-center text-xs font-medium text-zinc-500 min-w-9">
        {{ formatDuration(recordedSeconds) }}
      </div>
    </div>

    <Microphone
      :volume-level="volumeLevel"
      :has-credits="hasCredits"
      :is-recording="isRecording"
      :is-transcribing="isTranscribing"
      @toggleRecording="toggleRecording"
    />
  </div>
</template>
