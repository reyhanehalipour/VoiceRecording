import { Microphone2} from 'iconsax-reactjs';  // افزودن آیکن MicrophoneSlash

const Connecting = () => {
 
    return (
      <div className="flex flex-col items-center justify-center w-[400px] h-[400px] bg-opacity-60 bg-white rounded-lg">
      <div className="mb-4 animate-pulse">
      <Microphone2 size={70} className='text-blue-600' />
      </div>
      
 <div>connecting...</div>
      {/* ویو موج صوتی ساده با انیمیشن */}
      <div className="flex items-end space-x-1 h-10">
        <div className="w-2 h-6 bg-blue-400 animate-[pulse_0.6s_infinite]"></div>
        <div className="w-2 h-4 bg-blue-400 animate-[pulse_0.6s_infinite_0.1s]"></div>
        <div className="w-2 h-8 bg-blue-400 animate-[pulse_0.6s_infinite_0.2s]"></div>
        <div className="w-2 h-4 bg-blue-400 animate-[pulse_0.6s_infinite_0.3s]"></div>
        <div className="w-2 h-6 bg-blue-400 animate-[pulse_0.6s_infinite_0.4s]"></div>
      </div>
    </div>
      );
}
export default Connecting;
