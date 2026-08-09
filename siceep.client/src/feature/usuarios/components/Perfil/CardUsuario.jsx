import { useState, useEffect } from 'react';
import { Box, Typography, Divider } from "@mui/material";
import { styled } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import LockClockIcon from '@mui/icons-material/LockClock';
import Confirm from '../../../../shared/components/Confirm';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
// servicios
import { useNotificacionContext } from '../../../../providers/Notificacion/useNotificacionContext';
import { useBusquedaContext } from '../../../../providers/BusquedaUsers/useBusquedaContext';
import { usePerfil } from '../../hooks/usePerfil';
import { usePermisosContext } from '../../../../providers/Permisos/usePermisoContext';
import { useRol } from '../../hooks/useRol';
import { useUsuarios } from '../../hooks/useUsuarios';
import AppButton from '../../../../shared/components/AppButton';
import CardRol from './CardRol';
import CardCuenta from './CardCuenta';
import CardReestablecer from './CardReestablecer';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'left',
    color: (theme.vars ?? theme).palette.text.secondary,
    ...theme.applyStyles('dark', {
        backgroundColor: '#1A2027',
    }),
}));

const obtenerEstado = (estado) => {
    switch (estado) {
        case 1:
            return <Chip label="Activo" color="success" size="small" sx={{ fontWeight: 'bold' }} />;
        case 2:
            return <Chip label="Inactivo" color="error" size="small" sx={{ fontWeight: 'bold' }} />;
        case 3:
            return <Chip label="Expirado" color="warning" size="small" sx={{ fontWeight: 'bold' }} />;
        default:
            return <Chip label="Desconocido" size="small" />;
    }
};

function CardUsuario({ actualizar }) {
    // Funciones para manejo de fechas
    const { permisosHook } = usePermisosContext();
    const { actualizarRol } = useRol();
    const { idSeleccionado } = useBusquedaContext();
    const { perfil, reload } = usePerfil(idSeleccionado);
    const { ActualizarEstado } = useUsuarios();
    const { mostrarNotificacion } = useNotificacionContext();

    // datos para las cajas de selecciones
    const [rol, setRol] = useState("");
    const [EstadoComp, setEstadoComp] = useState();
    const [dialogo, setDialogo] = useState(null);

    // Funciones para abrir los diálogos de confirmación
    const abrirConfirmRol = () => setDialogo("confirmRol");
    const abrirConfirmDes = () => setDialogo("confirmDesactivar");
    const abrirReestrablecerContra = () => setDialogo("reestrablecerContra");
    const cerrar = () => setDialogo(null);

    useEffect(() => {
        const cargarEstado = () => {
            setEstadoComp(perfil.usuario?.estado);
        };
        cargarEstado();

    }, [perfil.usuario?.estado]);

    const handleConfirmarRol = async () => {
        try {
            await actualizarRol(perfil.usuario?.id, rol);
            mostrarNotificacion({ message: "Rol actualizado correctamente", severity: "success" });
            await permisosHook.refetch();
        } catch {
            mostrarNotificacion({
                message: "Error al actualizar el rol",
                severity: "error",
            });
        }
        cerrar();
    };

    const handleActEstado = async () => {
        try {
            await ActualizarEstado(perfil.usuario?.id, perfil.usuario?.estado);
            const esActivacion = perfil.usuario?.estado === 2 || perfil.usuario?.estado === 3;
            mostrarNotificacion({
                message: esActivacion ? "Usuario activado correctamente" : "Usuario deshabilitado correctamente",
                severity: "success"
            });

            await permisosHook.refetch();
            setEstadoComp(esActivacion ? 1 : 3);
            await reload();
            await actualizar();
        } catch (error) {
            mostrarNotificacion({ message: error.message ?? "Error al actualizar el estado", severity: "error" });
        }
        cerrar();
    };

    return (

        // Información del Usuario
        <Box sx={{ flexGrow: 1, mb: 1 }}>
            <Grid container spacing={2}>
                <Grid size={12}>
                    <Box
                        sx={{
                            bgcolor: "background.paper",
                            borderBottom: 1,
                            borderColor: "divider",
                            boxShadow: 2,
                            px: 4,
                            pb: 1,
                            pt: 1,
                            mb: 2,
                            borderRadius: '12px 12px 0 0',
                        }}
                    >
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 700,
                                color: '#1565C0',
                                letterSpacing: '0.5px',
                                textTransform: 'uppercase',
                                fontSize: '1rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                '&::before': {
                                    content: '""',
                                    width: '4px',
                                    height: '20px',
                                    backgroundColor: '#1565C0',
                                    borderRadius: '2px',
                                    display: 'inline-block',
                                }
                            }}
                        >
                            Información del Usuario
                        </Typography>
                    </Box>
                    <Item>
                        <Box sx={{
                            p: 2,
                            bgcolor: 'background.paper',
                            borderRadius: '0 0 12px 12px',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                boxShadow: 3,
                            }
                        }}>
                            <Box display="flex" alignItems="center" sx={{ pl: 1 }}>

                                {/* Avatar */}
                                <Avatar
                                    alt="user"
                                    src="/image/default-user.jpg"
                                    sx={{
                                        width: 80,
                                        height: 80,
                                        border: '3px',
                                        boxShadow: 2
                                    }}
                                />

                                {/* Textos */}
                                <Box sx={{ ml: 3, flex: 1 }}>
                                    <Box sx={{ mb: 1.5 }}>
                                        <Stack spacing={1} sx={{ alignItems: 'flex-start' }}>
                                            <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
                                                <Typography variant="h5" sx={{ fontWeight: 700, color: '#1a1a1a' }}>
                                                    {perfil.usuario?.usuario}
                                                </Typography>
                                                {obtenerEstado(EstadoComp)}
                                            </Stack>
                                        </Stack>
                                    </Box>

                                    <Divider sx={{ my: 1.5 }} />

                                    <Box sx={{ mt: 1.5 }}>
                                        <Box display="flex" alignItems="baseline" sx={{ mb: 1 }}>
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    fontWeight: 700,
                                                    color: '#1565C0',
                                                    minWidth: '100px',
                                                    fontSize: '0.85rem'
                                                }}
                                            >
                                                Propietario:
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: '#424242', fontWeight: 500 }}>
                                                {perfil.usuario?.propietario}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                        <Typography variant="caption" color="primary" fontWeight="bold">Ubicado en:</Typography>
                        <Typography variant="body2">{perfil.estructura || 'No asignado'}</Typography>
                    </Item>
                </Grid>
                <Grid size={12}>
                    <Item>
                        <CardRol abrirConfirmRol={abrirConfirmRol} rol={rol} setRol={setRol}></CardRol>
                    </Item>
                </Grid>
                <Grid size={12}>
                    <Item>
                        <CardCuenta perfil={perfil} reload={reload} abrirConfirmDes={abrirConfirmDes} EstadoComp={EstadoComp} ></CardCuenta>
                    </Item>
                </Grid>
                <Grid size={12}>
                    <Item>
                        <CardReestablecer perfil={perfil} abrirReestrablecerContra={abrirReestrablecerContra} dialogo={dialogo} cerrar={cerrar}></CardReestablecer>
                    </Item>
                </Grid>
            </Grid>

            <Confirm
                open={dialogo === "confirmRol"}
                handleClose={cerrar}
                onConfirm={handleConfirmarRol}
                title="Confirmar cambio"
                content="¿Estás seguro de que deseas actualizar el rol del usuario? Esta acción no se puede deshacer."
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
        </Box>
    );
}

export default CardUsuario;