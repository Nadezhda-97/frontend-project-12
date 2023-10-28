import React, { useState, useMemo } from 'react';
import {
  BrowserRouter, Routes, Route, Navigate, Link,
} from 'react-router-dom';
import { Navbar, Container, Button } from 'react-bootstrap';

import ErrorPage from './components/errorPage.jsx';
import LoginPage from './components/loginPage.jsx';
import ChatPage from './components/chatPage.jsx';
import SignUpPage from './components/signUpPage.jsx';

import { AuthContext } from './context/index.jsx';
import { useAuth } from './hooks/index.jsx';
import routes from './routes/routes.js';

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

const Root = ({ children }) => {
  const { userData } = useAuth();
  return userData ? children : <Navigate to={routes.loginPage} />;
};

const AuthButton = () => {
  const auth = useAuth();
  return auth.userData && <Button onClick={auth.logOut}>Выйти</Button>;
};

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <div className="h-100">
        <div className="h-100" id="chat">
          <div className="d-flex flex-column vh-100">
            <Navbar className="shadow-sm navbar-expand-lg navbar-light bg-white">
              <Container>
                <Navbar.Brand as={Link} to={routes.chatPage}>Hexlet Chat</Navbar.Brand>
                <AuthButton />
              </Container>
            </Navbar>
            <Routes>
              <Route path="/" element={(<Root><ChatPage /></Root>)} />
              <Route path="*" element={<ErrorPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignUpPage />} />
            </Routes>
          </div>
        </div>
      </div>
    </BrowserRouter>
  </AuthProvider>
);

export default App;
