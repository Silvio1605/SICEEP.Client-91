import { useState, useEffect } from 'react';
import { Box, Typography, Divider } from "@mui/material";
import { styled } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import WorkIcon from '@mui/icons-material/Work';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LockClockIcon from '@mui/icons-material/LockClock';
import SelectItem from './../../../shared/components/SelectItem';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import { Button } from '@mui/material';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import Confirm from './../../../shared/components/Confirm';
// servicios
import { useBusqueda } from './../hooks/useBusqueda';
import { usePerfil } from '../hooks/usePerfil'; 
import { useSelectRoles } from "../hooks/useSelectRoles";
import { useFecha } from '../hooks/useFecha';

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
    const { obtenerFechaActual, tiempoRestante, convertirFecha, esMayor } = useFecha();

    const { idSeleccionado } = useBusqueda();
    const { perfil } = usePerfil(idSeleccionado);
    const { selRol, loading } = useSelectRoles();
    const [fecha, setFecha] = useState("");

    // Estado para controlar el diálogo de actualización de fecha
    const [dialogo, setDialogo] = useState(null);

    // Funciones para abrir los diálogos de confirmación
    const abrirConfirmExp = () => setDialogo("confirmExpiracion");
    const abrirConfirmRol = () => setDialogo("confirmRol");

    const cerrar = () => setDialogo(null);

    const confirmar = () => {
        cerrar();
    };

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
                                    <SelectItem
                                        value={perfil?.usuario?.idRol}
                                        onChange={(selRol) => {
                                            console.log(selRol);
                                        }}
                                        incluirTodo={false}
                                        datos={selRol}
                                        titulo="Rol Actual"
                                    />
                                    <Button
                                        fullWidth
                                        sx={{ mt: 2 } }
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
                onConfirm={confirmar}
                title="Confirmar cambio"
                content="¿Estás seguro de que deseas actualizar la fecha de expiración? Esta acción no se puede deshacer."
            >
                {/* contenido */}
            </Confirm>
            <Confirm
                open={dialogo === "confirmRol"}
                handleClose={cerrar}
                onConfirm={confirmar}
                title="Confirmar cambio"
                content="¿Estás seguro de que deseas actualizar el rol del usuario? Esta acción no se puede deshacer."
            >
                {/* contenido */}
            </Confirm>
        </Box>
    );
}

export default CardUsuario;