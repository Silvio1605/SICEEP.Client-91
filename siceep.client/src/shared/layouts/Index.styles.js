import { styled } from '@mui/material/styles';

export const MainContainer = styled('div')`
    display: flex;
    height: 100vh;
    width: 100vw;
    overflow: hidden;
    background-color: #f4f7fa;
`;

export const PageContent = styled('div')`
    flex: 1;
    display: block !important; /* MAGIA: Al ser bloque, pierde la liga elástica y no puede centrar */
    overflow-y: auto;
    height: 100vh;
`;

export const ContentWrapper = styled('div')`
    display: block !important; /* MAGIA: Bloque estricto */
    width: 100%;
    margin: 0 !important; /* Esto aniquila cualquier margen automático que lo empuje abajo */
    padding: 0 !important;
`;

/* ---- NUEVOS CONTENEDORES LIMPIOS ---- */

export const SidebarWrapper = styled('div')`
    z-index: 1200;
    position: relative;
`;

export const OutletContainer = styled('div')`
    display: block !important; /* MAGIA: Bloque estricto */
    width: 100%;
    padding: 40px 24px 24px 24px; 
    margin: 0 !important;
`;