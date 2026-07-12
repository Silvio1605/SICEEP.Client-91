import { useState, useEffect } from 'react';
import { Box, Typography, Divider } from "@mui/material";
import { useFecha } from './../../hooks/useFecha';
import TextField from '@mui/material/TextField';
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
              content={EstadoComp === 2 || EstadoComp === 3 ? "Activar Usuario" : "Desactivar Usuario"}
              onClick={(e) => {
                  // Evitar que el botón mantenga el foco después de hacer clic
                  e.currentTarget.blur();
                  abrirConfirmDes();
              }}
          />
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