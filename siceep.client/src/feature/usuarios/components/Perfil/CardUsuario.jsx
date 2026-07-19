import { useState, useEffect } from 'react';
<<<<<<< HEAD:siceep.client/src/feature/usuarios/components/Perfil/CardUsuario.jsx
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
=======
import { Box, Typography, Divider, Avatar, Grid, Paper, Chip, Stack } from "@mui/material";
import WorkIcon from '@mui/icons-material/Work';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LockClockIcon from '@mui/icons-material/LockClock';
import PersonOffIcon from '@mui/icons-material/PersonOff';
import PersonIcon from '@mui/icons-material/Person';
import TextField from '@mui/material/TextField';

// Componentes compartidos
import SelectItem from './../../../shared/components/SelectItem';
import Confirm from './../../../shared/components/Confirm';
import AppButton from './../../../shared/components/AppButton';
import CardReestrablecerContra from './CardReestrablecerContra';

// Servicios y Hooks
import { useNotificacionContext } from '../../../providers/Notificacion/useNotificacionContext';
import { useBusquedaContext } from './../../../providers/BusquedaUsers/useBusquedaContext';
import { usePermisosContext } from './../../../providers/Permisos/usePermisoContext';
import { usePerfil } from '../hooks/usePerfil';
import { useSelectRoles } from "../hooks/useSelectRoles";
import { useFecha } from '../hooks/useFecha';
import { useRol } from '../hooks/useRol';
import { useUsuarios } from './../hooks/useUsuarios';

>>>>>>> oscarDev:siceep.client/src/feature/usuarios/components/CardUsuario.jsx
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
<<<<<<< HEAD:siceep.client/src/feature/usuarios/components/Perfil/CardUsuario.jsx

    // datos para las cajas de selecciones
=======
    const { selRol, loading } = useSelectRoles();

    // Estados locales
    const [fecha, setFecha] = useState("");
>>>>>>> oscarDev:siceep.client/src/feature/usuarios/components/CardUsuario.jsx
    const [rol, setRol] = useState("");
    const [EstadoComp, setEstadoComp] = useState();
    const [dialogo, setDialogo] = useState(null);

<<<<<<< HEAD:siceep.client/src/feature/usuarios/components/Perfil/CardUsuario.jsx
    // Funciones para abrir los diálogos de confirmación
=======
    // =================================================================
    // 🛠️ SOLUCIÓN AL BUCLE INFINITO (Freeze)
    // Un solo useEffect que depende EXCLUSIVAMENTE del ID del usuario.
    // =================================================================
    useEffect(() => {
        if (perfil?.usuario?.id) {
            setEstadoComp(perfil.usuario.estado);
            setRol(perfil.usuario.idRol || "");
            setFecha(perfil.usuario.fechaExpiracion ? convertirFecha(perfil.usuario.fechaExpiracion) : obtenerFechaActual());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [perfil?.usuario?.id]);

    // Funciones de diálogo
    const abrirConfirmExp = () => setDialogo("confirmExpiracion");
>>>>>>> oscarDev:siceep.client/src/feature/usuarios/components/CardUsuario.jsx
    const abrirConfirmRol = () => setDialogo("confirmRol");
    const abrirConfirmDes = () => setDialogo("confirmDesactivar");
    const abrirReestrablecerContra = () => setDialogo("reestrablecerContra");
    const cerrar = () => setDialogo(null);
<<<<<<< HEAD:siceep.client/src/feature/usuarios/components/Perfil/CardUsuario.jsx
    
    useEffect(() => {
        const cargarEstado = () => {
            setEstadoComp(perfil.usuario?.estado);
        };
        cargarEstado();

    }, [perfil.usuario?.estado]);
=======

    const fechaPerfil = perfil.usuario?.fechaExpiracion ? convertirFecha(perfil.usuario.fechaExpiracion) : "";

    const handleConfirmarExpiracion = async () => {
        try {
            await actualizarFechaExpiracion(perfil.usuario?.id, fecha);
            mostrarNotificacion({ message: "Fecha de expiración actualizada correctamente", severity: "success" });
        } catch (error) {
            mostrarNotificacion({ message: "Error al actualizar la fecha: " + error, severity: "error" });
        }
        cerrar();
    };
>>>>>>> oscarDev:siceep.client/src/feature/usuarios/components/CardUsuario.jsx

    const handleConfirmarRol = async () => {
        try {
            await actualizarRol(perfil.usuario?.id, rol);
            mostrarNotificacion({ message: "Rol actualizado correctamente", severity: "success" });
            await permisosHook.refetch();
        } catch {
            mostrarNotificacion({ message: "Error al actualizar el rol", severity: "error" });
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
        <Box sx={{ flexGrow: 1, mb: 3 }}>
            {/* =================================================================
                🛠️ SOLUCIÓN AL DISEÑO APLASTADO
                Uso de Grid item xs={12} md={3} para crear 4 columnas perfectas
                ================================================================= */}
            <Grid container spacing={3}>

<<<<<<< HEAD:siceep.client/src/feature/usuarios/components/Perfil/CardUsuario.jsx
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

                                        <Box display="flex" alignItems="baseline">
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    fontWeight: 700,
                                                    color: '#1565C0',
                                                    minWidth: '100px',
                                                    fontSize: '0.85rem'
                                                }}
                                            >
                                                Ubicado en:
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: '#424242', fontWeight: 500 }}>
                                                {perfil.estructura}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>
