import React from 'react';
import AudioStreamer from './AudioStreamer';
import History from './History';
import { motion } from "framer-motion";
import { SaveAdd } from 'iconsax-reactjs';
export default function PageRecord() {
  return (
    <div className="grid grid-cols-[1fr_auto] gap-10 w-full justify-center items-start">

<motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        whileHover={{ scale: 1.03 }}
        transition={{
          duration: 1,
          ease: [0.2, 0.8, 0.2, 1],
          type: "spring",
          stiffness: 100,
        }}
      >
        <AudioStreamer />
      </motion.div>


      <div className="grid gap-4">
        <History />

        <button className="bg-green-600 flex items-center justify-center hover:bg-green-800 gap-1 text-white text-lg font-semibold p-4 rounded-xl shadow">
          ذخیره <SaveAdd/>
        </button>
      </div>

    </div>
  );
}


