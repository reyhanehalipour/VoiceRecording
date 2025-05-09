import React, { useState } from "react";
import {
  CloseCircle,
  DocumentText,
  Play,
  Refresh,
  VoiceCricle,
} from "iconsax-reactjs";

export default function History() {
  const [rotating, setRotating] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedText, setSelectedText] = useState("");

  const handleClick = () => {
    setRotating(true);
    setTimeout(() => setRotating(false), 1000);
  };

  const handleShowText = (text) => {
    setSelectedText(text);
    setShowModal(true);
  };

  return (
    <div className="p-6 bg-white bg-opacity-80 rounded-lg shadow-lg w-full max-w-md mx-auto  border-2 border-blue-200 self-start">
      {/* هدر */}
      <div className="flex items-center justify-center gap-2">
        <button onClick={handleClick}>
          <Refresh
            className={`w-6 h-6 text-blue-600 transition-transform ${
              rotating ? "animate-spin" : ""
            }`}
          />
        </button>

        <h2 className="text-[15px] font-bold text-blue-700 text-center">
          صوت‌های قبلی
        </h2>
        <VoiceCricle className="text-blue-500" />
      </div>

      {/* آیتم صوتی */}
      <div className="flex items-center  mt-4 gap-2">
        <div className="flex items-center justify-between bg-blue-50 border border-blue-200 p-3 rounded-2xl shadow-sm hover:shadow-md transition-all">
          <div className="flex gap-2 items-center justify-center">
            <button className="bg-blue-600 text-white p-1 rounded-full hover:bg-blue-700 transition">
              <Play size={20} />
            </button>
            <span className="text-sm text-blue-900 font-medium">
              2025-05-05
            </span>
          </div>
        </div>

        <DocumentText
          onClick={() =>
            handleShowText(
              "این متن مربوط به این فایل صوتی هست. می‌تونه چند خط باشه."
            )
          }
        />
      </div>
      {/* مودال */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center  h-full justify-center z-50">
          <div className="bg-white h-[400px] w-[500px] p-6 rounded-xl shadow-xl max-w-sm  space-y-2">
            <CloseCircle onClick={() => setShowModal(false)} />

            <p className="text-gray-800 whitespace-pre-line">{selectedText}</p>
          </div>
        </div>
      )}
    </div>
  );
}
