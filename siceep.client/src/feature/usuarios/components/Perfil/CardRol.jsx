import { useEffect } from 'react';

import { Box, Typography } from "@mui/material";
import AppButton from './../../../../shared/components/AppButton';
import WorkIcon from '@mui/icons-material/Work';

import SelectItem from './../../../../shared/components/SelectItem';
import { useSelectRoles } from "./../../hooks/useSelectRoles";
import { usePerfil } from './../../hooks/usePerfil';
import { useBusquedaContext } from './../../../../providers/BusquedaUsers/useBusquedaContext';

function CardRol({ abrirConfirmRol, setRol, rol }) {

    const { idSeleccionado } = useBusquedaContext();
    const { perfil } = usePerfil(idSeleccionado);
    // datos para las cajas de selecciones
    const { selRol, loading } = useSelectRoles();

    useEffect(() => {
        const cargarRol = () => {
            setRol(perfil.usuario?.idRol || "");
        };
        cargarRol();
    }, [perfil.usuario?.idRol, setRol]);


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
              Rol
          </Typography>

          {loading ? (
              <p>Cargando...</p>
          ) : (
              <Box>
                  <SelectItem
                      value={rol}
                      onChange={(selRol) => {
                          setRol(selRol);
                      }}
                      incluirTodo={false}
                      datos={selRol}
                      titulo=""
                  />
                  <AppButton
                      colorBtn={'primary'}
                      iconBtn={<WorkIcon />}
                      isfullWidth={true}
                      content={"Actualizar Rol"}
                      onClick={(e) => {
                          // Evitar que el botón mantenga el foco después de hacer clic
                          e.currentTarget.blur();
                          abrirConfirmRol();
                      }}
                  />
              </Box>
          )}
      </Box>
  );
}

export default CardRol;