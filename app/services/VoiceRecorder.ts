export interface VoiceRecorderResult {
  blob: Blob
  durationSeconds: number
}

const PREFERRED_MIME_TYPES = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4']

function getSupportedMimeType(): string | undefined {
  if (typeof MediaRecorder === 'undefined') return undefined

  return PREFERRED_MIME_TYPES.find((mimeType) => MediaRecorder.isTypeSupported(mimeType))
}

export class VoiceRecorder {
  private mediaRecorder: MediaRecorder | null = null
  private stream: MediaStream | null = null
  private chunks: Blob[] = []
  private startedAt = 0

  public get isSupported(): boolean {
    return typeof MediaRecorder !== 'undefined' && !!navigator.mediaDevices?.getUserMedia
  }

  public get isActive(): boolean {
    return this.mediaRecorder?.state === 'recording'
  }

  public async start(): Promise<void> {
    if (this.isActive) return

    this.stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    this.chunks = []

    const mimeType = getSupportedMimeType()

    this.mediaRecorder = new MediaRecorder(this.stream, mimeType ? { mimeType } : undefined)

    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) this.chunks.push(event.data)
    }

    this.startedAt = Date.now()
    this.mediaRecorder.start()
  }

  public stop(): Promise<VoiceRecorderResult> {
    return new Promise((resolve) => {
      const recorder = this.mediaRecorder

      if (!recorder || recorder.state === 'inactive') {
        resolve({ blob: new Blob(), durationSeconds: 0 })
        return
      }

      recorder.onstop = () => {
        const blob = new Blob(this.chunks, { type: recorder.mimeType || 'audio/webm' })
        const durationSeconds = Math.round((Date.now() - this.startedAt) / 1000)

        this.releaseStream()

        resolve({ blob, durationSeconds })
      }

      recorder.stop()
    })
  }

  public cancel(): void {
    const recorder = this.mediaRecorder

    if (recorder && recorder.state !== 'inactive') {
      recorder.onstop = null
      recorder.stop()
    }

    this.chunks = []
    this.releaseStream()
  }

  private releaseStream(): void {
    this.stream?.getTracks().forEach((track) => track.stop())
    this.stream = null
    this.mediaRecorder = null
  }
}
