import { createTheme } from '@mui/material/styles';

const AZUL_OSCURO = '#0D2A4A';
const CELESTE = '#4A90C2';
const GRIS = '#6E7B8B';
const AMARILLO = '#F2C200';
const ROJO = '#C62828';
const VERDE = '#2E7D32';

const theme = createTheme({
    palette: {
        primary: {
            main: AZUL_OSCURO,
            contrastText: '#FFFFFF',
        },
        secondary: {
            main: CELESTE,
            contrastText: '#0D2A4A',
        },
        info: {
            main: CELESTE,
            contrastText: '#0D2A4A',
        },
        success: {
            main: VERDE,
            contrastText: '#FFFFFF',
        },
        warning: {
            main: AMARILLO,
            contrastText: '#1A2027',
        },
        error: {
            main: ROJO,
            contrastText: '#FFFFFF',
        },
        background: {
            default: '#F4F7FA',
            paper: '#FFFFFF',
        },
        text: {
            primary: '#1A2027',
            secondary: GRIS,
        },
    },
    shape: {
        borderRadius: 8,
    },
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        button: {
            textTransform: 'none',
            fontWeight: 600,
        },
    },
});

export default theme;
