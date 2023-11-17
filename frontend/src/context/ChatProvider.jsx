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

  const addChannel = async ({ name }) => {
    await socket.emit('newChannel', { name });
  };

  const renameChannel = async ({ id, name }) => {
    await socket.emit('renameChannel', { id, name });
  };

  const removeChannel = async (id) => {
    await socket.emit('removeChannel', { id });
  };

  const value = useMemo(() => ({
    addMessage, addChannel, renameChannel, removeChannel,
  }), [addMessage, addChannel, renameChannel, removeChannel]);

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};

export default ChatProvider;
