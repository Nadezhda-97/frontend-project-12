import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { ChatContext } from './index.jsx';
import { useAuth } from '../hooks/index.jsx';

const ChatProvider = ({ socket, children }) => {
  const { userData } = useAuth();
  const currentChannelId = useSelector((state) => state.channels.currentChannelId);

  const addMessage = async ({ message }) => {
    const messageData = {
      channelId: currentChannelId,
      text: message,
      username: userData.username,
    };

    await socket.emit('newMessage', messageData);
  };

  const value = useMemo(() => ({ addMessage }), [addMessage]);

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};

export default ChatProvider;
