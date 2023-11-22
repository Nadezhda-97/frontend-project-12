import React, { useState, useMemo } from 'react';
import { AuthContext } from './index.jsx';

const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState(() => {
    const item = localStorage.getItem('userData');
    return item ? JSON.parse(item) : null;
  });

  const logIn = (data) => {
    localStorage.setItem('userData', JSON.stringify(data));
    setUserData(data);
  };

  const logOut = () => {
    localStorage.removeItem('userData');
    setUserData(null);
  };

  const auth = useMemo(() => ({ userData, logIn, logOut }), [userData]);

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
