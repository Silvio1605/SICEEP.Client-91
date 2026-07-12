import React, { useState, useId } from 'react';
import { Box } from "@mui/material";
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
// iconos
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
// hooks
import { ContraUsuario } from './../../auth/hooks/useContra';
import { useNotificacionContext } from './../../../providers/Notificacion/useNotificacionContext';
import { usePerfil } from '../hooks/usePerfil';


// Funciones para evitar que el botón de mostrar/ocultar contraseña tome el foco al hacer clic
const handleMouseDownContra = (event) => {
    event.preventDefault();
};
const handleMouseUpContra = (event) => {
    event.preventDefault();
};

// Función para manejar el clic en el ícono de mostrar/ocultar contraseña
const handleClickMostrarContra = (setter) => {
    setter((show) => !show);
};

export default function CardReestrablecerContra({ open, onClose, id }) {

    const { perfil } = usePerfil(id);

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    // Generar IDs únicos para los campos de contraseña y confirmación
    const outlinedContraId = useId();
    const outlinedConfirmdId = useId();
    // Estados para mostrar u ocultar las contraseñas
    const [MostrarContra, setMostrarContra] = useState(false);
    const [MostrarConfirm, setMostrarConfirm] = useState(false);

    const { ReestablecerContraseña } = ContraUsuario();
    // Notificaciones
    const { mostrarNotificacion } = useNotificacionContext();

    const [actualizar, setActualizar] = useState({
        id: id ?? '',
        nuevaContraseña: '',
        contraseñaConfirmacion: ''
    })

    const handleGuardar = async () => {

        const datos = {
            ...actualizar,
            id : id
        };

        const result = await ReestablecerContraseña(datos);

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
        }

        onClose();
        // limpiar campos
        setActualizar(prev => ({
            ...prev,
            nuevaContraseña: '',
            contraseñaConfirmacion: ''
        }));

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
                  {"Reestablecer Contraseña"}
              </DialogTitle>
              <DialogContent>
                  <Box>
                      <TextField
                          fullWidth
                          slotProps={{
                              input: {
                                  readOnly: true,
                              },
                          }}
                          sx={{ m: 1 }}
                          id="usuario"
                          label="Nombre de Usuario"
                          type="text"
                          autoComplete="Nombre de Usuario"
                          value={perfil?.usuario?.usuario ?? ''}
                      />
                      <FormControl sx={{ m: 1 }} variant="outlined" fullWidth>
                          <InputLabel htmlFor={`${outlinedContraId}-input`}>Contraseña</InputLabel>
                          <OutlinedInput
                              id={`${outlinedContraId}-input`}
                              type={MostrarContra ? 'text' : 'password'}
                              value={actualizar.nuevaContraseña ?? ''}
                              onChange={(e) => setActualizar({ ...actualizar, nuevaContraseña: e.target.value })}
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
                      <FormControl sx={{ m: 1 }} variant="outlined" fullWidth>
                          <InputLabel htmlFor={`${outlinedConfirmdId}-input`}>Confirmar Contraseña</InputLabel>
                          <OutlinedInput
                              id={`${outlinedConfirmdId}-input`}
                              type={MostrarConfirm ? 'text' : 'password'}
                              value={actualizar.contraseñaConfirmacion ?? ''}
                              onChange={(e) => setActualizar({ ...actualizar, contraseñaConfirmacion: e.target.value })}
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
                  </Box>
              </DialogContent>
              <DialogActions>
                  <Button onClick={onClose}>
                      Cancelar
                  </Button>
                  <Button onClick={handleGuardar}>
                      Resstablecer
                  </Button>
              </DialogActions>
          </Dialog>
      </React.Fragment>
  );
}
