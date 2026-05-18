import { useState, useEffect } from 'react';
import { Box, Typography, Divider } from "@mui/material";
import { styled } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import WorkIcon from '@mui/icons-material/Work';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LockClockIcon from '@mui/icons-material/LockClock';
import PersonOffIcon from '@mui/icons-material/PersonOff';
import PersonIcon from '@mui/icons-material/Person';
import SelectItem from './../../../shared/components/SelectItem';
import { Button } from '@mui/material';
import TextField from '@mui/material/TextField';
import Confirm from './../../../shared/components/Confirm';
// servicios
import { useNotificacionContext } from '../../../providers/Notificacion/useNotificacionContext';
import { useBusquedaContext } from './../../../providers/BusquedaUsers/useBusquedaContext';
import { usePerfil } from '../hooks/usePerfil';
import { useSelectRoles } from "../hooks/useSelectRoles";
import { usePermisosContext } from './../../../providers/Permisos/usePermisoContext'; 
import { useFecha } from '../hooks/useFecha';
import { useRol } from '../hooks/useRol';
import { useUsuarios } from './../hooks/useUsuarios';

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

function CardUsuario() {

    // Funciones para manejo de fechas
    const { obtenerFechaActual, tiempoRestante, convertirFecha, esMayor, actualizarFechaExpiracion } = useFecha();
    const { permisosHook } = usePermisosContext();
    const { actualizarRol } = useRol();

    const { idSeleccionado } = useBusquedaContext();
    const { perfil } = usePerfil(idSeleccionado);

    // Notificaciones
    const { mostrarNotificacion } = useNotificacionContext();

    // datos para las cajas de selecciones
    const { selRol, loading } = useSelectRoles();
    const [fecha, setFecha] = useState("");
    const [rol, setRol] = useState("");

    // Estado para controlar el diálogo de actualización de fecha
    const [dialogo, setDialogo] = useState(null);
    
    const { ActualizarEstado } = useUsuarios();

    // Funciones para abrir los diálogos de confirmación
    const abrirConfirmExp = () => setDialogo("confirmExpiracion");
    const abrirConfirmDes = () => setDialogo("confirmDesactivar");
    const abrirConfirmRol = () => setDialogo("confirmRol");

    const cerrar = () => setDialogo(null);
    
    // Convertir fecha de perfil a formato YYYY-MM-DD para comparación
    const fechaPerfil = perfil.usuario?.fechaExpiracion
        ? convertirFecha(perfil.usuario.fechaExpiracion)
        : "";

    useEffect(() => {
        const cargarFecha = () => {
            setFecha(perfil.usuario?.fechaExpiracion ? convertirFecha(perfil.usuario.fechaExpiracion) : obtenerFechaActual());
        };
        cargarFecha();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [perfil.usuario?.fechaExpiracion]);

    useEffect(() => {
        const cargarRol = () => {
            setRol(perfil.usuario?.idRol || "");
        };
        cargarRol();
    }, [perfil.usuario?.idRol]);

    const handleConfirmarExpiracion = async () => {
        try {
            await actualizarFechaExpiracion(perfil.usuario?.id, fecha);

            mostrarNotificacion({
                message: "Fecha de expiración actualizada correctamente",
                severity: "success",
            });

        } catch (error) {
            mostrarNotificacion({
                message: "Error al actualizar la fecha de expiración: " + error,
                severity: "error",
            });
        }
        cerrar();
    }

    const handleConfirmarRol = async () => {

        try {
            await actualizarRol(perfil.usuario?.id, rol);

            mostrarNotificacion({
                message: "Rol actualizado correctamente",
                severity: "success",
            });

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

            mostrarNotificacion({
                message: perfil.usuario?.estado === 2 || perfil.usuario?.estado === 3 ? "Usuario activado correctamente" : "Usuario deshabilitado correctamente",
                severity: "success",
            });

            await permisosHook.refetch();
        } catch {
            mostrarNotificacion({
                message: perfil.usuario?.estado === 2 || perfil.usuario?.estado === 3 ? "Error al activar el usuario" : "Error al deshabilitar el usuario",
                severity: "error",
            });
        }
        cerrar();
    };
    
    return (
        // Información del Usuario
        <Box sx={{ flexGrow: 1, mb: 1 }}>
            <Grid container spacing={2}>
                <Grid size={12}>
                    <Item>
                        <Box sx={{ p: 1, bgcolor: "background.default" }}>
                            <Box display="flex" alignItems="center" sx={{ pl: 1 }}>

                                {/* Avatar */}
                                <Avatar alt="user" src="/image/default-user.jpg" />

                                {/* Textos */}
                                <Box sx={{ ml: 2 }}>
                                    <Typography variant="h5">
                                        <strong>{perfil.usuario?.usuario}</strong>
                                    </Typography>
                                    <Divider />
                                    <Typography variant="body2" sx={{ pt: 1 }}>
                                        <strong>Propietario: </strong> {perfil.usuario?.propietario}
                                    </Typography>
                                    
                                    <Typography variant="body2" sx={{ pt: 1 }}>
                                        <strong>Ubicado en:</strong> {perfil.estructura?.estructura}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Item>
                </Grid>

                <Grid size={12}>
                    <Item>
                        {loading ? (
                            <p>Cargando...</p>
                        ) : (
                            <Box>
                                <Button
                                    fullWidth
                                    sx={{ mt: 2 }}
                                    variant="contained"
                                    color={perfil.usuario?.estado === 2 || perfil.usuario?.estado === 3 ? "primary" : "error"}
                                    startIcon={perfil.usuario?.estado === 2 || perfil.usuario?.estado === 3 ? <PersonIcon /> : <PersonOffIcon />}
                                    onClick={(e) => {
                                        // Evitar que el botón mantenga el foco después de hacer clic
                                        e.currentTarget.blur();
                                        abrirConfirmDes();
                                    }}
                                >
                                        {perfil.usuario?.estado === 2 || perfil.usuario?.estado === 3 ? "Activar Usuario" : "Desactivar Usuario"}
                                </Button>

                            </Box>
                        )}
                    </Item>
                </Grid>

                <Grid size={12}>
                    <Item>
                        {loading ? (
                            <p>Cargando...</p>
                        ) : (
                            <Box>
                                   <SelectItem
                                        value={rol}
                                        onChange={(selRol) => {
                                            setRol(selRol);
                                        }}
                                        incluirTodo={false}
                                        datos={selRol}
                                        titulo="Rol Actual"
                                    />
                                    <Button
                                        fullWidth
                                        sx={{ mt: 2 }}
                                        variant="contained"
                                        color="primary"
                                        startIcon={<WorkIcon />}
                                        onClick={(e) => {
                                            // Evitar que el botón mantenga el foco después de hacer clic
                                            e.currentTarget.blur();
                                            abrirConfirmRol();
                                        }}
                                    >
                                        Actualizar Rol
                                    </Button>
                            </Box>
                        )}
                    </Item>
                </Grid>
                <Grid size={12}>
                    <Item>
                        {loading ? (
                            <p>Cargando...</p>
                        ) : (
                            <Box>
                                <TextField
                                     type="date"
                                     label="Fecha de Expiración"
                                     value={fecha}
                                     onChange={(e) => setFecha(e.target.value)}
                                     InputLabelProps={{ shrink: true }}
                                     fullWidth
                                />
                                <Box display="flex" alignItems="center" sx={{ ml: 3, pb: 1, pt: 1 }}>
                                     <LockClockIcon sx={{ mr: 1 }} />

                                     <Typography variant="body2">
                                          <strong>Tiempo actual restante:</strong> {tiempoRestante(perfil.usuario?.fechaExpiracion)}
                                     </Typography>
                                </Box>
                                    {fecha && fecha !== fechaPerfil ? (
                                        <Box display="flex" alignItems="center" sx={{ ml: 3, pb: 1, pt: 1 }}>
                                            <LockClockIcon sx={{ mr: 1, color: 'primary.main' }} />

                                            <Typography variant="body2" sx={{ color: 'primary.main' }}>
                                                <strong>Tiempo nuevo periodo:</strong> {tiempoRestante(fecha)}
                                            </Typography>
                                        </Box>

                                    ) : ""}
                                   
                                <Button
                                    fullWidth
                                    sx={{ mt: 2 }}
                                    variant="contained"
                                    color="primary"
                                        startIcon={<CalendarTodayIcon />}
                                    onClick={(e) => {
                                            // Evitar que el botón mantenga el foco después de hacer clic
                                        e.currentTarget.blur();
                                        esMayor(perfil.usuario?.fechaExpiracion, fecha);
                                        abrirConfirmExp();
                                    }}
                                >
                                        Actualizar Fecha
                                </Button>

                            </Box>
                        )}
                    </Item>
                </Grid>
                
            </Grid>
            <Confirm
                open={dialogo === "confirmExpiracion"}
                handleClose={cerrar}
                onConfirm={handleConfirmarExpiracion}
                title="Confirmar cambio"
                content="¿Estás seguro de que deseas actualizar la fecha de expiración? Esta acción no se puede deshacer.?"
            >
                {/* contenido */}
            </Confirm>
            <Confirm
                open={dialogo === "confirmRol"}
                handleClose={cerrar}
                onConfirm={handleConfirmarRol}
                title="Confirmar cambio"
                content="¿Estás seguro de que deseas actualizar el rol del usuario? Esta acción no se puede deshacer.?"
            >
                {/* contenido */}
            </Confirm>
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