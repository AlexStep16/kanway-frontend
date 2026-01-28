class AudioStreamerProcessor extends AudioWorkletProcessor {
  constructor(options) {
    super()
    this._bufferSize = options.processorOptions?.bufferSize || 4096
    this._buffer = new Float32Array(this._bufferSize)
    this._offset = 0

    this.port.onmessage = (event) => {
      if (event.data.command === 'flush') {
        this.flush()
      }
    }
  }

  flush() {
    if (this._offset > 0) {
      this.port.postMessage(this._buffer.slice(0, this._offset))
      this._offset = 0
    }
  }

  process(inputs) {
    const inputChannel = inputs[0][0]
    if (!inputChannel) {
      return true
    }
    if (this._offset + inputChannel.length >= this._bufferSize) {
      const remainingSpace = this._bufferSize - this._offset
      const firstPart = inputChannel.subarray(0, remainingSpace)
      const secondPart = inputChannel.subarray(remainingSpace)
      this._buffer.set(firstPart, this._offset)
      this.port.postMessage(this._buffer)
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
