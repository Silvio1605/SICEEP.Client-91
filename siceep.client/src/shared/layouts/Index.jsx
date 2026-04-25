import * as React from "react";
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import Nav from "./../components/Nav";
import BarraNav from "./../components/BarraNav";
import Toolbar from "@mui/material/Toolbar";
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: (theme.vars ?? theme).palette.text.secondary,
    ...theme.applyStyles('dark', {
        backgroundColor: '#1A2027',
    }),
}));

function Index() {

    const [open, setOpen] = React.useState(false);

    const toggleNav = (newOpen) => () => {
        setOpen(newOpen);
    };

    return (
        <Box>
            {/** Componente de navegción lateral */}
            <Nav open={open} toggleNav={toggleNav} />

            {/** Barra de navegación superior */}
            <BarraNav toggleNav={toggleNav} />

            {/** Espacio para el contenido principal */}
            <Toolbar />

            {/** Panel principal con fondo suave y espacio para el contenido */}
            <Box sx={{ flexGrow: 1, width: "98vw", pl: 1 }}>
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 12 }}>
                        <Outlet />
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
}

export default Index;
