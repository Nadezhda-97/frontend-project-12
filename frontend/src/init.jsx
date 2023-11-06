import { Provider } from 'react-redux';

import store from './slices/index.js';
import { ChatContext } from './context/index.jsx';
import App from './App.jsx';

const init = () => (
  <Provider store={store}>
    <ChatContext.Provider>
      <App />
    </ChatContext.Provider>
  </Provider>
);

export default init;
