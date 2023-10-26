import {
  BrowserRouter, Routes, Route,
} from 'react-router-dom';
import ErrorPage from './components/errorPage.jsx';
import LoginPage from './components/loginPage.jsx';
import ChatPage from './components/chatPage.jsx';
import SignUpPage from './components/signUpPage.jsx';

const App = () => (
  <BrowserRouter>
    <div className="h-100">
      <div className="h-100" id="chat">
        <div className="d-flex flex-column vh-100">
          <nav className="shadow-sm navbar-expand-lg navbar-light bg-white">
            <div className="container">
              <a className="navbar-brand" href="/">Hexlet Chat</a>
            </div>
          </nav>
          <Routes>
            <Route path="*" element={<ErrorPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<ChatPage />} />
            <Route path="/signup" element={<SignUpPage />} />
          </Routes>
        </div>
      </div>
    </div>
  </BrowserRouter>
);

export default App;
