import React, { useState, useMemo } from 'react';
import { AuthContext } from './index.jsx';

const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState(() => {
    const item = localStorage.getItem('userData');
    return item ? JSON.parse(item) : null;
  });

  const logIn = (data) => {
    setUserData(data);
    const stringify = JSON.stringify(data);
    localStorage.setItem('userData', stringify);
  };

  const logOut = () => {
    setUserData(null);
    localStorage.removeItem('userData');
  };

  const auth = useMemo(() => ({ userData, logIn, logOut }), [userData]);

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
