
import { Typography, Paper } from "@mui/material";
import AppButton from './../../../../shared/components/AppButton';
import SearchIcon from '@mui/icons-material/Search';

function DatosPropietario({ registro, handleBuscarPropietario }) {
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
              Datos del Propietario
          </Typography>
          <AppButton
              isfullWidth={true}
              colorBtn="primary"
              iconBtn={<SearchIcon />}
              content="Buscar Propietario"
              onClick={() => handleBuscarPropietario()}>
          </AppButton>
          <Paper
              variant="outlined"
              sx={{
                  p: 1,
                  bgcolor: 'grey.50'
              }}
          >
              <Typography variant="caption">
                  Propietario seleccionado
              </Typography>

              <Typography fontWeight={600}>
                  {registro.nombrePropietario || 'Ninguno seleccionado'}
              </Typography>
          </Paper>
      </>
  );
}

export default DatosPropietario;