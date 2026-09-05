import React, { useCallback } from "react";
import { Box, Paper, Typography, Stack, Avatar, Button } from "@mui/material";
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import RefreshIcon from '@mui/icons-material/Refresh';
import ClearIcon from '@mui/icons-material/Clear';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
//
import BusquedaPropietario from "./../../usuarios/components/BusquedaPropietario";
import Permisos from "./Permisos";
import { PermisoProvider } from './../../../providers/Permisos/PermisoProvider';

const getIniciales = (nombre) => {
    if (!nombre) return '?';
    const partes = nombre.trim().split(/\s+/).filter(Boolean);
    if (partes.length === 1) return partes[0][0].toUpperCase();
    return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
};

export default function Index() {

    // Estado para controlar la apertura del diálogo de búsqueda de propietario
    const [openBusqueda, setOpenBusqueda] = React.useState(false);
    const [registro, setRegistro] = React.useState({
        idPropietario: '',
        nombrePropietario: '',
        nombreUsuario: ''
    });

    // Función para manejar la búsqueda de propietario (puede ser implementada según las necesidades)
    const handleBuscarPropietario = () => {
        setOpenBusqueda(true);
    };

    const handleClose = () => {
        setOpenBusqueda(false);
    };

    const seleccionarCuenta = useCallback((propietario) => {
        setRegistro(prev => ({
            ...prev,
            idPropietario: propietario.id,
            nombrePropietario: propietario.nombreCompleto,
        }));
    }, []);

    const quitarSeleccion = () => {
        setRegistro({
            idPropietario: '',
            nombrePropietario: '',
            nombreUsuario: ''
        });
    };

    return (
        <Box>
            {/* Título de la página */}
            <Box sx={{ mb: 2 }}>
                <Typography variant="h5" component="h1" color="text.primary">
                    Permisos de Usuario
                </Typography>
                <Typography variant="subtitle1" component="h2" color="text.secondary">
                    Asigne y gestione los permisos de cada cuenta
                </Typography>
            </Box>

            {
                !registro.idPropietario ? (
                    // Estado vacío: aún no hay cuenta seleccionada
                    <Paper
                        variant="outlined"
                        sx={{
                            p: 5,
                            mb: 2,
                            borderRadius: 3,
                            borderColor: 'divider',
                            textAlign: 'center',
                            bgcolor: 'background.paper'
                        }}
                    >
                        <Stack spacing={2} alignItems="center">
                            <Avatar
                                sx={{
                                    width: 72,
                                    height: 72,
                                    bgcolor: (theme) => theme.palette.primary.main,
                                }}
                            >
                                <ManageAccountsIcon sx={{ fontSize: 40 }} />
                            </Avatar>
                            <Box>
                                <Typography variant="h6" fontWeight={700}>
                                    Selecciona una cuenta
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 420, mx: 'auto' }}>
                                    Busca un propietario para visualizar y editar los permisos de su usuario.
                                </Typography>
                            </Box>
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<PersonSearchIcon />}
                                onClick={handleBuscarPropietario}
                            >
                                Buscar Usuario
                            </Button>
                        </Stack>
                    </Paper>

                ) : (
                    <>
                        {/* Resumen de la cuenta seleccionada */}
                        <Paper
                            variant="outlined"
                            sx={{
                                p: 2,
                                mb: 2,
                                borderRadius: 3,
                                borderColor: 'divider',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 2,
                                flexWrap: 'wrap',
                                bgcolor: 'background.paper'
                            }}
                        >
                            <Avatar
                                sx={{
                                    width: 48,
                                    height: 48,
                                    bgcolor: '#1565C0',
                                    fontWeight: 700
                                }}
                            >
                                {getIniciales(registro.nombrePropietario)}
                            </Avatar>

                            <Box sx={{ flex: 1, minWidth: 200 }}>
                                <Typography variant="caption" color="text.secondary">
                                    Cuenta seleccionada
                                </Typography>
                                <Typography variant="body1" fontWeight={700} color="text.primary">
                                    {registro.nombrePropietario}
                                </Typography>
                                {registro.nombreUsuario && (
                                    <Typography variant="body2" color="text.secondary">
                                        Usuario: {registro.nombreUsuario}
                                    </Typography>
                                )}
                            </Box>

                            <Stack direction="row" spacing={1}>
                                <Button
                                    size="small"
                                    startIcon={<RefreshIcon />}
                                    onClick={handleBuscarPropietario}
                                >
                                    Cambiar
                                </Button>
                                <Button
                                    size="small"
                                    color="error"
                                    startIcon={<ClearIcon />}
                                    onClick={quitarSeleccion}
                                >
                                    Quitar
                                </Button>
                            </Stack>
                        </Paper>

                        {/* Gestor de permisos */}
                        <PermisoProvider idUsuario={registro.idPropietario}>
                            <Permisos idUsuario={registro.idPropietario} />
                        </PermisoProvider>
                    </>
                )
            }

            {/* Diálogo para buscar propietario */}
            <BusquedaPropietario
                open={openBusqueda}
                onClose={handleClose}
                onSeleccionar={seleccionarCuenta}
                OriginRegistro={false}
            />
        </Box>
    );
}