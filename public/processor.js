class AudioProcessor extends AudioWorkletProcessor {
  process(inputs) {
    const input = inputs[0];
    if (input.length > 0) {
      const channelData = input[0]; // داده‌های کانال اول
      const int16Data = this.convertFloat32ToInt16(channelData);
      this.port.postMessage(int16Data.buffer); // ارسال داده‌ها به AudioWorkletNode به شکل buffer
    }
    return true; // ادامه پردازش
  }

  // تبدیل Float32Array به Int16Array
  convertFloat32ToInt16(float32Array) {
    const int16Array = new Int16Array(float32Array.length);
    for (let i = 0; i < float32Array.length; i++) {
      let sample = Math.max(-1, Math.min(1, float32Array[i])); // محدود کردن مقدار
      int16Array[i] = sample * 0x7FFF; // تبدیل به Int16
    }
    return int16Array;
  }
}

registerProcessor("audio-processor", AudioProcessor);

