import 'bootstrap/dist/css/bootstrap.min.css';

import ReactDOM from 'react-dom/client';
import init from './init.jsx';
import './index.css';

const app = async () => {
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(await init());
};

app();
