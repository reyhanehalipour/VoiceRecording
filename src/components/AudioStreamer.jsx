import React, { useRef, useState, useEffect } from "react";
import { socket } from "../socket/socketconfig";
import { Microphone2, MicrophoneSlash } from "iconsax-reactjs";

const AudioStreamer = () => {
  const [transcription, setTranscription] = useState("");
  const [transcripted, setTranscripted] = useState("");
  const [recordingStat, setRecordingStat] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [audioAddress, setAudioAddress] = useState("");
  const [username, setUsername] = useState("");
  const [fileNumber, setFileNumber] = useState("");

  const audioContextRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const socketRef = useRef(null);
  const bufferRef = useRef([]);
  const canvasRef = useRef(null);
  const workletNodeRef = useRef(null);

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const storedFileNumber = localStorage.getItem("fileNumber");

    if (storedUsername && storedFileNumber) {
      setUsername(storedUsername);
      setFileNumber(storedFileNumber);
    }
  }, []);

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
        drawWaveform(event.data);
        const audioData = event.data;
        bufferRef.current.push(...audioData);

        if (bufferRef.current.length >= 1024 * 16) {
          const chunk = bufferRef.current.slice(0, 1024 * 16);
          bufferRef.current = bufferRef.current.slice(1024 * 16);
          const int16Chunk = new Int16Array(chunk);
          socket.emit("audio_chunk", int16Chunk.buffer, "15");
        }
      };

      source.connect(workletNode).connect(audioContext.destination);
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
    }
  };

  const stopRecording = () => {
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

    setTranscription("");
    setIsRecording(false);
    bufferRef.current = [];

    socket.emit("get_audio_file", "15");
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

    socket.on("audiofile", (data) => {
      if (data?.text) {
        const fileUrl = "http://localhost:3500/tmp/" + data.text;
        setAudioAddress(fileUrl);
      }
    });
  }, []);

  // 🎨 نسخه‌ی جدید و خلاقانه‌ی waveform
  const drawWaveform = (dataArray) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    const gradient = ctx.createLinearGradient(0, 0, width, 0);
    gradient.addColorStop(0, "#00f0ff");
    gradient.addColorStop(0.5, "#00ff9d");
    gradient.addColorStop(1, "#00c2ff");

    ctx.beginPath();
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 2;

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

    // دایره انتهایی موج
    const endY = (1 - dataArray[dataArray.length - 1] / 255) * height * 0.5 + height * 0.25;
    ctx.beginPath();
    ctx.arc(width - 5, endY, 4, 0, 2 * Math.PI);
    ctx.fillStyle = "#00f0ff";
    ctx.fill();
  };

  return (
    <div className="bg-white rounded-lg w-full h-full shadow-lg flex flex-col items-center justify-center p-5">
      <div className="mb-4 flex gap-[20px] items-center justify-between">
        <div className="flex gap-2">
          <p className="text-blue-700 font-bold">{fileNumber || "شماره پرونده وجود ندارد"}</p>
          <p>: شماره پرونده</p>
        </div>

        <div className="flex gap-2">
          <p className="text-blue-700 font-bold">{username || "نام وجود ندارد"}</p>
          <p>: نام و نام خانوادگی</p>
        </div>
      </div>

      {recordingStat === 0 && (
        <div className="p-4 flex flex-col items-center justify-center gap-4">
          <div onClick={startRecording}>
            {isRecording ? (
              <div className="flex flex-col items-center justify-center gap-1">
                <Microphone2 size={50} className="text-green-600 animate-pulse" />
                <p className="text-green-600">درحال ضبط</p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-1 cursor-pointer">
                <MicrophoneSlash size={50} />
                <p className="font-[14px]">برای شروع بلندگو را فشار دهید</p>
              </div>
            )}
          </div>

          <div className="text-center">
            <canvas
              ref={canvasRef}
              width={500}
              height={80}
              
            />
          </div>

          {isRecording && (
            <div
              onClick={stopRecording}
              className="cursor-pointer text-red-600 font-bold"
            >
              پایان ضبط
            </div>
          )}
        </div>
      )}

      <textarea
        rows={5}
        value={transcripted + transcription}
        onChange={(e) => setTranscripted(e.target.value)}
        className="mt-4 w-full h-[100px] p-2 border rounded bg-blue-200"
        disabled={isRecording}
      />

      {audioAddress && (
        <div className="mt-4">
          <audio controls>
            <source src={audioAddress} type="audio/wav" />
            مرورگر شما از پخش صدا پشتیبانی نمی‌کند.
          </audio>
        </div>
      )}
    </div>
  );
};

export default AudioStreamer;
