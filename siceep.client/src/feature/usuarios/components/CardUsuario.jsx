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
import TextField from '@mui/material/TextField';
import Confirm from './../../../shared/components/Confirm';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import CardReestrablecerContra from './CardReestrablecerContra';
// servicios
import { useNotificacionContext } from '../../../providers/Notificacion/useNotificacionContext';
import { useBusquedaContext } from './../../../providers/BusquedaUsers/useBusquedaContext';
import { usePerfil } from '../hooks/usePerfil';
import { useSelectRoles } from "../hooks/useSelectRoles";
import { usePermisosContext } from './../../../providers/Permisos/usePermisoContext'; 
import { useFecha } from '../hooks/useFecha';
import { useRol } from '../hooks/useRol';
import { useUsuarios } from './../hooks/useUsuarios';
import AppButton from './../../../shared/components/AppButton';

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

function CardUsuario({ actualizar }) {

    // Funciones para manejo de fechas
    const { obtenerFechaActual, tiempoRestante, convertirFecha, esMayor, actualizarFechaExpiracion } = useFecha();
    const { permisosHook } = usePermisosContext();
    const { actualizarRol } = useRol();
    const { idSeleccionado } = useBusquedaContext();
    const { perfil, reload } = usePerfil(idSeleccionado);

    // Notificaciones
    const { mostrarNotificacion } = useNotificacionContext();

    // datos para las cajas de selecciones
    const { selRol, loading } = useSelectRoles();
    const [fecha, setFecha] = useState("");
    const [rol, setRol] = useState("");

    const [EstadoComp, setEstadoComp] = useState();

    // Estado para controlar el diálogo de actualización de fecha
    const [dialogo, setDialogo] = useState(null);
    
    const { ActualizarEstado } = useUsuarios();

    // Funciones para abrir los diálogos de confirmación
    const abrirConfirmExp = () => setDialogo("confirmExpiracion");
    const abrirConfirmRol = () => setDialogo("confirmRol");
    const abrirConfirmDes = () => setDialogo("confirmDesactivar");
    const abrirReestrablecerContra = () => setDialogo("reestrablecerContra");

    const cerrar = () => setDialogo(null);
    
    // Convertir fecha de perfil a formato YYYY-MM-DD para comparación
    const fechaPerfil = perfil.usuario?.fechaExpiracion
        ? convertirFecha(perfil.usuario.fechaExpiracion)
        : "";

    useEffect(() => {
        const cargarEstado = () => {
            setEstadoComp(perfil.usuario?.estado);
        };
        cargarEstado();

    }, [perfil.usuario?.estado]);

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

            // recargar datos
            await permisosHook.refetch();
            const nuevoEstado = perfil.usuario?.estado === 1 ? 3 : 1;
            setEstadoComp(nuevoEstado);
            await reload();
            await actualizar();

        } catch (error) {
            mostrarNotificacion({
                message: error.message ?? "Error al actualizar el estado del usuario",
                severity: "error",
            });
        }
        cerrar();

    };

    const obtenerEstado = (estado) => {
        switch (estado) {
            case 1:
                return <Chip label="Activo" color="success" />;
            case 2:
                return <Chip label="Inactivo" color="error" />;
            case 3:
                return <Chip label="Expirado" color="warning" />;
            default:
                return <Chip label="Desconocido" />;
        }
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
                                                {perfil.estructura?.estructura}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                    </Item>
                </Grid>
                <Grid size={12}>
                    <Item>
                        <Typography
                            variant="h7"
                            sx={{
                                fontWeight: 600,
                                color: '#1565C0',
                                letterSpacing: '0.5px',
                                ml: 2 

                            }}
                        >
                            Rol
                        </Typography>

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
                                        titulo=""
                                    />
                                    <AppButton
                                        colorBtn={ 'primary' }
                                        iconBtn={<WorkIcon /> }
                                        isfullWidth={ true }
                                        content={"Actualizar Rol"}
                                        onClick={(e) => {
                                            // Evitar que el botón mantenga el foco después de hacer clic
                                            e.currentTarget.blur();
                                            abrirConfirmRol();
                                        }}
                                    />
                            </Box>
                        )}
                    </Item>
                </Grid>
                <Grid size={12}>
                    <Item>
                        <Typography
                            variant="h7"
                            sx={{
                                fontWeight: 600,
                                color: '#1565C0',
                                letterSpacing: '0.5px',
                                ml: 2
                            }}
                        >
                            Cuenta
                        </Typography>

                        <AppButton
                            colorBtn={EstadoComp === 2 || EstadoComp === 3 ? "primary" : "error"}
                            iconBtn={EstadoComp === 2 || EstadoComp === 3 ? <PersonIcon /> : <PersonOffIcon />}
                            isfullWidth={true}
                            content={ EstadoComp === 2 || EstadoComp === 3 ? "Activar Usuario" : "Desactivar Usuario"}
                            onClick={(e) => {
                                // Evitar que el botón mantenga el foco después de hacer clic
                                e.currentTarget.blur();
                                abrirConfirmDes();
                            }}
                        />
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

                                <Box display="flex" alignItems="center" sx={{ ml: 2, pb: 1, pt: 1 }}>
                                     <LockClockIcon sx={{ mr: 1 }} />

                                     <Typography variant="body2">
                                          <strong>Tiempo actual restante:</strong> {tiempoRestante(perfil.usuario?.fechaExpiracion)}
                                     </Typography>
                                </Box>
                                {fecha && fecha !== fechaPerfil ? (
                                     <Box display="flex" alignItems="center" sx={{ ml: 2, pb: 1, pt: 1 }}>
                                            <LockClockIcon sx={{ mr: 1, color: 'primary.main' }} />

                                            <Typography variant="body2" sx={{ color: 'primary.main' }}>
                                                <strong>Tiempo nuevo periodo:</strong> {tiempoRestante(fecha)}
                                            </Typography>
                                        </Box>

                                     ) : ("")
                                }

                                <AppButton
                                    colorBtn={"primary"}
                                    iconBtn={<CalendarTodayIcon />}
                                    isfullWidth={true}
                                    content={"Actualizar Fecha"}
                                    onClick={(e) => {
                                          // Evitar que el botón mantenga el foco después de hacer clic
                                         e.currentTarget.blur();
                                         esMayor(perfil.usuario?.fechaExpiracion, fecha);
                                         abrirConfirmExp();
                                    }}
                                />
                            </Box>
                        )}

                    </Item>
                </Grid>
                <Grid size={12}>
                    <Item>
                        <Typography
                            variant="h7"
                            sx={{
                                fontWeight: 600,
                                color: '#1565C0',
                                letterSpacing: '0.5px',
                                ml: 2
                            }}
                        >
                            Reestablecer Contraseña
                        </Typography>
                        <AppButton
                            colorBtn={"secondary"}
                            isfullWidth={true}
                            content={"Reestablecer Contraseña"}
                            onClick={(e) => {
                                // Evitar que el botón mantenga el foco después de hacer clic
                                e.currentTarget.blur();
                                abrirReestrablecerContra();
                            }}
                        >
                        </AppButton>  
                        
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
            <CardReestrablecerContra
                open={dialogo === "reestrablecerContra"}
                onClose={cerrar}
                id={perfil.usuario?.id}
            />
        </Box>
    );
}

export default CardUsuario;