import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import { Typography, Paper } from "@mui/material";
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import FormHelperText from '@mui/material/FormHelperText';
import LinearProgress from '@mui/material/LinearProgress';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { useNotificacionContext } from './../../../providers/Notificacion/useNotificacionContext';
import CardSeleccionar from './cardSeleccionar';
import BusinessIcon from '@mui/icons-material/Business';
import ApartmentIcon from '@mui/icons-material/Apartment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import AddLocationIcon from '@mui/icons-material/AddLocation';
import SearchIcon from '@mui/icons-material/Search';
import AppButton from './../../../shared/components/AppButton';

export default function CardCrear({ open, onClose }) {

    // Configuración para el diálogo responsivo
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    // Notificaciones
    const { mostrarNotificacion } = useNotificacionContext();
    const [guardando, setGuardando] = useState(false);

    const [registro, setRegistro] = useState({
        idEstructura: null,
        nombreEstructura: null,
        idUnidad: null,
        nombreUnidad: null
    });

    const [openBusqueda, setOpenBusqueda] = useState(false);
    const [tipoBusqueda, setTipoBusqueda] = useState(null); // '1 - estructura' o '2 - unidad'


    // Abre el diálogo y guarda el tipo de búsqueda
    const handleBuscar = (tipo) => {
        setTipoBusqueda(tipo);
        setOpenBusqueda(true);
    };

    // Cierra el diálogo sin seleccionar
    const handleCloseBusqueda = () => {
        setOpenBusqueda(false);
        setTipoBusqueda(null);
    };

    // Recibe el elemento seleccionado desde CardSeleccionar
    const handleSeleccionarItem = (item) => {
        // Asume que item tiene { id, nombre } o { id, descripcion }
        setRegistro((prev) => ({
            ...prev,
            // Si es estructura, actualiza idEstructura y nombreEstructura
            // Si es unidad, actualiza idUnidad y nombreUnidad
            ...(tipoBusqueda === 1
                ? {
                    idEstructura: item.id,
                    nombreEstructura: item.descripcion
                }
                : {
                    idUnidad: item.id,
                    nombreUnidad: item.descripcion
                }
            ),
        }));
        setOpenBusqueda(false);
        setTipoBusqueda(null);
    };

    const handleRegistrar = () => {
        setGuardando(true);
        mostrarNotificacion({
            message: "registrando",
            severity: "success",
        });
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
                  <AddLocationIcon color="primary" />
                  Registrar Ubicación
              </DialogTitle>
              <DialogContent dividers>
                  <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                      Selecciona la estructura y la unidad para crear la ubicación
                  </Typography>

                  <Grid
                      container spacing={4}
                      sx={{mt: 1}}>
                      {/* --- ESTRUCTURA --- */}
                      <Grid size={{ xs: 12, md: 6 }}>
                          <Paper
                              variant="outlined"
                              sx={{
                                  p: 2,
                                  bgcolor: '#f5f9ff', // azul claro
                                  borderColor: 'primary.light',
                                  transition: 'all 0.2s',
                                  '&:hover': {
                                      borderColor: 'primary.main',
                                      boxShadow: 1,
                                  },
                              }}
                          >
                              <Stack direction="row" alignItems="center" justifyContent="space-between">
                                  <Stack direction="row" alignItems="center" spacing={1}>
                                      <BusinessIcon color="primary" />
                                      <Typography variant="subtitle2" fontWeight={600} color="primary.dark">
                                          Estructura
                                      </Typography>
                                      {registro.idEstructura && (
                                          <Chip
                                              label="Seleccionada"
                                              size="small"
                                              color="success"
                                              variant="outlined"
                                              sx={{ ml: 1 }}
                                          />
                                      )}
                                  </Stack>
                                  <AppButton
                                      size="small"
                                      colorBtn="primary"
                                      iconBtn={<SearchIcon />}
                                      content="Buscar"
                                      onClick={() => handleBuscar(1)}
                                  />
                              </Stack>

                              <Divider sx={{ my: 2 }} />

                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Typography variant="caption" color="text.secondary" sx={{ minWidth: 80 }}>
                                      Seleccionado:
                                  </Typography>
                                  <Chip
                                      label={registro.nombreEstructura || 'Ninguna estructura seleccionada'}
                                      color={registro.idEstructura ? 'primary' : 'default'}
                                      variant={registro.idEstructura ? 'filled' : 'outlined'}
                                      size="medium"
                                      icon={registro.idEstructura ? <CheckCircleIcon /> : <RemoveCircleIcon />}
                                      sx={{ fontWeight: 500 }}
                                  />
                              </Box>
                          </Paper>
                      </Grid>

                      {/* --- UNIDAD --- */}
                      <Grid size={{ xs: 12, md: 6 }}>
                          <Paper
                              variant="outlined"
                              sx={{
                                  p: 2,
                                  bgcolor: '#f5fcf5', // verde claro
                                  borderColor: 'success.light',
                                  transition: 'all 0.2s',
                                  '&:hover': {
                                      borderColor: 'success.main',
                                      boxShadow: 1,
                                  },
                              }}
                          >
                              <Stack direction="row" alignItems="center" justifyContent="space-between">
                                  <Stack direction="row" alignItems="center" spacing={1}>
                                      <ApartmentIcon color="success" />
                                      <Typography variant="subtitle2" fontWeight={600} color="success.dark">
                                          Unidad
                                      </Typography>
                                      {registro.idUnidad && (
                                          <Chip
                                              label="Seleccionada"
                                              size="small"
                                              color="success"
                                              variant="outlined"
                                              sx={{ ml: 1 }}
                                          />
                                      )}
                                  </Stack>
                                  <AppButton
                                      size="small"
                                      colorBtn="success" // diferenciar
                                      iconBtn={<SearchIcon />}
                                      content="Buscar"
                                      onClick={() => handleBuscar(0)}
                                  />
                              </Stack>

                              <Divider sx={{ my: 1.5 }} />

                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Typography variant="caption" color="text.secondary" sx={{ minWidth: 80 }}>
                                      Seleccionado:
                                  </Typography>
                                  <Chip
                                      label={registro.nombreUnidad || 'Ninguna unidad seleccionada'}
                                      color={registro.idUnidad ? 'success' : 'default'}
                                      variant={registro.idUnidad ? 'filled' : 'outlined'}
                                      size="medium"
                                      icon={registro.idUnidad ? <CheckCircleIcon /> : <RemoveCircleIcon />}
                                      sx={{ fontWeight: 500 }}
                                  />
                              </Box>
                          </Paper>
                      </Grid>
                  </Grid>

                  {/* Mensaje de validación global */}
                  {(!registro.idEstructura || !registro.idUnidad) && (
                      <FormHelperText error sx={{ mt: 2, textAlign: 'center' }}>
                          * Debes seleccionar una estructura y una unidad para continuar.
                      </FormHelperText>
                  )}
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
          <CardSeleccionar
              open={openBusqueda}
              onClose={handleCloseBusqueda}
              onSelect={handleSeleccionarItem}  
              tipo={tipoBusqueda}
          />
      </React.Fragment>
  );
}