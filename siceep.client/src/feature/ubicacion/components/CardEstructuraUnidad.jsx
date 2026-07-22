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
//iconos
import DescriptionIcon from '@mui/icons-material/Description';
import LooksOneIcon from '@mui/icons-material/LooksOne';
import AddIcon from '@mui/icons-material/Add';

export default function CardEstructuraUnidad({
    open,
    onClose,
    tipo,
    titulo
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
        id: null,
        descripcion: null,
        orden: null
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
           
            mostrarNotificacion({
                message: resultado.status === 200 ?
                    "Registrado correctamente, identificador: " + resultado.data.message : resultado.message,
                severity: resultado.status === 200 ? "success" : "error",
            });

            if (resultado.status === 200) onClose();

        } catch (error) {
            const data = error.response?.data;

            if (data?.errors) {
                const primerError = Object.values(data.errors)[0][0];
                mostrarNotificacion({
                    message: primerError,
                    severity: "error"
                });
            } else {
                mostrarNotificacion({
                    message: data?.message ?? "Ocurrió un error inesperado.",
                    severity: "error"
                });
            }
        } finally {
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
                            {/*<Typography variant="caption" color="text.secondary">
                                {registro.id
                                    ? 'Edita los campos y guarda los cambios'
                                    : 'Completa la información para agregar un nuevo registro'}
                            </Typography>*/}
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
                                {tipo === 1 && (
                                    <Grid size={{ xs: 12, md: 4 }}>
                                        <AppInput
                                            id="orden"
                                            label="Orden"
                                            type="number"
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