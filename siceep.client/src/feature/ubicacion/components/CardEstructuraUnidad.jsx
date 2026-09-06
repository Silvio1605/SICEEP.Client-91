import React, { useState } from 'react';
import {
    Grid,
    Dialog,
    DialogContent,
    DialogActions,
    DialogTitle,
    Button,
    Stack,
    Box,
    Typography,
    LinearProgress,
    InputAdornment,
    Card,
    CardContent
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import AppInput from "./../../../shared/components/AppInput";
import { useNotificacionContext } from './../../../providers/Notificacion/useNotificacionContext';
import { useEstructuras } from "./../hooks/useEstructuras";
import { useUnidades } from "./../hooks/useUnidades";
import { registrarBitacora } from "./../../bitacora/service/bitacoraService";
//iconos
import DescriptionIcon from '@mui/icons-material/Description';
import LooksOneIcon from '@mui/icons-material/LooksOne';
import AddIcon from '@mui/icons-material/Add';
import { Edit as EditIcon } from '@mui/icons-material';

export default function CardEstructuraUnidad({
    open,
    onClose,
    tipo,
    titulo,
    editar,
    refrescar
}) {
    // Configuración para el diálogo responsivo
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    // Notificaciones
    const { mostrarNotificacion } = useNotificacionContext();

    const { registrarEstructura } = useEstructuras();
    const { registrarUnidad } = useUnidades();

    const [guardando, setGuardando] = useState(false);
    const [registro, setRegistro] = useState({
        id: editar?.id ?? null,
        descripcion: editar?.descripcion ?? null,
        orden: editar?.orden ?? null
    });

    const handleGuardar = async () => {

        var resultado;
        setGuardando(true);

        try {
            if (tipo === 1) {
                resultado = await registrarEstructura(registro);

            } else {
                resultado = await registrarUnidad(registro);
            }

            var mensaje = resultado.status === 200  ? "Registrado correctamente, identificador: " + resultado.data : resultado.message;

            mensaje = editar?.id ? resultado.data.mensaje : mensaje;

            mostrarNotificacion({
                message: mensaje,
                severity: resultado.status === 200 ? "success" : "error",
            });
            if (resultado.status === 200) {
                const esEdicion = Boolean(registro.id || editar?.id);
                const descripcion = (tipo === 1 ? "Estructura" : "Unidad Administrativa")
                    + (esEdicion ? " actualizada" : " registrada");
                await registrarBitacora(esEdicion ? 3 : 2, descripcion);
                onClose();
            }

        } catch (error) {
            const data = error.response?.data;

            if (data?.errors) {
                const primerError = Object.values(data.errors)[0][0];
                mostrarNotificacion({
                    message: primerError,
                    severity: "error"
                });
            } else if (error.response) {
                // La API respondió con un error (400, 409, 500, etc.)
                mostrarNotificacion({
                    message: error.response.data.mensaje,
                    severity: "error",
                });

            } else if (error.request) {
                // La petición se envió pero no hubo respuesta
                mostrarNotificacion({
                    message: "No se pudo conectar con el servidor.",
                    severity: "error",
                });
            } else {
                // Error al crear la petición
                mostrarNotificacion({
                    message: error.message,
                    severity: "error",
                });
            }

        } finally {
            refrescar();
            setGuardando(false);
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
                    <Stack direction="row" spacing={1} alignItems="center">
                        {/* Ícono según si es edición o nuevo */}
                        {registro.id ? (
                            <EditIcon color="primary" />
                        ) : (
                            <AddIcon color="primary" />
                        )}
                        <Stack>
                            <Typography variant="h6" component="div">
                                {titulo}
                            </Typography>
                           <Typography variant="caption" color="text.secondary">
                                {editar?.id
                                    ? 'Edita los campos y guarda los cambios'
                                    : 'Completa la información para agregar un nuevo registro'}
                            </Typography>
                        </Stack>
                    </Stack>
              </DialogTitle>
              <DialogContent dividers>
                    <Card
                        elevation={2}
                        sx={{
                            borderRadius: 3
                        }}
                    >
                        <CardContent>
                            <Grid container spacing={2}>
                                {editar?.id && (
                                    <Grid size={{ xs: 12, md: 4 }}>
                                        <AppInput
                                            id="id"
                                            label="Id"
                                            type="number"
                                            size="medium"
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <LooksOneIcon fontSize="small" color="action" />
                                                    </InputAdornment>
                                                )
                                            }}
                                            value={registro.id ?? ""}
                                        />
                                    </Grid>
                                )}
                                {tipo === 1 && (
                                    <Grid size={{ xs: 12, md: 4 }}>
                                        <AppInput
                                            id="orden"
                                            label="Orden"
                                            size="medium"
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <LooksOneIcon fontSize="small" color="action" />
                                                    </InputAdornment>
                                                ),
                                                step: 0.01,
                                            }}
                                            value={registro.orden ?? ""}
                                            onChange={(e) =>
                                                setRegistro({
                                                    ...registro,
                                                    orden: e.target.value
                                                })
                                            }
                                        />
                                    </Grid>
                                )}


                                <Grid size={{ xs: 12 }}>
                                    <AppInput
                                        id="nombre"
                                        label="Descripcion"
                                        value={registro.descripcion ?? ""}
                                        onChange={(e) =>
                                            setRegistro({
                                                ...registro,
                                                descripcion: e.target.value
                                            })
                                        }
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <DescriptionIcon fontSize="small" color="action" />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>
                              
                            </Grid>
                        </CardContent>
                    </Card>
              </DialogContent>
              <DialogActions>
                    <Stack
                        direction="row"
                        justifyContent="flex-end"
                        spacing={2}
                        sx={{ mt: 4 }}
                    >
                        <Button
                            variant="outlined"
                            color="inherit"
                            onClick={onClose}
                        >
                            Cancelar
                        </Button>

                        <Button
                            variant="contained"
                            onClick={handleGuardar}
                            disabled={guardando}
                        >
                            {guardando == true ? "Guardando..." : "Guardar"}
                        </Button>

                    </Stack>
              </DialogActions>
              {guardando == true && (
                  <Box sx={{ width: '100%' }}>
                      <LinearProgress aria-label="Guardando…" />
                  </Box>
              )}
          </Dialog>
         
      </React.Fragment>
        
    );
}