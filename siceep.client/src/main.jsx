import { createRoot } from 'react-dom/client'
import App from './shared/layouts/App.jsx'
import './shared/style/index.css';
import AppRouterProvider from './providers/Router/AppRouterProviders.jsx';
import { NotificacionProvider } from './providers/Notificacion/NotificacionProvider.jsx';


createRoot(document.getElementById('root')).render(
    <AppRouterProvider>
      <NotificacionProvider>
        <App />
      </NotificacionProvider>
    </AppRouterProvider>
)
