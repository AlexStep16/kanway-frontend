import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useTranscriptStore = defineStore('transcript', () => {
  const socket = ref<WebSocket | null>(null)
  const audioContext = ref<AudioContext | null>(null)
  const workletNode = ref<AudioWorkletNode | null>(null)
  const mediaStreamSource = ref<MediaStreamAudioSourceNode | null>(null)
  const mediaStream = ref<MediaStream | null>(null)

  const isConnecting = ref<boolean>(false)
  const isConnected = ref<boolean>(false)
  const isRecording = ref<boolean>(false)
  const isTranscribing = ref<boolean>(false)

  const transcriptionDelta = ref<string>('')
  const transcriptionCompleted = ref<string>('')

  const activeListener = ref<'WORKSPACE' | 'CHAT' | null>(null)

  function initialize() {
    if (isConnected.value || isConnecting.value) return

    isConnecting.value = true
    const proxyUrl = 'ws://localhost:8080'
    const newSocket = new WebSocket(proxyUrl)

    newSocket.onopen = () => {
      isConnecting.value = false
      isConnected.value = true
      socket.value = newSocket
    }

    newSocket.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (data.type === 'input_audio_buffer.committed') {
        isTranscribing.value = true
        stopRecording()
      }
      if (data.type === 'conversation.item.input_audio_transcription.delta')
        transcriptionDelta.value = data.delta
      if (data.type === 'conversation.item.input_audio_transcription.completed') {
        isTranscribing.value = false
        transcriptionCompleted.value = data.transcript
      }
    }

    newSocket.onerror = (error) => {
      console.error('Ошибка WebSocket:', error)
      isConnecting.value = false
      isConnected.value = false
    }

    newSocket.onclose = (e) => {
      isConnected.value = false
      isConnecting.value = false
      socket.value = null

      if (e.code === 1001) {
        initialize()
      }
    }
  }

  async function startRecording(stream: MediaStream) {
    if (!isConnected.value || isRecording.value) return

    isRecording.value = true
    mediaStream.value = stream

    transcriptionDelta.value = ''
    transcriptionCompleted.value = ''

    audioContext.value = new AudioContext({ sampleRate: 16000 })
    await audioContext.value.audioWorklet.addModule('/audio-worklet.js')

    mediaStreamSource.value = audioContext.value.createMediaStreamSource(stream)

    const workletOptions = {
      processorOptions: {
        bufferSize: 4000,
      },
    }

    workletNode.value = new AudioWorkletNode(
      audioContext.value,
      'audio-streamer-processor',
      workletOptions,
    )

    workletNode.value.port.onmessage = (event) => {
      const audioData: Float32Array = event.data
      if (socket.value?.readyState === WebSocket.OPEN) {
        socket.value.send(audioData.buffer)
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

    if (socket.value?.readyState === WebSocket.OPEN) {
      socket.value.send(JSON.stringify({ action: 'commit' }))
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
  }

  return {
    isConnected,
    isConnecting,
    isTranscribing,
    isRecording,
    activeListener,
    transcriptionDelta,
    transcriptionCompleted,

    initialize,
    startRecording,
    stopRecording,
  }
})