=======
                {/* 1. TARJETA: INFORMACIÓN DEL USUARIO */}
                <Grid item xs={12} md={3}>
                    <Paper elevation={2} sx={{ p: 3, height: '100%', borderRadius: 2, display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="subtitle2" color="primary" sx={{ mb: 2, fontWeight: 'bold' }}>
                            INFORMACIÓN DEL USUARIO
                        </Typography>
                        <Box display="flex" alignItems="center" sx={{ mb: 2 }}>
                            <Avatar src="/image/default-user.jpg" sx={{ width: 64, height: 64, mr: 2, boxShadow: 1 }} />
                            <Box>
                                <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a1a1a', lineHeight: 1.2 }}>
                                    {perfil.usuario?.usuario || 'Cargando...'}
                                </Typography>
                                <Box sx={{ mt: 0.5 }}>{obtenerEstado(EstadoComp)}</Box>
>>>>>>> oscarDev:siceep.client/src/feature/usuarios/components/CardUsuario.jsx
                            </Box>
                        </Box>
                        <Divider sx={{ my: 1 }} />
                        <Typography variant="caption" color="primary" fontWeight="bold">Propietario:</Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>{perfil.usuario?.propietario || 'No asignado'}</Typography>

                        <Typography variant="caption" color="primary" fontWeight="bold">Ubicado en:</Typography>
                        <Typography variant="body2">{perfil.estructura || 'No asignado'}</Typography>
                    </Paper>
                </Grid>
<<<<<<< HEAD:siceep.client/src/feature/usuarios/components/Perfil/CardUsuario.jsx
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
=======

                {/* 2. TARJETA: ROL */}
                <Grid item xs={12} md={3}>
                    <Paper elevation={2} sx={{ p: 3, height: '100%', borderRadius: 2, display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="subtitle2" color="primary" sx={{ mb: 2, fontWeight: 'bold' }}>
                            ROL DEL SISTEMA
                        </Typography>
                        {loading ? (
                            <Typography variant="body2">Cargando roles...</Typography>
                        ) : (
                            <Box sx={{ mt: 'auto', mb: 'auto' }}>
                                <Box sx={{ mb: 3 }}>
                                    <SelectItem
                                        value={rol}
                                        onChange={(nuevoRol) => setRol(nuevoRol)}
                                        incluirTodo={false}
                                        datos={selRol}
                                        titulo=""
                                    />
                                </Box>
                                <AppButton
                                    colorBtn="primary"
                                    iconBtn={<WorkIcon />}
                                    isfullWidth={true}
                                    content="Actualizar Rol"
                                    onClick={(e) => {
                                        e.currentTarget.blur();
                                        abrirConfirmRol();
                                    }}
                                />
                            </Box>
                        )}
                    </Paper>
                </Grid>

                {/* 3. TARJETA: CUENTA Y EXPIRACIÓN */}
                <Grid item xs={12} md={3}>
                    <Paper elevation={2} sx={{ p: 3, height: '100%', borderRadius: 2, display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="subtitle2" color="primary" sx={{ mb: 2, fontWeight: 'bold' }}>
                            CUENTA Y VIGENCIA
                        </Typography>

                        <Box sx={{ mb: 2 }}>
                            <AppButton
                                colorBtn={EstadoComp === 2 || EstadoComp === 3 ? "primary" : "error"}
                                iconBtn={EstadoComp === 2 || EstadoComp === 3 ? <PersonIcon /> : <PersonOffIcon />}
                                isfullWidth={true}
                                content={EstadoComp === 2 || EstadoComp === 3 ? "Activar Usuario" : "Desactivar Usuario"}
                                onClick={(e) => {
                                    e.currentTarget.blur();
                                    abrirConfirmDes();
                                }}
                            />
                        </Box>

                        <TextField
                            type="date"
                            label="Fecha de Expiración"
                            value={fecha}
                            onChange={(e) => setFecha(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                            size="small"
                            sx={{ mb: 2 }}
                        />

                        <Box display="flex" alignItems="center" sx={{ mb: 2 }}>
                            <LockClockIcon sx={{ mr: 1, fontSize: 20, color: 'text.secondary' }} />
                            <Typography variant="caption" color="text.secondary">
                                Restante: {tiempoRestante(perfil.usuario?.fechaExpiracion)}
                            </Typography>
                        </Box>

                        <Box sx={{ mt: 'auto' }}>
                            <AppButton
                                colorBtn="primary"
                                iconBtn={<CalendarTodayIcon />}
                                isfullWidth={true}
                                content="Actualizar Fecha"
                                onClick={(e) => {
                                    e.currentTarget.blur();
                                    esMayor(perfil.usuario?.fechaExpiracion, fecha);
                                    abrirConfirmExp();
                                }}
                            />
                        </Box>
                    </Paper>
                </Grid>

                {/* 4. TARJETA: SEGURIDAD */}
                <Grid item xs={12} md={3}>
                    <Paper elevation={2} sx={{ p: 3, height: '100%', borderRadius: 2, display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="subtitle2" color="primary" sx={{ mb: 2, fontWeight: 'bold' }}>
                            SEGURIDAD
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                            Forzar al usuario a reestablecer su contraseña mediante un enlace seguro.
                        </Typography>
                        <Box sx={{ mt: 'auto' }}>
                            <AppButton
                                colorBtn="secondary"
                                iconBtn={<LockClockIcon />}
                                isfullWidth={true}
                                content="Reestablecer Contraseña"
                                onClick={(e) => {
                                    e.currentTarget.blur();
                                    abrirReestrablecerContra();
                                }}
                            />
                        </Box>
                    </Paper>
                </Grid>

>>>>>>> oscarDev:siceep.client/src/feature/usuarios/components/CardUsuario.jsx
            </Grid>

            {/* =================================================================
                MODALES Y DIÁLOGOS DE CONFIRMACIÓN
                ================================================================= */}
            <Confirm
<<<<<<< HEAD:siceep.client/src/feature/usuarios/components/Perfil/CardUsuario.jsx
=======
                open={dialogo === "confirmExpiracion"}
                handleClose={cerrar}
                onConfirm={handleConfirmarExpiracion}
                title="Confirmar cambio"
                content="¿Estás seguro de que deseas actualizar la fecha de expiración? Esta acción no se puede deshacer."
            />
            <Confirm
>>>>>>> oscarDev:siceep.client/src/feature/usuarios/components/CardUsuario.jsx
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
<<<<<<< HEAD:siceep.client/src/feature/usuarios/components/Perfil/CardUsuario.jsx
                title="Desactivar Cambios"
                content="¿Esta seguro que desea deshabilitar el usuario?"
            >
                {/* contenido */}
            </Confirm>
=======
                title={EstadoComp === 2 || EstadoComp === 3 ? "Activar Usuario" : "Desactivar Usuario"}
                content={`¿Está seguro que desea ${EstadoComp === 2 || EstadoComp === 3 ? 'activar' : 'deshabilitar'} este usuario?`}
            />
            <CardReestrablecerContra
                open={dialogo === "reestrablecerContra"}
                onClose={cerrar}
                id={perfil.usuario?.id}
            />
>>>>>>> oscarDev:siceep.client/src/feature/usuarios/components/CardUsuario.jsx
        </Box>
    );
}

export default CardUsuario;