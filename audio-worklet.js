// audio-worklet.js
class AudioStreamerProcessor extends AudioWorkletProcessor {
  constructor(options) {
    super()
    this._bufferSize = options.processorOptions?.bufferSize || 2048
    this._buffer = new Float32Array(this._bufferSize)
    this._offset = 0
  }

  floatTo16BitPCM(float32Array) {
    const pcm16 = new Int16Array(float32Array.length)
    for (let i = 0; i < float32Array.length; i++) {
      const s = Math.max(-1, Math.min(1, float32Array[i]))
      pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7fff
    }
    return pcm16.buffer
  }

  flush() {
    if (this._offset > 0) {
      const pcmData = this.floatTo16BitPCM(this._buffer.subarray(0, this._offset))
      this.port.postMessage(pcmData, [pcmData])
      this._offset = 0
    }
  }

  process(inputs) {
    const inputChannel = inputs[0][0]
    if (!inputChannel) return true

    if (this._offset + inputChannel.length >= this._bufferSize) {
      const remainingSpace = this._bufferSize - this._offset
      this._buffer.set(inputChannel.subarray(0, remainingSpace), this._offset)

      const pcmData = this.floatTo16BitPCM(this._buffer)
      this.port.postMessage(pcmData, [pcmData])

      const secondPart = inputChannel.subarray(remainingSpace)
      this._buffer.set(secondPart, 0)
      this._offset = secondPart.length
    } else {
      this._buffer.set(inputChannel, this._offset)
      this._offset += inputChannel.length
    }
    return true
  }
}

registerProcessor('audio-streamer-processor', AudioStreamerProcessor)
