import React, { useState, forwardRef, useEffect } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
// componente para mostrar el perfil del usuario seleccionado en la tabla de usuarios
import Permisos from './../../permisos/pages/Permisos';
import CardUsuario from './CardUsuario';
//iconos para el botón de activar/desactivar usuario
// hooks y contextos
import { useBusquedaContext } from './../../../providers/BusquedaUsers/useBusquedaContext';
import { usePerfil } from '../hooks/usePerfil';
import { useUsuarios } from './../hooks/useUsuarios';

const Item = styled(Paper)(({ theme }) => ({
    display: 'flex',
    backgroundColor: '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    color: (theme.vars ?? theme).palette.text.secondary,
    ...theme.applyStyles('dark', {
        backgroundColor: '#1A2027',
    }),
}));

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function Perfil({ open, onClose, buscar, filtro }) {

    const { idSeleccionado } = useBusquedaContext();
    const { perfil } = usePerfil(idSeleccionado);
    const { ActualizarEstado } = useUsuarios();

    const [EstadoComp, setEstadoComp] = useState();

    useEffect(() => {
        const cargarEstado = () => {
            setEstadoComp(perfil.usuario?.estado);
        };
        cargarEstado();

    }, [perfil.usuario?.estado]);

    const actualizarTabla = async () => {

        await buscar(filtro);
    };

    return (
        <React.Fragment>
            <Dialog
                fullScreen
                open={open}
                onClose={onClose}
                TransitionComponent={Transition}
                disableRestoreFocus
                disablePortal={false}
            >
                <AppBar sx={{ position: 'relative' }}>
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={onClose}
                            aria-label="close"
                        >
                            <CloseIcon />
                        </IconButton>
                        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                            Perfil
                        </Typography>
                        <Button autoFocus color="inherit" onClick={onClose}>
                            Cerrar
                        </Button>
                    </Toolbar>
                </AppBar>
                
                <Box sx={{ flexGrow: 1, p: 2 }}>
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, sm: 12, md: 4 }}>
                            <CardUsuario actualizar = { actualizarTabla } />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 12, md: 8 }}>
                            <Permisos />
                        </Grid>
                    </Grid>
                </Box>
            </Dialog>
        </React.Fragment>
    );
}

