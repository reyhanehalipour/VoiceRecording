import Login from '../src/components/Login';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { socket } from './socket/socketconfig';
import AudioStreamer  from './components/AudioStreamer';
import Connecting from './components/Connecting';
import AuthTabs from './components/AuthTabs';
import PageRecord from './components/PageRecord';

const App = () => {
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  }, []);


console.log(isConnected)
console.log('Initial socket connected:', socket.connected);

/* if (!isConnected) {
  return <Connecting  />;
} */
  return (
    <div className="h-full w-full flex items-center justify-center">
      
      <Router>
        <div className="h-full w-full flex  items-center justify-center">
          <Routes>
            {/* مسیر صفحه لاگین */}
            <Route path="/" element={<AuthTabs isConnected={isConnected}/>} />

            {/* مسیر صفحه ضبط صدا */}
            <Route path="/recording" element={<PageRecord/>}/>
          </Routes>
        </div>
      </Router>
    </div>
  );
};

export default App;
