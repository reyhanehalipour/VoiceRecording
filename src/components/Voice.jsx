import React from 'react';
import { Play, Pause, Stop, VolumeHigh } from 'iconsax-reactjs';

const AudioPlayer = ({ audioAddress }) => {
  return (
<div className="mt-4 w-full">
      <audio controls src={audioAddress} className="w-full" />
    </div>
  );
};

export default AudioPlayer;
