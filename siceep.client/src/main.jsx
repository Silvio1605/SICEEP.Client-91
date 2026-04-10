import { createRoot } from 'react-dom/client'
import App from './shared/layouts/App.jsx'
import './shared/style/index.css';
import AppRouterProvider from './providers/AppRouterProviders.jsx';

createRoot(document.getElementById('root')).render(
    <AppRouterProvider>
      <App />
    </AppRouterProvider>
)
