import {
  BrowserRouter, Routes, Route, Navigate, Link,
} from 'react-router-dom';
import { Navbar, Container, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

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

const App = () => {
  const { t } = useTranslation();
  const auth = useAuth();

  return (
    <BrowserRouter>
      <div className="h-100">
        <div className="h-100" id="chat">
          <div className="d-flex flex-column vh-100">
            <Navbar className="shadow-sm navbar-expand-lg navbar-light bg-white">
              <Container>
                <Navbar.Brand as={Link} to={routes.chatPage}>{t('headers.chat')}</Navbar.Brand>
                {auth.userData && (<Button onClick={auth.logOut}>{t('buttons.logOut')}</Button>)}
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
  );
};

export default App;
