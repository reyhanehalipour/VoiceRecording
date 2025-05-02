
import { Logout } from "iconsax-reactjs";
import React, { useState } from "react";
import RegisterForm from "./register";
import LoginForm from "./Login";


const AuthTabs = ({isConnected}) => {
  const [activeTab, setActiveTab] = useState("login");

  return (
    <div className="bg-white flex  flex-col items-center justify-center w-[400px] h-[480px] p-5 rounded-xl shadow-lg max-w-sm">
      {/* دکمه‌های تب */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab("login")}
          className={`px-6 py-2 flex items-center justify-center my-auto rounded-full transition-all ${
            activeTab === "login"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-600"
          }`}
        >
          ورود
        </button>
        <button
          onClick={() => setActiveTab("register")}
          className={`px-6 flex items-center justify-center py-2 rounded-full transition-all ${
            activeTab === "register"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-600"
          }`}
        >
          ثبت‌نام
        </button>
      </div>

      {/* نمایش فرم مربوطه */}
      {activeTab === "login" ? <LoginForm isConnected={isConnected}/>  : <RegisterForm/>}
    </div>
  );
};

export default AuthTabs;
