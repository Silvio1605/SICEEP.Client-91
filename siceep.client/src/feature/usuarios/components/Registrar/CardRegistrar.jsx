import React, { useState, useCallback } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import { Typography, Paper } from "@mui/material";
import Grid from '@mui/material/Grid';

// iconos
import PersonAddIcon from '@mui/icons-material/PersonAdd';
// Importar el componente SelectItem
import SelectItem from '../../../../shared/components/SelectItem';
// importar el hook useSelectRoles para obtener los roles disponibles
import { useRegistrar } from "../../hooks/useRegistrar";
// Importar el componente de búsqueda de propietario
import BusquedaPropietario from '../BusquedaPropietario';
import { useNotificacionContext } from '../../../../providers/Notificacion/useNotificacionContext';
// componentes personalizados
import AppInput from '../../../../shared/components/AppInput';
import AppButton from '../../../../shared/components/AppButton';
import { Box } from "@mui/material";
import LinearProgress from '@mui/material/LinearProgress';
// componentes del formulario
import DatosPropietario from './DatosPropietario';
import DatosCuenta from './DatosCuenta';


export default function CardRegistrar({ open, onClose }) {

    // datos para las cajas de selecciones
    const { nuevoUsuario } = useRegistrar();

    // Notificaciones
    const { mostrarNotificacion } = useNotificacionContext();
    const [guardando, setGuardando] = useState(false);

    const [registro, setRegistro] = useState({
        idPropietario: '',
        nombrePropietario: '',
        nombreUsuario: '',
        rol:2,
        contrasena: '',
        contrasenaConfirmacion: '',
        fechaExpiracion: '',
    })

    const seleccionarPropietario = useCallback((propietario) => {
        setRegistro(prev => ({
            ...prev,
            idPropietario: propietario.codigo,
            nombrePropietario: propietario.nombreCompleto,
        }));
    }, []);

    // Configuración para el diálogo responsivo
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    // Estado para controlar la apertura del diálogo de búsqueda de propietario
    const [openBusqueda, setOpenBusqueda] = React.useState(false);

    // Función para manejar la búsqueda de propietario (puede ser implementada según las necesidades)
    const handleBuscarPropietario = () => {
        setOpenBusqueda(true);
    };

    const handleClose = () => {
        setOpenBusqueda(false);
    };

    const limpiar = () => {
        setRegistro({
            idPropietario: '',
            nombrePropietario: '',
            nombreUsuario: '',
            rol: 2,
            contrasena: '',
            contrasenaConfirmacion: '',
            fechaExpiracion: '',
        });
    };

    const handleRegistrar = async () => {

        setGuardando(true);

        if (registro.idPropietario === 0 || 
            registro.contrasena === "" ||
            registro.contrasenaConfirmacion === "" ||
            registro.fechaExpiracion === "") {
            mostrarNotificacion({
                message: "Complete los datos del formulario",
                severity: "warning",
            });
            setGuardando(false);
            return;
        }

        if (registro.contrasena !== registro.contrasenaConfirmacion) {
            mostrarNotificacion({
                message: "Las contraseñas no coinciden",
                severity: "error",
            });
            setGuardando(false);
            return;
        }

        const result = await nuevoUsuario(registro);

        setGuardando(false);
        if (result.status === 200) {
            mostrarNotificacion({
                message: result.message,
                severity: "success"
            });
            limpiar();
            onClose();
        } else {
            mostrarNotificacion({
                message: result.message,
                severity: "error"
            });
        }
        
    };

    return (
        <React.Fragment>
            <Dialog
                fullScreen={fullScreen}
                open={open}
                onClose={onClose}
                fullWidth
                maxWidth="md"
                disableAutoFocus
            >
                <DialogTitle sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    borderBottom: 1,
                    borderColor: 'divider'
                }}>
                    <PersonAddIcon color="primary" />
                    Registrar Usuario
                </DialogTitle>
                <DialogContent>
                    <DatosPropietario registro={registro} handleBuscarPropietario={handleBuscarPropietario}></DatosPropietario>

                    <DatosCuenta registro={registro} setRegistro={setRegistro}></DatosCuenta>
                   
                    <Typography
                        variant="subtitle2"
                        sx={{
                            mt: 2,
                            mb: 1,
                            color: 'primary.main',
                            fontWeight: 600
                        }}
                    >
                        Vigencia
                    </Typography>

                    <AppInput
                        id="fechaExpiracion"
                        label="Fecha de Expiración"
                        value={registro.fechaExpiracion ?? ''}
                        isReadOnly={false}
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        onChange={(e) => setRegistro({ ...registro, fechaExpiracion: e.target.value })}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button onClick={handleRegistrar} disabled={guardando}>
                        {guardando ? "Guardando..." : "Guardar"}
                    </Button>
                </DialogActions>
                {guardando == true && (
                    <Box sx={{ width: '100%' }}>
                        <LinearProgress aria-label="Loading…" />
                    </Box>
                )}
            </Dialog>

            <BusquedaPropietario
                open={openBusqueda}
                onClose={handleClose}
                onSeleccionar={seleccionarPropietario}
                OriginRegistro={true}
            />
        </React.Fragment>
    );
}
