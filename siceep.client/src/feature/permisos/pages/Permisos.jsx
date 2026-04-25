import { useState, useRef } from 'react';
import { Box, Grid, Tabs, Tab, Typography, Paper } from "@mui/material";
import Fab from '@mui/material/Fab';
import SaveIcon from '@mui/icons-material/Save';
// componentes
import CardDescUser from '../components/CardDescUser';
import CardPermiso from "../components/CardPermiso";
import GuardarPermisosDialog from './../components/GuardarPermisosDialog';
// servicios
import { useLocation } from 'react-router-dom';
import { usePermisos } from '../hooks/usePermisos';

export default function Permisos() {

    //funcion para extraer el valor enviado desde usuario
    const { state } = useLocation();
    //hook personalizado para manejar permisos
    const { perfil, permisos, permisosOriginal, detectarCambios, cambiarPermiso } = usePermisos(state?.user?.id);

    // Estado para controlar el diálogo de guardar permisos
    const [openDialog, setOpenDialog] = useState(false);
    const handleCloseDialog = () => setOpenDialog(false);

    const [value, setValue] = useState(0);

    // refs dinámicos
    const sectionsRef = useRef({});

    const tabsChange = (event, newValue) => {
        setValue(newValue);

        const idModulo = permisosOriginal.current[newValue].idModulo;
        const element = sectionsRef.current[idModulo];

        if (element) {
            element.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }
    };

    return (

        <Box>
            {/* Información del Usuario */}
            <CardDescUser perfil={ perfil } />

            {/* Tabs */}
            <Box
                sx={{
                    position: "sticky",
                    top: 64,
                    zIndex: 10,
                    bgcolor: "background.paper",
                    borderBottom: 1,
                    borderColor: "divider",
                    boxShadow: 2
                }}
            >
                
                <Tabs
                    value={value}
                    onChange={tabsChange}
                    variant="scrollable"
                    scrollButtons
                    allowScrollButtonsMobile
                    textColor="primary"
                    indicatorColor="primary"
                    sx={{
                        px: 2
                    }}
                >
                    {permisos.map((m) => (
                        <Tab key={m.idModulo} label={m.modulo} />
                    ))}
                </Tabs>
               
            </Box>

            {/* LISTA COMPLETA DE PERMISOS */}
            {permisos.map((modulo) => (
                <Box key={modulo.idModulo} sx={{ mb: 4  }} >

                    {/* HEADER DEL MÓDULO */}
                    <Box
                        sx={{
                            mt: 3,
                            mb: 1.5,
                            px: 1,
                            borderLeft: '4px solid #0288d1'

                        }}
                    >
                        <Typography variant="h6" fontWeight="600">
                            {modulo.modulo}
                        </Typography>
                    </Box>

                    {/* CONTENEDOR */}
                    <Paper
                        ref={(el) => (sectionsRef.current[modulo.idModulo] = el)}
                        elevation={0}
                        sx={{
                            p: 2,
                            borderRadius: 3,
                            border: '1px solid',
                            borderColor: 'divider',
                            bgcolor: 'background.paper'
                        }}
                    >
                        <Grid container spacing={2}>
                            {modulo.permisos.map((permiso) => (
                                <Grid key={permiso.idRecurso} size={{ xs: 12, md: 6 }}>
                                    <CardPermiso
                                        id={permiso.idRecurso}
                                        nombrePermiso={permiso.recurso}
                                        descripcion={permiso.descripcion}
                                        checked={permiso.check}
                                        cambiarPermiso={cambiarPermiso}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    </Paper>

                </Box>
            ))}
            <Fab
                onClick={(e) => {
                    e.currentTarget.blur();
                    setOpenDialog(true);
                }}
                color="primary"
                sx={{
                    position: "fixed",
                    bottom: 26,
                    right: 26
                }}
            >
                <SaveIcon />
            </Fab>
            <GuardarPermisosDialog open={openDialog} onClose={handleCloseDialog} idUsuario={state?.user.id} cambios={detectarCambios} />
        </Box>
    );
}
