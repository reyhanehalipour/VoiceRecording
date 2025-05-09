import React, { useRef, useState } from "react";
import { Play, Pause } from "iconsax-reactjs";

const AudioPlayer = ({ audioAddress }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const [audioProgress, setAudioProgress] = useState(0);
  const audioRef = useRef(null);

  const togglePlayPause = () => {
    if (audioRef.current.paused) {
      audioRef.current.play();
      setIsPlaying(true);
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };


 

  const handleProgress = () => {
    const progress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
    setAudioProgress(progress);
  };

  return (
    <div className="mt-4 bg-white rounded-lg p-3 w-full flex  gap-2 items-center justify-center">
      <audio
        ref={audioRef}
        src={audioAddress}
        onTimeUpdate={handleProgress}
        className="w-full"
      />

      
<div className="flex flex-col items-center justify-center mt-4 gap-6">
        <button
          onClick={togglePlayPause}
          className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
        >
          {isPlaying ? (
            <Pause size={24} />
          ) : (
            <Play size={24} />
          )}
        </button>
       
     
      </div>
      <div className="w-full mt-2">
        <input
          type="range"
          min="0"
          max="100"
          value={audioProgress}
          onChange={() => {}}
          className="w-full h-1 bg-gray-300 rounded-lg cursor-pointer"
        />
      </div>

  
    </div>
  );
};

export default AudioPlayer;

