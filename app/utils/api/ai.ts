import type { TranscribeVoiceResponse } from '~/interfaces/TranscribeVoiceResponse'

export async function transcribeVoiceApi(audioBlob: Blob, signal?: AbortSignal) {
  const formData = new FormData()

  const extension = audioBlob.type.includes('mp4') ? 'm4a' : 'webm'

  formData.append('audio', audioBlob, `voice.${extension}`)

  return await apiCall<TranscribeVoiceResponse>({
    method: 'POST',
    url: '/ai/transcribe',
    data: formData,
    signal,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}
