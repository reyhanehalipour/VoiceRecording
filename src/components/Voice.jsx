import React from 'react';
import { Play, Pause, Stop, VolumeHigh } from 'iconsax-reactjs';

const AudioPlayer = ({ audioAddress }) => {
  return (
    <div className="mt-4 w-full flex flex-col items-center bg-blue-50 p-4 rounded-lg shadow-lg">
      <div className="flex justify-between w-full items-center">
        <audio controls className="w-full hidden">
          <source src={audioAddress} type="audio/wav" />
          مرورگر شما از پخش صدا پشتیبانی نمی‌کند.
        </audio>
        
        {/* دکمه‌های پخش، توقف و مکث */}
        <div className="flex gap-4 items-center">
          <button
            onClick={() => document.querySelector('audio').play()}
            className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 focus:outline-none transition duration-300"
          >
            <Play size={24} color="#fff" />
          </button>
          
          <button
            onClick={() => document.querySelector('audio').pause()}
            className="bg-yellow-500 text-white p-2 rounded-full hover:bg-yellow-600 focus:outline-none transition duration-300"
          >
            <Pause size={24} color="#fff" />
          </button>
          
         
        </div>
        
        {/* کنترل صدا */}
        <div className="flex items-center">
            <VolumeHigh/>
          <input
            type="range"
            min="0"
            max="100"
            defaultValue="100"
            className="w-24 h-2 bg-blue-200 rounded-full"
            onChange={(e) => document.querySelector('audio').volume = e.target.value / 100}
          />
        </div>
      </div>

      <div className="mt-3 text-center text-gray-500">
        <p>پخش صدا از فایل: {audioAddress}</p>
      </div>
    </div>
  );
};

export default AudioPlayer;
