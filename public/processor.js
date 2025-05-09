class AudioProcessor extends AudioWorkletProcessor {
  process(inputs) {
    const input = inputs[0];
    if (input.length > 0 && input[0].length > 0) {
      const channelData = input[0];
      const int16Data = this.convertFloat32ToInt16(channelData);
      this.port.postMessage(int16Data.buffer);
    }
    return true;
  }

  convertFloat32ToInt16(float32Array) {
    const int16Array = new Int16Array(float32Array.length);
    for (let i = 0; i < float32Array.length; i++) {
      let sample = Math.max(-1, Math.min(1, float32Array[i]));
      int16Array[i] = Math.round(sample * 0x7FFF);
    }
    return int16Array;
  }
}

registerProcessor("audio-processor", AudioProcessor);


