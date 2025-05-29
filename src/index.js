import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import App from './App';
import './index.css';
import { ToastContainer } from 'react-toastify';
import { WebSocketProvider } from './contexts/WebSocketContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <WebSocketProvider>
        <BrowserRouter>
          <Suspense fallback={<div>Loading...</div>}>
            <App />
          </Suspense>
          <ToastContainer />
        </BrowserRouter>  
      </WebSocketProvider>
    </Provider>
  </React.StrictMode>
);