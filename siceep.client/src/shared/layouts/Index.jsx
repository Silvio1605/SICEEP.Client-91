import * as React from "react";
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import Nav from "./../components/Nav";
import BarraNav from "./../components/BarraNav";
import Toolbar from "@mui/material/Toolbar";

function Index() {

    const [open, setOpen] = React.useState(false);

    const toggleNav = (newOpen) => () => {
        setOpen(newOpen);
    };

    return (
        <Box>
            {/** Componente de navegación lateral */}
            <Nav open={open} toggleNav={toggleNav} />
            {/** Contenedor principal que incluye la barra de navegación y el contenido */}
            <Box
                sx={{
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                    minWidth: 0  
                }}
            >
                {/** Barra de navegación superior */}
                <BarraNav toggleNav={toggleNav} />
                {/** Espacio para el contenido principal */}
                <Toolbar />
                {/** Panel principal con fondo suave y espacio para el contenido */}
                <Box
                    sx={{
                        width: '98vw', //esapcio para el contenido principal
                        height: 'auto',
                        p: 2, // Padding general para el panel
                        bgcolor: 'grey.50', // Color de fondo suave
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2, // Espacio entre los elementos
                    }}
                >
                    {/** Aquí se renderizarán los componentes hijos según la ruta */}
                    <Outlet />
                </Box>
                
            </Box>

        </Box>
    );
}

export default Index;
