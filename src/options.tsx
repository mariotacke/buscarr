import React from 'react';
import ReactDOM from 'react-dom/client';

import OptionsPage from './OptionsPage';

ReactDOM.createRoot(document.getElementById('root')!).render(
  // causes double rendering during development
  // <React.StrictMode>
    <OptionsPage />
  // </React.StrictMode>
);
