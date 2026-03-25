import React from 'react';
import { Box, Grid, Tabs, Tab, Typography, Paper } from "@mui/material";
import CardPermiso from "../components/CardPermiso";
import PermisosData from "../services/PermisosData";
import Fab from '@mui/material/Fab';
import SaveIcon from '@mui/icons-material/Save';
import CardDescUser from '../components/CardDescUser';
import GuardarPermisosDialog from '../components/Dialog/GuardarPermisosDialog';

export default function Permisos() {

    //datos de ejemplo, en un caso real se obtendrían de una API
    const [permisos, setPermisosData] = React.useState(PermisosData);
    // ref para mantener los permisos originales y comparar cambios
    const permisosOriginal = React.useRef(PermisosData);

    // Función para obtener una lista plana de todos los permisos
    const obtenerPermisos = (data) =>
        data.flatMap(m => m.permisos);

    const detectarCambios = () => {
        const originales = obtenerPermisos(permisosOriginal.current);
        const actuales = obtenerPermisos(permisos);

        const agregados = actuales.filter(p => {
            const orig = originales.find(o => o.id === p.id);
            return orig && !orig.checked && p.checked;
        });

        const quitados = actuales.filter(p => {
            const orig = originales.find(o => o.id === p.id);
            return orig && orig.checked && !p.checked;
        });

        return { agregados, quitados };
    };


    // Función para cambiar el estado de un permiso
    const cambiarPermiso = (idPermiso) => {
        setPermisosData(prev =>
            prev.map(modulo => ({
                ...modulo,
                permisos: modulo.permisos.map(p =>
                    p.id === idPermiso
                        ? { ...p, checked: !p.checked }
                        : p
                )
            }))
        );
    };


    // Estado para controlar el diálogo de guardar permisos
    const [openDialog, setOpenDialog] = React.useState(false);

    const handleCloseDialog = () => setOpenDialog(false);

    const [value, setValue] = React.useState(0);

    // refs dinámicos
    const sectionsRef = React.useRef({});

    const tabsChange = (event, newValue) => {
        setValue(newValue);

        const rolId = PermisosData[newValue].id;
        const element = sectionsRef.current[rolId];

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
            <CardDescUser />

            {/* Tabs */}
            <Box
                sx={{
                    position: "sticky",
                    top: 64,
                    zIndex: 10,
                    bgcolor: "background.paper",
                    borderBottom: 1,
                    borderColor: "divider"
                }}
            >
                
                <Tabs
                    value={value}
                    onChange={tabsChange}
                    variant="scrollable"
                    scrollButtons
                    allowScrollButtonsMobile
                >
                    {permisos.map((m) => (
                        <Tab key={m.id} label={m.titulo} />
                    ))}
                </Tabs>
               
                
            </Box>

            {/* LISTA COMPLETA DE PERMISOS */}
            {permisos.map((modulo) => (

                <Box key={modulo.id} sx={{ mb: 4 }}>

                    {/* TITULO DEL MODULO */}
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        {modulo.titulo}
                    </Typography>

                    {/* LISTADO PERMISOS */}
                    <Paper
                        key={modulo.id}
                        ref={(el) => (sectionsRef.current[modulo.id] = el)}
                        sx={{ p: 3, mb: 4 }}

                    >
                        <Box sx={{ flexGrow: 1 }}>
                            <Grid container spacing={2}>
                                {modulo.permisos.map((permiso) => (
                                    <Grid key={permiso.id} size={{ xs: 12, md: 6 }}>
                                        <CardPermiso
                                            id={permiso.id}
                                            nombrePermiso={permiso.nombrePermiso}
                                            descripcion={permiso.descripcion}
                                            checked={permiso.checked}
                                            cambiarPermiso={cambiarPermiso}
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                        
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
            <GuardarPermisosDialog open={openDialog} onClose={handleCloseDialog} cambios={detectarCambios} />
        </Box>
    );
}
