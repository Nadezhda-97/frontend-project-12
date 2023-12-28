import React, { useState, useMemo } from 'react';
import { AuthContext } from './index.jsx';

const AuthProvider = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('userData'));
  const [userData, setUserData] = useState(user);

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
