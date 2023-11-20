import { Provider } from 'react-redux';
import { initReactI18next, I18nextProvider } from 'react-i18next';
import i18next from 'i18next';

import ChatProvider from './context/ChatProvider.jsx';
import AuthProvider from './context/AuthProvider.jsx';

import store from './slices/index.js';
import { actions as messagesActions } from './slices/messagesSlice.js';
import { actions as channelsActions } from './slices/channelsSlice.js';

import App from './App.jsx';
import resources from './locales/locale.js';

const defaultLanguage = 'ru';

const init = async (socket) => {
  const i18nInstance = i18next.createInstance();
  await i18nInstance
    .use(initReactI18next)
    .init({
      lng: defaultLanguage,
      fallbackLng: defaultLanguage,
      debug: true,
      resources,
      interpolation: {
        escapeValue: false,
      },
    });

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
      <I18nextProvider i18n={i18nInstance}>
        <AuthProvider>
          <ChatProvider socket={socket}>
            <App />
          </ChatProvider>
        </AuthProvider>
      </I18nextProvider>
    </Provider>
  );
};

export default init;
