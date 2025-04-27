
import Login from '../src/components/Login';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Speech from './components/Speech';

const App = () => {
  


  return (
    <div className="h-full w-full flex mx-auto items-center justify-center">
      <Router>
      <div className="h-full w-full flex mx-auto items-center justify-center">
        <Routes>
          {/* مسیر صفحه لاگین */}
          <Route path="/" element={<Login />} />
          
          {/* مسیر صفحه ضبط صدا */}
          <Route path="/recording" element={<Speech/>} />
        </Routes>
      </div>
    </Router>
     
      
      
    </div>
  );
};

export default App;

