import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css';
import AppRouterProvider from './providers/AppRouterProviders.jsx';

createRoot(document.getElementById('root')).render(
    <AppRouterProvider>
      <App />
    </AppRouterProvider>
)
