import { createRoot } from 'react-dom/client'
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './shared/theme/theme';
import App from './shared/layouts/App.jsx'
import './shared/style/index.css';
import AppRouterProvider from './providers/Router/AppRouterProviders.jsx';
import { AuthProvider } from './providers/Authenticacion/AuthProvider.jsx';
import { NotificacionProvider } from './providers/Notificacion/NotificacionProvider.jsx';

createRoot(document.getElementById('root')).render(
    <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
            <AppRouterProvider>
                <NotificacionProvider>
                    <App />
                </NotificacionProvider>
            </AppRouterProvider>


        </AuthProvider>
    </ThemeProvider>
)

