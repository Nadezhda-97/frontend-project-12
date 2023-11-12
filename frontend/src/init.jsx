import { Provider } from 'react-redux';
import ChatProvider from './context/ChatProvider.jsx';
import AuthProvider from './context/AuthProvider.jsx';

import store from './slices/index.js';
import { actions as messagesActions } from './slices/messagesSlice.js';

import App from './App.jsx';

const init = (socket) => {
  socket.on('newMessage', (payload) => {
    store.dispatch(messagesActions.addMessage(payload));
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
