import React from 'react';
import { Provider } from 'react-redux';
import { initReactI18next, I18nextProvider } from 'react-i18next';
import i18next from 'i18next';
import { io } from 'socket.io-client';
import leoProfanity from 'leo-profanity';
import { Provider as RollbarProvider, ErrorBoundary } from '@rollbar/react';

import ChatProvider from './context/ChatProvider.jsx';
import AuthProvider from './context/AuthProvider.jsx';

import store from './slices/index.js';
import { actions as messagesActions } from './slices/messagesSlice.js';
import { actions as channelsActions } from './slices/channelsSlice.js';

import App from './App.jsx';
import resources from './locales/locale.js';

const defaultLanguage = 'ru';

const init = async () => {
  const ruDictionary = leoProfanity.getDictionary('ru');
  leoProfanity.add(ruDictionary);

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

  const socket = io();

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

  const rollbarConfig = {
    accessToken: process.env.REACT_APP_ROLLBAR_ACCESS_TOKEN,
    captureUncaught: true,
    captureUnhandledRejections: true,
    environment: process.env.NODE_ENV,
  };

  return (
    <RollbarProvider config={rollbarConfig}>
      <ErrorBoundary>
        <Provider store={store}>
          <I18nextProvider i18n={i18nInstance}>
            <AuthProvider>
              <ChatProvider socket={socket}>
                <App />
              </ChatProvider>
            </AuthProvider>
          </I18nextProvider>
        </Provider>
      </ErrorBoundary>
    </RollbarProvider>
  );
};

export default init;
