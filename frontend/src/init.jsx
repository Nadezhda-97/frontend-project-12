import { Provider } from 'react-redux';
import ChatProvider from './context/ChatProvider.jsx';
import AuthProvider from './context/AuthProvider.jsx';

import store from './slices/index.js';
import { actions as messagesActions } from './slices/messagesSlice.js';
import { actions as channelsActions } from './slices/channelsSlice.js';

import App from './App.jsx';

const init = (socket) => {
  socket.on('newMessage', (payload) => {
    store.dispatch(messagesActions.addMessage(payload));
  });

  socket.on('newChannel', (payload) => {
    store.dispatch(channelsActions.addChannel(payload));
  });

  socket.on('renameChannel', (payload) => {
    store.dispatch(channelsActions.renameChannel(payload));
  });

  socket.on('removeChannel', (payload) => {
    store.dispatch(channelsActions.removeChannel(payload.id));
  });

  return (
    <Provider store={store}>
      <AuthProvider>
        <ChatProvider socket={socket}>
          <App />
        </ChatProvider>
      </AuthProvider>
    </Provider>
  );
};

export default init;
