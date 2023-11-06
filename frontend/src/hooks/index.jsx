import { useContext } from 'react';
import { AuthContext, ChatContext } from '../context/index.jsx';

const useAuth = () => useContext(AuthContext);
const useChatContext = () => useContext(ChatContext);

export { useAuth, useChatContext };
