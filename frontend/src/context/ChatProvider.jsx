import React, { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { ChatContext } from './index.jsx';
import { useAuth } from '../hooks/index.jsx';
import { actions as channelsActions } from '../slices/channelsSlice.js';

const ChatProvider = ({ socket, children }) => {
  const { userData } = useAuth();
  const dispatch = useDispatch();
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
    addChannel: async (channel) => {
      const { data } = await socket.emitWithAck('newChannel', channel);
      dispatch(channelsActions.setCurrentChannel(data.id));
    },
    renameChannel: async ({ id, name }) => {
      await socket.emit('renameChannel', { id, name });
    },
    removeChannel: async (id) => {
      await socket.emit('removeChannel', { id });
    },
  }), [socket, currentChannelId, userData, dispatch]);

  return (
    <ChatContext.Provider value={values}>
      {children}
    </ChatContext.Provider>
  );
};

export default ChatProvider;
