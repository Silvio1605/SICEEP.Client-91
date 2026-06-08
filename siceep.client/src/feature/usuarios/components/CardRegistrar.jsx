import React, { useState, useId } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
// iconos 
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import SearchIcon from '@mui/icons-material/Search';
// Importar el componente SelectItem
import SelectItem from './../../../shared/components/SelectItem';
// importar el hook useSelectRoles para obtener los roles disponibles
import { useSelectRoles } from "./../hooks/useSelectRoles";
import { useRegistrar } from "./../hooks/useRegistrar";
// Importar el componente de búsqueda de propietario
import BusquedaPropietario from './BusquedaPropietario';
import { useNotificacionContext } from './../../../providers/Notificacion/useNotificacionContext';
// componentes personalizados
import AppInput from './../../../shared/components/AppInput';
import AppButton from './../../../shared/components/AppButton';

export default function CardRegistrar({ open, onClose }) {

    // datos para las cajas de selecciones
    const { selRol, loading } = useSelectRoles();
    const { nuevoUsuario } = useRegistrar();

    // Notificaciones
    const { mostrarNotificacion } = useNotificacionContext();

    const [registro, setRegistro] = useState({
        idPropietario: '',
        nombrePropietario: '',
        nombreUsuario: '',
        rol:2,
        contrasena: '',
        contrasenaConfirmacion: '',
        fechaExpiracion: '',
    })

    // Configuración para el diálogo responsivo
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    // Generar IDs únicos para los campos de contraseña y confirmación
    const outlinedContraId = useId();
    const outlinedConfirmdId = useId();

    // Estados para mostrar u ocultar las contraseñas
    const [MostrarContra, setMostrarContra] = useState(false);
    const [MostrarConfirm, setMostrarConfirm] = useState(false);

    // Función para manejar el clic en el ícono de mostrar/ocultar contraseña
    const handleClickMostrarContra = (setter) => {
        setter((show) => !show);
    };

    // Funciones para evitar que el botón de mostrar/ocultar contraseña tome el foco al hacer clic
    const handleMouseDownContra = (event) => {
        event.preventDefault();
    };
    const handleMouseUpContra = (event) => {
        event.preventDefault();
    };

    // Función para manejar la búsqueda de propietario (puede ser implementada según las necesidades)
    const handleBuscarPropietario = () => {
        setOpenBusqueda(true);
    };

    // Estado para controlar la apertura del diálogo de búsqueda de propietario
    const [openBusqueda, setOpenBusqueda] = React.useState(false);

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

        if (registro.idPropietario === 0) {
            mostrarNotificacion({
                message: "Seleccione un propietario",
                severity: "warning",
            });
            return;
        }

        if (registro.contrasena === "") {
            mostrarNotificacion({
                message: "Ingrese una contraseña",
                severity: "warning",
            });
            return;
        }

        if (registro.contrasenaConfirmacion === "") {
            mostrarNotificacion({
                message: "Confirme la contraseña",
                severity: "warning",
            });
            return;
        }

        if (registro.fechaExpiracion === "") {
            mostrarNotificacion({
                message: "Seleccione una fecha",
                severity: "warning",
            });
            return;
        }

        if (registro.contrasena !== registro.contrasenaConfirmacion) {
            mostrarNotificacion({
                message: "Las contraseñas no coinciden",
                severity: "error",
            });
            return;
        }

        const result = await nuevoUsuario(registro);

        if (result.status === 200) {
            mostrarNotificacion({
                message: result.message,
                severity: "success"
            });
        } else {
            mostrarNotificacion({
                message: result.message,
                severity: "error"
            });
            return;
        }

        limpiar();
        onClose();
    };

    return (
        <React.Fragment>
            <Dialog
                fullScreen={fullScreen}
                open={open}
                onClose={onClose}
                aria-labelledby="responsive-dialog-title"
                disableAutoFocus
            >
                <DialogTitle id="responsive-dialog-title">
                    {"Registrar Usuario"}
                </DialogTitle>
                <DialogContent>
                    
                    <AppButton
                        isfullWidth={true}
                        colorBtn="primary"
                        iconBtn={<SearchIcon />}
                        content="Buscar Propietario"
                        onClick={() => handleBuscarPropietario()}>
                    </AppButton>

                    <AppInput
                        id="propietarioSeleccionado"
                        label="Propietario Seleccionado"
                        value={registro.nombrePropietario ?? ''}
                        isReadOnly={true}
                    />
                    <AppInput
                        id="usuario"
                        label="Nombre de Usuario"
                        value={registro.nombreUsuario ?? ''}
                        isReadOnly={false}
                        onChange={(e) => setRegistro({ ...registro, nombreUsuario: e.target.value })}
                    />
                    {loading ? (
                        <p>Cargando...</p>
                    ) : (
                        <SelectItem
                            value={registro.rol}
                            onChange={(selRol) => {
                                setRegistro({
                                    ...registro,
                                    rol: selRol
                                });
                            }}
                            incluirTodo={false}
                            datos={selRol}
                            titulo="Rol Actual"
                        />
                    )}
                    <FormControl
                        fullWidth
                        sx={{
                            mt: 1,

                            '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                backgroundColor: 'grey.50',
                            },
                            '& .MuiInputBase-input': {
                                fontWeight: 500,
                            },
                            '& .MuiInputLabel-root': {
                                fontWeight: 600,
                            }
                        }}
                        variant="outlined">
                        <InputLabel htmlFor={`${outlinedContraId}-input`}>Contraseña</InputLabel>
                        <OutlinedInput
                            id={`${outlinedContraId}-input`}
                            type={MostrarContra ? 'text' : 'password'}
                            
                            value={registro.contrasena ?? ''}
                            onChange={(e) => setRegistro({ ...registro, contrasena: e.target.value })}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label={
                                            MostrarContra ? 'hide the password' : 'display the password'
                                        }
                                        onClick={() => handleClickMostrarContra(setMostrarContra)}
                                        onMouseDown={handleMouseDownContra}
                                        onMouseUp={handleMouseUpContra}
                                        edge="end"
                                    >
                                        {MostrarContra ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            }
                            label="Password"
                        />
                    </FormControl>
                    <FormControl fullWidth
                        sx={{
                            mt: 1,

                            '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                backgroundColor: 'grey.50',
                            },
                            '& .MuiInputBase-input': {
                                fontWeight: 500,
                            },
                            '& .MuiInputLabel-root': {
                                fontWeight: 600,
                            }
                        }}
                        variant="outlined">
                        <InputLabel htmlFor={`${outlinedConfirmdId}-input`}>Confirmar Contraseña</InputLabel>
                        <OutlinedInput
                            id={`${outlinedConfirmdId}-input`}
                            type={MostrarConfirm ? 'text' : 'password'}
                            value={registro.contrasenaConfirmacion ?? ''}
                            onChange={(e) => setRegistro({ ...registro, contrasenaConfirmacion: e.target.value })}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => handleClickMostrarContra(setMostrarConfirm)}
                                        onMouseDown={handleMouseDownContra}
                                        onMouseUp={handleMouseUpContra}
                                        edge="end"
                                    >
                                        {MostrarConfirm ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            }
                            label="Password"
                        />
                    </FormControl>
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
                    <Button onClick={handleRegistrar}>
                        Registrar
                    </Button>
                </DialogActions>
            </Dialog>

            <BusquedaPropietario
                open={openBusqueda}
                onClose={handleClose}
                setRegistro={setRegistro}
            />
        </React.Fragment>
    );
}
