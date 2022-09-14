import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  // causes double rendering during development
  // <React.StrictMode>
    <App />
  // </React.StrictMode>
);
