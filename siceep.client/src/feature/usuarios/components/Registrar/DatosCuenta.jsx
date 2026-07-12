import React, { useState, useId } from 'react';
import { Typography, Paper } from "@mui/material";
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import Grid from '@mui/material/Grid';
// Importar el componente SelectItem
import SelectItem from './../../../../shared/components/SelectItem';
// importar el hook useSelectRoles para obtener los roles disponibles
import { useSelectRoles } from "./../../hooks/useSelectRoles";
// componentes personalizados
import AppInput from './../../../../shared/components/AppInput';
import AppButton from './../../../../shared/components/AppButton';
// iconos 
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import PersonAddIcon from '@mui/icons-material/PersonAdd';


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

function DatosCuenta({ registro, setRegistro }) {

    // datos para las cajas de selecciones
    const { selRol, loading } = useSelectRoles();
    // Generar IDs únicos para los campos de contraseña y confirmación
    const outlinedContraId = useId();
    const outlinedConfirmdId = useId();

    // Estados para mostrar u ocultar las contraseñas
    const [MostrarContra, setMostrarContra] = useState(false);
    const [MostrarConfirm, setMostrarConfirm] = useState(false);


    return (
      <>
          <Typography
              variant="subtitle2"
              sx={{
                  mt: 2,
                  mb: 1,
                  color: 'primary.main',
                  fontWeight: 600
              }}
          >
              Datos de Acceso
          </Typography>
          <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                  <AppInput
                      id="usuario"
                      label="Nombre de Usuario"
                      value={registro.nombreUsuario ?? ''}
                      isReadOnly={false}
                      onChange={(e) => setRegistro({ ...registro, nombreUsuario: e.target.value })}
                  />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
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
              </Grid>
          </Grid>
          <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
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
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
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
              </Grid>
          </Grid>

      </>
  );
}

export default DatosCuenta;