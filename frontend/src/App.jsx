import {
  BrowserRouter, Routes, Route, Navigate,
} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Header from './components/Header.jsx';
import ErrorPage from './components/pages/ErrorPage.jsx';
import LoginPage from './components/pages/LoginPage.jsx';
import ChatPage from './components/pages/ChatPage.jsx';
import SignUpPage from './components/pages/SignUpPage.jsx';

import { useAuth } from './hooks/index.jsx';
import routes from './routes/routes.js';

const Root = ({ children }) => {
  const { userData } = useAuth();
  return userData ? children : <Navigate to={routes.loginPage} />;
};

const App = () => (
  <BrowserRouter>
    <div className="h-100">
      <div className="h-100" id="chat">
        <div className="d-flex flex-column vh-100">
          <Header />
          <Routes>
            <Route path={routes.chatPage} element={(<Root><ChatPage /></Root>)} />
            <Route path={routes.loginPage} element={<LoginPage />} />
            <Route path={routes.signUpPage} element={<SignUpPage />} />
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </div>
        <ToastContainer />
      </div>
    </div>
  </BrowserRouter>
);

export default App;
