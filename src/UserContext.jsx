import React, { createContext, useContext, useState } from 'react';

// ایجاد Context برای یوزرنیم
const UserContext = createContext();

// Provider برای در اختیار گذاشتن یوزرنیم
export const UserProvider = ({ children }) => {
  const [username, setUsername] = useState(null);

  return (
    <UserContext.Provider value={{ username, setUsername }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook برای استفاده از Context
export const useUser = () => useContext(UserContext);
