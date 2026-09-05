import { useState, useEffect } from 'react';
import { Box, Typography, TextField, Stack } from "@mui/material";
import { alpha } from '@mui/material/styles';
import { useFecha } from './../../hooks/useFecha';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
// personalizados
import AppButton from './../../../../shared/components/AppButton';
// iconos
import PersonOffIcon from '@mui/icons-material/PersonOff';
import PersonIcon from '@mui/icons-material/Person';
import LockClockIcon from '@mui/icons-material/LockClock';

import { useNotificacionContext } from './../../../../providers/Notificacion/useNotificacionContext';
import Confirm from './../../../../shared/components/Confirm';
function CardCuenta({ perfil, abrirConfirmDes, EstadoComp, reload }) {

    // Estado para controlar el diálogo de actualización de fecha
    const [dialogo, setDialogo] = useState(null);

    // Notificaciones
    const { mostrarNotificacion } = useNotificacionContext();
    // Funciones para manejo de fechas
    const { obtenerFechaActual, tiempoRestante, convertirFecha, esMayor, actualizarFechaExpiracion } = useFecha();

    // datos para las cajas de selecciones 
    const [fecha, setFecha] = useState("");

    // Convertir fecha de perfil a formato YYYY-MM-DD para comparación
    const fechaPerfil = perfil.usuario?.fechaExpiracion
        ? convertirFecha(perfil.usuario.fechaExpiracion)
        : "";

    useEffect(() => {
        const cargarFecha = () => {
            setFecha(perfil.usuario?.fechaExpiracion ? convertirFecha(perfil.usuario.fechaExpiracion) : obtenerFechaActual());
        };
        cargarFecha();

    }, [perfil.usuario?.fechaExpiracion, convertirFecha, obtenerFechaActual]);

    const abrirConfirmExp = () => setDialogo("confirmExpiracion");
    const cerrarModal = () => setDialogo(null);

    const handleConfirmarExpiracion = async () => {
        try {

            const response = await actualizarFechaExpiracion(perfil.usuario?.id, fecha);

            if (response.status === 200) {
                await reload();
            }
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
        cerrarModal();
    }

    return (
        <Box>
            <Stack spacing={2}>
                <AppButton
                    colorBtn={EstadoComp === 2 || EstadoComp === 3 ? "primary" : "error"}
                    iconBtn={EstadoComp === 2 || EstadoComp === 3 ? <PersonIcon /> : <PersonOffIcon />}
                    isfullWidth={true}
                    content={EstadoComp === 2 || EstadoComp === 3 ? "Activar Usuario" : "Desactivar Usuario"}
                    onClick={(e) => {
                        // Evitar que el botón mantenga el foco después de hacer clic
                        e.currentTarget.blur();
                        abrirConfirmDes();
                    }}
                />

                <TextField
                    type="date"
                    label="Fecha de Expiración"
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                />

                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        bgcolor: alpha('#ed6c02', 0.12),
                        border: '1px solid',
                        borderColor: '#ed6c02',
                        borderRadius: 2,
                        px: 1.5,
                        py: 1
                    }}
                >
                    <LockClockIcon fontSize="small" color="warning" />

                    <Typography variant="body2">
                        <strong>Tiempo actual restante:</strong> {tiempoRestante(perfil.usuario?.fechaExpiracion)}
                    </Typography>
                </Box>

                {fecha && fecha !== fechaPerfil ? (
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            bgcolor: alpha('#1565C0', 0.08),
                            border: '1px solid',
                            borderColor: 'primary.main',
                            borderRadius: 2,
                            px: 1.5,
                            py: 1
                        }}
                    >
                        <LockClockIcon fontSize="small" color="primary" />

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
            </Stack>

            <Confirm
                open={dialogo === "confirmExpiracion"}
                handleClose={cerrarModal}
                onConfirm={handleConfirmarExpiracion}
                title="Confirmar cambio"
                content="¿Estás seguro de que deseas actualizar la fecha de expiración? Esta acción no se puede deshacer.?"
            >
                {/* contenido */}
            </Confirm>
        </Box>

    );
}

export default CardCuenta;