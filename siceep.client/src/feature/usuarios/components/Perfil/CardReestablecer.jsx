import { Box, Typography } from "@mui/material";
import AppButton from './../../../../shared/components/AppButton';
import CardReestrablecerContra from './../CardReestrablecerContra';
function CardReestablecer({ perfil, abrirReestrablecerContra, dialogo, cerrar }) {
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
              Reestablecer Contraseña
          </Typography>
          <AppButton
              colorBtn={"secondary"}
              isfullWidth={true}
              content={"Reestablecer Contraseña"}
              onClick={(e) => {
                  // Evitar que el botón mantenga el foco después de hacer clic
                  e.currentTarget.blur();
                  abrirReestrablecerContra();
              }}
          >
          </AppButton>

          <CardReestrablecerContra
              open={dialogo === "reestrablecerContra"}
              onClose={cerrar}
              id={perfil.usuario?.id}
          />
      </Box>
      

  );
}

export default CardReestablecer;