import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { ChatContext } from './index.jsx';
import { useAuth } from '../hooks/index.jsx';

const ChatProvider = ({ socket, children }) => {
  const { userData } = useAuth();
  const currentChannelId = useSelector((state) => state.channels.currentChannelId);

  const values = useMemo(() => ({
    addMessage: async ({ message }) => {
      const messageData = {
        channelId: currentChannelId,
        text: message,
        username: userData.username,
      };

      await socket.emit('newMessage', messageData);
    },
    addChannel: async ({ name }) => {
      await socket.emit('newChannel', { name });
    },
    renameChannel: async ({ id, name }) => {
      await socket.emit('renameChannel', { id, name });
    },
    removeChannel: async (id) => {
      await socket.emit('removeChannel', { id });
    },
  }), [socket, currentChannelId, userData]);

  return (
    <ChatContext.Provider value={values}>
      {children}
    </ChatContext.Provider>
  );
};

export default ChatProvider;
