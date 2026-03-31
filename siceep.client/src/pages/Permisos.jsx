import { useEffect, useState, useRef } from 'react';
import { Box, Grid, Tabs, Tab, Typography, Paper } from "@mui/material";
import CardPermiso from "../components/CardPermiso";
import Fab from '@mui/material/Fab';
import SaveIcon from '@mui/icons-material/Save';
import CardDescUser from '../components/CardDescUser';
import GuardarPermisosDialog from '../components/Dialog/GuardarPermisosDialog';
import { useLocation } from 'react-router-dom';
import { getPermisos } from './../services/PermisoService';

export default function Permisos() {

    //funcion para extraer el valor enviado desde usuario
    const { state } = useLocation();
    //datos de ejemplo, en un caso real se obtendrían de una API
    const [permisos, setPermisosData] = useState([]);

    //permisos que se guardaran
    const permisosOriginal = useRef([]);

    useEffect(() => {
        let isMounted = true;

        const cargar = async () => {
            try {

                //identificador del usuario
                var id = state?.user.id;

                const res = await getPermisos(id);
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
    }, [state]);

    // Función para obtener una lista plana de todos los permisos
    const obtenerPermisos = (data) =>
        data.flatMap(m => m.permisos);

    const detectarCambios = () => {
        const originales = obtenerPermisos(permisosOriginal.current);
        const actuales = obtenerPermisos(permisos);

        // Convertir originales a mapa
        const mapaOriginal = new Map(
            originales.map(o => [o.idRecurso, o.check])
        );

        // recorrer el mapeado para encontrar el id del recurso
        const cambios = actuales.reduce((acc, p) => {
            const originalCheck = mapaOriginal.get(p.idRecurso);

            //que no sea indefinido y sea distito al original
            if (originalCheck !== undefined && originalCheck !== p.check) {
                acc.push({
                    idRecurso: p.idRecurso,
                    recurso: p.recurso,
                    descripcion: p.descripcion,
                    estado: p.check ? 1 : 0
                });
            }

            return acc;
        }, []);

        return cambios;
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
