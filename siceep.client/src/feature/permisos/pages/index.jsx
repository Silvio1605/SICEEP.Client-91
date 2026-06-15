import React from "react";
import { Box } from "@mui/material";
import AppButton from "../../../shared/components/AppButton";
import SearchIcon from '@mui/icons-material/Search';
import AppInput from "../../../shared/components/AppInput";
import { Paper, Typography } from "@mui/material";
//
import BusquedaPropietario from "./../../usuarios/components/BusquedaPropietario";
import Permisos from "./Permisos";
import { PermisoProvider } from './../../../providers/Permisos/PermisoProvider';
export default function Index() {

    // Estado para controlar la apertura del diálogo de búsqueda de propietario
    const [openBusqueda, setOpenBusqueda] = React.useState(false);
    const [registro, setRegistro] = React.useState({
        idPropietario: '',
        nombrePropietario: '',
        nombreUsuario: ''
    })

    // Función para manejar la búsqueda de propietario (puede ser implementada según las necesidades)
    const handleBuscarPropietario = () => {
        setOpenBusqueda(true);
    };

    const handleClose = () => {
        setOpenBusqueda(false);
    };

    return (
        <Box>
            <AppButton
                isfullWidth={true}
                colorBtn="primary"
                iconBtn={<SearchIcon />}
                content="Buscar Usuario"
                onClick={(e) => {
                    e.currentTarget.blur();
                    handleBuscarPropietario(e)
                }}>
            </AppButton>
            <Paper
                variant="outlined"
                sx={{
                    mb: 2,
                    p: 1,
                    bgcolor: 'grey.50'
                }}
            >
                <Typography variant="caption">
                    Cuenta seleccionada
                </Typography>

                <Typography fontWeight={600}>
                    {registro.nombrePropietario || 'Ninguno seleccionado'}
                </Typography>
            </Paper>

            {
                registro.idPropietario && (
                    <PermisoProvider idUsuario={registro.idPropietario}>
                        <Permisos
                            idUsuario={registro.idPropietario}
                        />
                    </PermisoProvider>
                    
                )
            }
            { /* Diálogo para buscar propietario */  }
            <BusquedaPropietario
                open={openBusqueda}
                onClose={handleClose}
                setRegistro={setRegistro}
                OriginRegistro={false}
            >
            </BusquedaPropietario>

        </Box>
    );
};
