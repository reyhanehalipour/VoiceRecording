import React, { useRef, useState, useEffect } from "react";
import { socket } from "../socket/socketconfig";
import { Clock, Microphone2, MicrophoneSlash, User, VolumeHigh } from "iconsax-reactjs";

import AudioPlayer from "./Voice";
const AudioStreamer = () => {
  const [transcription, setTranscription] = useState("");
  const [transcripted, setTranscripted] = useState("");
  const [recordingStat, setRecordingStat] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [audioAddress, setAudioAddress] = useState("");
  const [username, setUsername] = useState("");
  const [fileNumber, setFileNumber] = useState("");
  const [timer, setTimer] = useState(0); // تایمر اضافه شده

  const audioContextRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const socketRef = useRef(null);
  const bufferRef = useRef([]);
  const canvasRef = useRef(null);
  const workletNodeRef = useRef(null);
  const timerRef = useRef(null); // تایمر برای جلوگیری از ایجاد تایمر دوباره

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

      // شروع تایمر
      setTimer(0);
      timerRef.current = setInterval(() => {
        setTimer((prev) => prev + 1); // هر ثانیه تایمر را یک واحد افزایش می‌دهد
      }, 1000);
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

    // توقف تایمر
    clearInterval(timerRef.current);


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
  
    // گرادینت پررنگ‌تر
    const gradient = ctx.createLinearGradient(0, 0, width, 0);
    gradient.addColorStop(0, "#00e0ff");      // آبی روشن پررنگ‌تر
    gradient.addColorStop(0.5, "#00ff66");    // سبز نئونی
    gradient.addColorStop(1, "#00aaff");      // آبی آسمونی شارپ
  
    ctx.beginPath();
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 3; // ضخیم‌تر برای تأکید بیشتر
  
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
  
    // دایره انتهایی با رنگ قوی‌تر
    const endY = (1 - dataArray[dataArray.length - 1] / 255) * height * 0.5 + height * 0.25;
    ctx.beginPath();
    ctx.arc(width - 5, endY, 4, 0, 2 * Math.PI);
    ctx.fillStyle = "#00ffff"; // فیروزه‌ای نئونی
    ctx.fill();
  };
  

  // تبدیل ثانیه به دقیقه و ثانیه
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
  };

  return (
    <div className="bg-white bg-opacity-80 rounded-lg w-full h-[600px] shadow-lg flex flex-col items-center justify-center px-5 ">
      <div className="mb-4 flex w-full gap-[20px] items-center justify-between">
        <div className="flex gap-2">
          <p className="text-blue-700 font-bold">{fileNumber || "شماره پرونده وجود ندارد"}</p>
          <p>: شماره پرونده</p>
        </div>

        <div className="flex gap-2">
          <p className="text-blue-700 font-bold">{username || "نام وجود ندارد"}</p>
          <p>: نام و نام خانوادگی</p>
          <User/>
        </div>
      </div>

      <div className="p-4 flex  items-center justify-center gap-4">
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
          <Clock/>
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

<AudioPlayer audioAddress={audioAddress } />

   
    </div>
  );
};

export default AudioStreamer;
