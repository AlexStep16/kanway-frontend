import { defineStore } from 'pinia'
import { ref } from 'vue'
import { io, Socket } from 'socket.io-client'
import workletRawUrl from '../../audio-worklet.js?url'

export const useTranscriptStore = defineStore('transcript', () => {
  const socket = ref<Socket | null>(null)
  const audioContext = ref<AudioContext | null>(null)
  const workletNode = ref<AudioWorkletNode | null>(null)
  const mediaStreamSource = ref<MediaStreamAudioSourceNode | null>(null)
  const mediaStream = ref<MediaStream | null>(null)

  const isConnecting = ref<boolean>(false)
  const isConnected = ref<boolean>(false)
  const isRecording = ref<boolean>(false)
  const isTranscribing = ref<boolean>(false)
  const speechStartedTime = ref<number>(0)
  const speechEndedTime = ref<number>(0)
  const endSpeechTimeout = ref<NodeJS.Timeout | null>(null)

  const SILENCE_THRESHOLD = 2000

  const transcriptionDelta = ref<string>('')
  const transcriptionCompleted = ref<string>('')

  function initialize() {
    if (isConnected.value || isConnecting.value) return

    isConnecting.value = true

    const runtimeConfig = useRuntimeConfig()

    const serverUrl = (runtimeConfig.public.serverBaseUrl as string) || 'http://localhost:3333'

    const newSocket = io(serverUrl, {
      withCredentials: true,
    })

    newSocket.on('connect', () => {
      isConnecting.value = false
      isConnected.value = true
      socket.value = newSocket
    })

    newSocket.on('openai-response', (data) => {
      if (data.type === 'input_audio_buffer.committed') {
        isTranscribing.value = true
      }
      if (data.type === 'input_audio_buffer.speech_started') {
        speechStartedTime.value = Date.now()
        speechEndedTime.value = 0

        if (endSpeechTimeout.value) {
          clearTimeout(endSpeechTimeout.value)
        }
      }
      if (data.type === 'input_audio_buffer.speech_ended') {
        speechEndedTime.value = Date.now()
        setEndSpeechTimeout()
      }
      if (data.type === 'conversation.item.input_audio_transcription.delta') {
        transcriptionDelta.value = data.delta
      }
      if (data.type === 'conversation.item.input_audio_transcription.completed') {
        isTranscribing.value = false
        transcriptionCompleted.value = data.transcript
        resetSpeechTimes()
      }
    })

    newSocket.on('connect_error', (error) => {
      console.error('Ошибка подключения к серверу:', error)
      isConnecting.value = false
      isConnected.value = false
      resetSpeechTimes()
    })

    newSocket.on('recording-stopped-by-server', () => {
      stopRecording()

      if (newSocket?.connected) {
        newSocket.emit('commit-audio')
      }
    })

    newSocket.on('disconnect', () => {
      isConnected.value = false
      isConnecting.value = false
      socket.value = null
    })
  }

  function setEndSpeechTimeout() {
    if (endSpeechTimeout.value) {
      clearTimeout(endSpeechTimeout.value)
    }

    endSpeechTimeout.value = setTimeout(() => {
      stopRecording()
    }, SILENCE_THRESHOLD)
  }

  function resetSpeechTimes() {
    speechStartedTime.value = 0
    speechEndedTime.value = 0
  }

  async function startRecording(stream: MediaStream) {
    if (!isConnected.value || isRecording.value) return

    isRecording.value = true
    mediaStream.value = stream

    transcriptionDelta.value = ''
    transcriptionCompleted.value = ''

    resetSpeechTimes()

    audioContext.value = new AudioContext({ sampleRate: 24000 })
    await audioContext.value.audioWorklet.addModule(workletRawUrl)

    mediaStreamSource.value = audioContext.value.createMediaStreamSource(stream)

    const workletOptions = {
      processorOptions: {
        bufferSize: 2048,
      },
    }

    workletNode.value = new AudioWorkletNode(
      audioContext.value,
      'audio-streamer-processor',
      workletOptions,
    )

    workletNode.value.port.onmessage = (event) => {
      const pcmBuffer: ArrayBuffer = event.data

      if (socket.value?.connected) {
        socket.value.emit('audio-chunk', pcmBuffer)
      }
    }

    mediaStreamSource.value.connect(workletNode.value)
    workletNode.value.connect(audioContext.value.destination)
  }

  function stopRecording() {
    if (!isRecording.value) return

    isRecording.value = false

    if (workletNode.value) {
      workletNode.value.port.postMessage({ command: 'flush' })
    }

    if (socket.value?.connected) {
      socket.value.emit('commit-audio')
    }

    setTimeout(() => {
      if (mediaStreamSource.value && workletNode.value) {
        mediaStreamSource.value.disconnect(workletNode.value)
      }
      if (workletNode.value && audioContext.value) {
        workletNode.value.disconnect(audioContext.value.destination)
      }

      workletNode.value?.port.close()
      audioContext.value?.close().catch((e) => console.error('Error closing AudioContext:', e))
      mediaStream.value?.getTracks().forEach((track) => track.stop())

      audioContext.value = null
      workletNode.value = null
      mediaStreamSource.value = null
      mediaStream.value = null
    }, 200)

    resetSpeechTimes()

    clearTimeout(endSpeechTimeout.value!)
    endSpeechTimeout.value = null
  }

  return {
    isConnected,
    isConnecting,
    isTranscribing,
    isRecording,
    transcriptionDelta,
    transcriptionCompleted,
    speechStartedTime,
    speechEndedTime,

    initialize,
    startRecording,
    stopRecording,
  }
})
