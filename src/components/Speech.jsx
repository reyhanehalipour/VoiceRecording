import React, { useState, useEffect } from 'react';
import { Microphone2, MicrophoneSlash } from 'iconsax-reactjs';  // افزودن آیکن MicrophoneSlash

const VoiceRecordingPage = () => {
  const [text, setText] = useState('');  // برای ذخیره متن نهایی
  const [tempText, setTempText] = useState('');  // برای ذخیره متن موقت
  const [isRecording, setIsRecording] = useState(false);  // برای کنترل وضعیت ضبط صدا
  const [error, setError] = useState(null);  // برای نمایش ارور در صورت بروز مشکل
  const [username, setUsername] = useState('');
  const [fileNumber, setFileNumber] = useState('');

  useEffect(() => {
    // بارگذاری اطلاعات از localStorage هنگام لود صفحه
    const storedUsername = localStorage.getItem('username');
    const storedFileNumber = localStorage.getItem('fileNumber');
    
    if (storedUsername && storedFileNumber) {
      setUsername(storedUsername);
      setFileNumber(storedFileNumber);
    }
  }, []);

  const handleStartStopRecording = () => {
    if (isRecording) {
      // اگر در حال ضبط هستیم، ضبط را متوقف می‌کنیم
      const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      recognition.stop();
      setIsRecording(false);
    } else {
      // اگر در حال ضبط نیستیم، ضبط را شروع می‌کنیم
      if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
        const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.lang = 'fa-IR';  // زبان فارسی
        recognition.continuous = true;  // ضبط ادامه دار
        recognition.interimResults = true;  // فعال کردن نتایج موقت
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
          setIsRecording(true);
        };

        recognition.onresult = (event) => {
          let result = event.results[event.resultIndex];
          if (result.isFinal) {
            // زمانی که نتیجه قطعی دریافت شد، متن نهایی را نمایش می‌دهیم
            setText((prevText) => prevText + tempText + result[0].transcript);
            setTempText(''); // بعد از تکمیل، متن موقت پاک می‌شود
          } else {
            // زمانی که هنوز در حال صحبت کردن هستیم، متن موقت را نمایش می‌دهیم
            setTempText(result[0].transcript);
          }
        };

        recognition.onerror = (event) => {
          setError(event.error);
        };

        recognition.onend = () => {
          setIsRecording(false);
        };

        recognition.start();  // شروع ضبط صدا
      } else {
        setError('Web Speech API is not supported in this browser.');
      }
    }
  };

  return (
    <div className="bg-white rounded-xl flex flex-col items-center justify-start shadow-lg w-[80vw] h-[80vh] p-8">
      {/* نمایش نام و شماره پرونده */}
      <div className="mb-4 flex gap-[20px] items-center justify-end">
        <div className="flex gap-2">
          <p className="text-green-700 font-bold">{fileNumber || 'شماره پرونده وجود ندارد'}</p>
          <p>: شماره پرونده</p>
        </div>

        <div className="flex gap-2">
          <p className="text-green-700 font-bold">{username || 'نام وجود ندارد'}</p>
          <p>: نام و نام خانوادگی</p>
        </div>
      </div>

      {/* متن تبدیل شده */}
      <textarea
        value={text + tempText}  // نمایش همزمان متن نهایی و موقت
        onChange={(e) => setText(e.target.value)}
        maxLength={undefined} 
        rows="12"
        placeholder="وقتی صحبت می‌کنید، متن اینجا نمایش داده می‌شود"
        className="w-full p-3 border-2 rounded-lg text-xs text-right transition-all duration-300 focus:outline-none"
      />

      {/* نمایش آیکن میکروفن با انیمیشن ارتعاش */}
      <div className="flex gap-4 mt-4 items-center">
        <button
          onClick={handleStartStopRecording}
          className={`p-4 ${isRecording ? 'text-green-600' : 'text-red-600'} rounded-full ${isRecording ? 'animate-shake scale-110' : 'scale-100'}`}
        >
          {isRecording ? <Microphone2 size={50} /> : <MicrophoneSlash size={50} />}
        </button>
      </div>

      {/* نمایش پیام در حال ضبط */}
      {isRecording && <p className="text-green-600">...درحال ضبط</p>}

      {/* دکمه ذخیره */}
      {isRecording && (
        <div className="self-end mt-4 flex gap-2">
          <button className="px-4 py-2 bg-green-700 rounded-lg text-white">ذخیره</button>
        </div>
      )}

    </div>
  );
};

export default VoiceRecordingPage;
