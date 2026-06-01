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
import Confirm from './../../../shared/components/Confirm';
import CardReestrablecerContra from './CardReestrablecerContra';
//iconos para el botón de activar/desactivar usuario
import PersonOffIcon from '@mui/icons-material/PersonOff';
import PersonIcon from '@mui/icons-material/Person';
// hooks y contextos
import { useNotificacionContext } from '../../../providers/Notificacion/useNotificacionContext';
import { useBusquedaContext } from './../../../providers/BusquedaUsers/useBusquedaContext';
import { usePermisosContext } from './../../../providers/Permisos/usePermisoContext';
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
    const { permisosHook } = usePermisosContext();
    const { perfil, reload } = usePerfil(idSeleccionado);
    const { ActualizarEstado } = useUsuarios();
    const { mostrarNotificacion } = useNotificacionContext();

    const [EstadoComp, setEstadoComp] = useState();
    // Estado para controlar el diálogo de actualización de fecha
    const [dialogo, setDialogo] = useState(null);

    const abrirConfirmDes = () => setDialogo("confirmDesactivar");
    const abrirReestrablecerContra = () => setDialogo("reestrablecerContra");
    
    const cerrar = () => setDialogo(null);

    useEffect(() => {
        const cargarEstado = () => {
            setEstadoComp(perfil.usuario?.estado);
        };
        cargarEstado();

    }, [perfil.usuario?.estado]);

    const handleActEstado = async () => {

        try {
            await ActualizarEstado(perfil.usuario?.id, perfil.usuario?.estado);

            mostrarNotificacion({
                message: perfil.usuario?.estado === 2 || perfil.usuario?.estado === 3 ? "Usuario activado correctamente" : "Usuario deshabilitado correctamente",
                severity: "success",
            });

            // recargar datos
            await permisosHook.refetch();
            const nuevoEstado = perfil.usuario?.estado === 1 ? 3 : 1;
            setEstadoComp(nuevoEstado);
            await reload();
            await actualizarTabla();

        } catch (error) {
            mostrarNotificacion({
                message: error.message ?? "Error al actualizar el estado del usuario",
                severity: "error",
            });
            console.log(error);
        }
        cerrar();

    };

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
                <Box sx={{ p: 2, m: 0 }}>
                    <Item>
                        <Box
                            sx={{
                                display: 'flex',
                                gap: 2,
                                justifyContent: 'flex-end',
                            }}
                        >
                            <Button
                                sx={{ mt: 2, ml: 1 }}
                                variant="contained"
                                color="secondary"
                                onClick={(e) => {
                                    // Evitar que el botón mantenga el foco después de hacer clic
                                    e.currentTarget.blur();
                                    abrirReestrablecerContra();
                                }}
                            >
                                Reestablecer Contraseña
                            </Button>

                            <Button
                                sx={{ mt: 2 }}
                                variant="contained"
                                color={EstadoComp === 2 || EstadoComp === 3 ? "primary" : "error"}
                                startIcon={EstadoComp === 2 || EstadoComp === 3 ? <PersonIcon /> : <PersonOffIcon />}
                                onClick={(e) => {
                                    // Evitar que el botón mantenga el foco después de hacer clic
                                    e.currentTarget.blur();
                                    abrirConfirmDes();
                                }}
                            >
                                {EstadoComp === 2 || EstadoComp === 3 ? "Activar Usuario" : "Desactivar Usuario"}
                            </Button>

                        </Box>
                    </Item>
                    
                </Box>
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
            <CardReestrablecerContra
                open={dialogo === "reestrablecerContra"}
                onClose={cerrar}
                nombreUsuario={perfil.usuario?.usuario}
            />
            <Confirm
                open={dialogo === "confirmDesactivar"}
                handleClose={cerrar}
                onConfirm={handleActEstado}
                title="Desactivar Cambios"
                content="¿Esta seguro que desea deshabilitar el usuario?"
            >
                {/* contenido */}
            </Confirm>
        </React.Fragment>
    );
}

