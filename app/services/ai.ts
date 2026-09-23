export async function transcribeVoice(audioBlob: Blob, signal?: AbortSignal) {
  const result = await transcribeVoiceApi(audioBlob, signal)

  return result.transcript
}
