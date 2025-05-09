import React, { useRef, useState, useEffect } from "react";
import { socket } from "../socket/socketconfig";
import { Clock, Microphone2, MicrophoneSlash, User } from "iconsax-reactjs";
import { useUser } from "../UserContext";
import AudioPlayer from "./Voice";

const AudioStreamer = () => {
  const [transcription, setTranscription] = useState("");
  const [transcripted, setTranscripted] = useState("");
  const [recordingStat, setRecordingStat] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [audioAddress, setAudioAddress] = useState("");
  const [timer, setTimer] = useState(0);
  const { username: contextUsername } = useUser();
  const [username, setUsername] = useState(contextUsername || "");

  const audioContextRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const socketRef = useRef(null);
  const bufferRef = useRef([]);
  const clientAudioBufferRef = useRef([]); // 🔹 بافر جدا برای نسخه کلاینت
  const canvasRef = useRef(null);
  const workletNodeRef = useRef(null);
  const timerRef = useRef(null);

  const startRecording = async () => {
    try {
      setTranscripted("");
      socketRef.current = socket;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const audioContext = new AudioContext({ sampleRate: 16000 });
      audioContextRef.current = audioContext;

      await audioContext.audioWorklet.addModule("processor.js");
      const source = audioContext.createMediaStreamSource(stream);
      const workletNode = new AudioWorkletNode(audioContext, "audio-processor");
      workletNodeRef.current = workletNode;

      workletNode.port.onmessage = (event) => {
        const int16Data = new Int16Array(event.data);

        const normalizedData = int16Data.map((n) =>
          Math.max(0, Math.min(255, Math.floor((n + 32768) / 256)))
        );
        drawWaveform(normalizedData);

        bufferRef.current.push(...int16Data);
        clientAudioBufferRef.current.push(...int16Data); // 🔹 ذخیره برای نسخه کلاینت

        if (bufferRef.current.length >= 1024 * 16) {
          const chunk = bufferRef.current.slice(0, 1024 * 16);
          bufferRef.current = bufferRef.current.slice(1024 * 16);
          const int16Chunk = new Int16Array(chunk);
          socket.emit("audio_chunk", int16Chunk.buffer, "15");
        }
      };

      source.connect(workletNode).connect(audioContext.destination);
      setIsRecording(true);

      setTimer(0);
      timerRef.current = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("Error accessing microphone:", err);
    }
  };

  const stopRecording = () => {
    try {
      socket.emit("audio_chunk", "<stop>", "15");

      setRecordingStat(1);
      setTranscripted((prev) => prev + " " + transcription);

      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }

      if (audioContextRef.current) {
        audioContextRef.current.close();
      }

      if (workletNodeRef.current) {
        workletNodeRef.current.port.onmessage = null;
      }

      clearInterval(timerRef.current);

      const clientWavBlob = encodeWAV(Int16Array.from(clientAudioBufferRef.current));
      const clientUrl = URL.createObjectURL(clientWavBlob);
      setAudioAddress(clientUrl); // 🔹 آدرس نسخه کلاینت

      setTranscription("");
      setIsRecording(false);
      bufferRef.current = [];
      clientAudioBufferRef.current = [];
    } catch (error) {
      console.error("❌ خطا هنگام توقف ضبط:", error);
    }
  };

  useEffect(() => {
    socketRef.current = socket;

    socket.on("transcription", (data) => {
      if (data?.text) {
        setTranscription(data.text + " ");
      }
    });

    socket.on("addtranscription", (data) => {
      if (data?.text) {
        setTranscripted((prev) => prev + " " + data.text + " ");
        setTranscription("");
      }
    });

    const defaultWaveform = new Array(256).fill(0).map(() => Math.random() * 255);
    drawWaveform(defaultWaveform);
  }, []);

  const drawWaveform = (dataArray = []) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    const gradient = ctx.createLinearGradient(0, 0, width, 0);
    gradient.addColorStop(0, "#00e0ff");
    gradient.addColorStop(0.5, "#00ff66");
    gradient.addColorStop(1, "#00aaff");

    ctx.beginPath();
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 3;

    const sliceWidth = width / dataArray.length;
    let x = 0;

    for (let i = 0; i < dataArray.length; i++) {
      const v = dataArray[i] / 255;
      const y = (1 - v) * height * 0.5 + height * 0.25;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
      x += sliceWidth;
    }

    ctx.stroke();

    const endY =
      (1 - dataArray[dataArray.length - 1] / 255) * height * 0.5 + height * 0.25;
    ctx.beginPath();
    ctx.arc(width - 5, endY, 4, 0, 2 * Math.PI);
    ctx.fillStyle = "#00ffff";
    ctx.fill();
  };

  const encodeWAV = (samples, sampleRate = 16000) => {
    const buffer = new ArrayBuffer(44 + samples.length * 2);
    const view = new DataView(buffer);

    const writeString = (view, offset, string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };

    writeString(view, 0, "RIFF");
    view.setUint32(4, 36 + samples.length * 2, true);
    writeString(view, 8, "WAVE");
    writeString(view, 12, "fmt ");
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeString(view, 36, "data");
    view.setUint32(40, samples.length * 2, true);

    for (let i = 0; i < samples.length; i++) {
      view.setInt16(44 + i * 2, samples[i], true);
    }

    return new Blob([view], { type: "audio/wav" });
  };

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
  };

  useEffect(() => {
    if (!contextUsername) {
      const storedUsername = sessionStorage.getItem("username");
      if (storedUsername) {
        setUsername(storedUsername);
      }
    }
  }, [contextUsername]);

  return (
    <div className="bg-white bg-opacity-80 rounded-lg w-full h-[600px] shadow-lg flex flex-col items-center justify-center px-5">
      <div className="mb-4 flex w-full gap-[20px] items-center justify-end">
        <div className="flex gap-2 self-start">
          <p className="text-blue-700 font-bold">{username || "نام وجود ندارد"}</p>
          <User />
        </div>
      </div>

      <div className="p-4 flex items-center justify-center gap-4">
        <div onClick={startRecording}>
          {isRecording ? (
            <div className="flex flex-col items-center justify-center bg-blue-500 rounded-full w-[80px] h-[80px] gap-1">
              <Microphone2 size={50} className="text-white " />
            </div>
          ) : (
            <div className="flex flex-col bg-blue-500 rounded-full w-[80px] h-[80px] items-center justify-center gap-1 cursor-pointer">
              <MicrophoneSlash size={50} className="text-white" />
            </div>
          )}
        </div>

        <div className="text-center">
          <canvas ref={canvasRef} width={500} height={80} />
        </div>
      </div>

      <div className="flex items-center w-full px-5 justify-between h-[60px]">
        <div className="mt-3 w-[80px] h-[40px] rounded-lg shadow-lg bg-red-600 text-white flex items-center justify-center gap-1">
          <Clock />
          <h3>{formatTime(timer)}</h3>
        </div>

        {isRecording && (
          <div onClick={stopRecording} className="cursor-pointer text-red-600 font-bold">
            پایان ضبط
          </div>
        )}
      </div>

      <textarea
        rows={5}
        value={transcripted + transcription}
        onChange={(e) => setTranscripted(e.target.value)}
        className="mt-4 w-full h-[200px] p-2 border rounded-lg shadow-lg bg-blue-200 text-right"
        disabled={isRecording}
        placeholder="متن صوت درحال دریافت"
      />

     {audioAddress && <AudioPlayer audioAddress={audioAddress} />} 
    </div>
  );
};

export default AudioStreamer;
