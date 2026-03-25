import { useEffect, useState, useRef } from 'react';
import { Box, Grid, Tabs, Tab, Typography, Paper } from "@mui/material";
import CardPermiso from "../components/CardPermiso";
import PermisosData from "../services/PermisosData";
import Fab from '@mui/material/Fab';
import SaveIcon from '@mui/icons-material/Save';
import CardDescUser from '../components/CardDescUser';
import GuardarPermisosDialog from '../components/Dialog/GuardarPermisosDialog';
import { getPermisos } from './../services/PermisoService';

export default function Permisos() {

    //datos de ejemplo, en un caso real se obtendrían de una API
    const [permisos, setPermisosData] = useState([]);

    //permisos que se guardaran
    const permisosOriginal = useRef([]);

    useEffect(() => {
        let isMounted = true;

        const cargar = async () => {
            try {
                const res = await getPermisos();

                if (isMounted) {
                    setPermisosData(res.data);
                    // ref para mantener los permisos originales y comparar cambios
                    permisosOriginal.current = JSON.parse(JSON.stringify(res.data));
                }
            } catch (error) {
                console.error("Error:", error);
            }
        };

        cargar();

        return () => {
            isMounted = false;
        };
    }, []);

    

    // Función para obtener una lista plana de todos los permisos
    const obtenerPermisos = (data) =>
        data.flatMap(m => m.permisos);

    const detectarCambios = () => {
        const originales = obtenerPermisos(permisosOriginal.current);
        const actuales = obtenerPermisos(permisos);

        const agregados = actuales.filter(p => {
            const orig = originales.find(o => o.idRecurso === p.idRecurso);
            return orig && !orig.check && p.check;
        });

        const quitados = actuales.filter(p => {
            const orig = originales.find(o => o.idRecurso === p.idRecurso);
            return orig && orig.check && !p.check;
        });

        return { agregados, quitados };
    };


    // Función para cambiar el estado de un permiso
    const cambiarPermiso = (idPermiso) => {
        setPermisosData(prev =>
            prev.map(modulo => ({
                ...modulo,
                permisos: modulo.permisos.map(p =>
                    p.idRecurso === idPermiso
                        ? { ...p, check: !p.check }
                        : p
                )
            }))
        );
    };

    // Estado para controlar el diálogo de guardar permisos
    const [openDialog, setOpenDialog] = useState(false);

    const handleCloseDialog = () => setOpenDialog(false);

    const [value, setValue] = useState(0);

    // refs dinámicos
    const sectionsRef = useRef({});

    const tabsChange = (event, newValue) => {
        setValue(newValue);

        const rolId = PermisosData[newValue].idRecurso;
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
                        <Tab key={m.idModulo} label={m.modulo} />
                    ))}
                </Tabs>
               
                
            </Box>

            {/* LISTA COMPLETA DE PERMISOS */}
            {permisos.map((modulo) => (

                <Box key={modulo.idModulo} sx={{ mb: 4 }}>

                    {/* TITULO DEL MODULO */}
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        {modulo.modulo}
                    </Typography>

                    {/* LISTADO PERMISOS */}
                    <Paper
                        key={modulo.idModulo}
                        ref={(el) => (sectionsRef.current[modulo.idModulo] = el)}
                        sx={{ p: 3, mb: 4 }}

                    >
                        <Box sx={{ flexGrow: 1 }}>
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
