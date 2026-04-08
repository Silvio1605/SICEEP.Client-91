/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useState, useCallback, useMemo } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import {
    DataGrid,
    GridToolbar,
} from '@mui/x-data-grid';
import { useTheme, useMediaQuery } from "@mui/material";
import { columnsUsuarios } from '../services/usuariosData';
import AddIcon from '@mui/icons-material/Add';
import { Button } from '@mui/material';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import PerfilUsuarioDialog from '../components/Dialog/PerfilUsuarioDialog';
import SelectItem from '../components/SelectItem';
// Importar Grid para el toolbar
import Grid from '@mui/material/Grid';
// React Router
import { useSearchParams } from "react-router-dom";
//extraer datos de la api
import { getUsuarios } from './../services/usuarioService';
import { getSelectUsuario } from './../services/selectService';


export default function usuarios() {

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const [inputPropietario, setInputPropietario] = useState("");
    //datos de la busqueda con filtro
    const [, setAño] = useState("");
    const [filtro, setFiltro] = useState({
        propietario: "",
        fechaExpiracionDesde: null,
        fechaExpiracionHasta: null,
        estado: null,
        pagina: null,
        tamañoPagina: null
    });

    // para manejar los parámetros de búsqueda en la URL (si es necesario)
    const [searchParams, setSearchParams] = useSearchParams();
    // Verificar si hay parámetros de búsqueda en la URL
    const hayParams = searchParams.toString().length > 0;

    //datos de seleccion (filtro)
    const [selEstado, setSelEstado] = useState([]);
    const [selAño, setSelAño] = useState([]);

    //datos de los usuarios
    const [usuarios, setUsuariosData] = useState([]);

    // Sincronizar el estado del filtro con los parámetros de búsqueda en la URL al montar el componente
    useEffect(() => {

        const query = searchParams.toString();

        // si no hay parámetros - no hacer nada
        if (!query) return;

        const nuevosFiltros = {};

        for (let [key, value] of searchParams.entries()) {
            nuevosFiltros[key] = value;
        }

        setFiltro(prev => ({
            ...prev,
            ...nuevosFiltros
        }));

    }, [searchParams]);

    // Cargar usuarios cada vez que cambie el filtro o los parámetros de búsqueda en la URL
    useEffect(() => {
        const timer = setTimeout(() => {
            // solo cargar si viene de URL
            if (!hayParams) return;

            const cargarUsuarios = async () => {
                const res = await getUsuarios(filtro);
                setUsuariosData(res.data.data);
            };
            // Evitar cargar si el filtro de propietario está vacío (puede ser el caso al sincronizar con URL sin ese parámetro)
            if (filtro.propietario === "") return;
            cargarUsuarios();
        }, 500);
       
        return () => clearTimeout(timer);

    }, [filtro, hayParams]);

    // Actualizar los parámetros de búsqueda en la URL cada vez que cambie el filtro
    useEffect(() => {
        const params = {};

        Object.entries(filtro).forEach(([key, value]) => {
            if (value) {
                params[key] = value;
            }
        });

        setSearchParams(params);

    }, [filtro, setSearchParams]);

    // Cargar datos de selección para los filtros al montar el componente
    useEffect(() => {
        let isMountedSel = true;

        // Función para cargar datos de selección
        const cargarSelect = async () => {
            try {
                //cargar datos de seleccion
                const res = await getSelectUsuario();

                if (isMountedSel) {
                    setSelEstado(res.data.Estados);
                    setSelAño(res.data.Años);
                }
            } catch (error) {
                console.error("Error:", error);
            }
        };

        cargarSelect();

        return () => {
            isMountedSel = false;
        };

    }, []);

    const handleBuscar = async () => {
        try {
            
            if (filtro.estado === "") {
                filtro.estado = null;
            }
            filtro.pagina = 1; // Reiniciar a la primera página al cambiar el filtro
            filtro.tamañoPagina = 10; // Asegurar que el tamaño de página esté definido
            filtro.propietario = inputPropietario; // Actualizar el filtro con el valor del input
            const res = await getUsuarios(filtro);
            setUsuariosData(res.data.data);

        } catch (error) {
            console.error("Error:", error);
        }
    };

    //logica para abrir perfil de usuario
    const [openPerfil, setOpenPerfil] = useState(false);
    
    const abrirPerfil = useCallback(() => {
        setOpenPerfil(true);
    }, []);

    const cerrarPerfil = useCallback(() => {
        setOpenPerfil(false);
    }, []);

    const registros = useMemo(() => {
        return columnsUsuarios({ isMobile, abrirPerfil });
    }, [isMobile, abrirPerfil]);

    const slots = useMemo(() => ({ toolbar: GridToolbar }), []);

    return (
        
        // Box con padding general y fondo suave
        <Box>
            <Typography variant="h5" component="h1" color="text.primary">
                Gestion de Usuarios
            </Typography>
            <Typography variant="subtitle1" component="h1" color="text.secundary">
                Control de cuentas de usuario
            </Typography>
            <Box sx={{ m: '0px 20px', display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                >
                    Nuevo Usuario
                </Button>
            </Box>
            <Box
                sx={{
                    flexGrow: 1,
                    minHeight: 0,
                    width: '98%',
                    // Estilos para la tabla
                    '& .MuiDataGrid-root': {
                        borderRadius: 2,
                        boxShadow: 3,
                        borderColor: 'grey.300',
                    },
                    '& .header-negrita': {
                        fontWeight: 'bold',
                    },
                }}
            >
                <Box
                    sx={{
                        border: '1px solid #ccc',
                        boxShadow: 3,
                        padding: 2,
                        mb: 2,
                        mt: 2,
                        borderRadius: 2
                    }}
                >
                    <Typography variant="subtitle1" component="h1" color="text.secundary">
                        Búsqueda de cuentas
                    </Typography>
                    <Box
                        sx={{
                            display: "flex",
                            gap: 2,
                            alignItems: "center"
                        }}
                    >
                        <Box sx={{ flexGrow: 1 }}>
                            <Grid container spacing={2}>

                                {/* INPUT → 50% en md, 100% en xs */}
                                <Grid size={{ xs: 12, md: 8 }}>
                                    <Paper
                                        component="form"
                                        sx={{
                                            m: '10px 0px',
                                            p: '2px 2px',
                                            display: 'flex',
                                            alignItems: 'flex-end',
                                            width: '100%' 
                                        }}
                                    >
                                        <InputBase
                                            name="propietario"
                                            sx={{ ml: 1, flex: 1 }}
                                            placeholder="Búscar por nombre del propietario"
                                            value={filtro.propietario === "" ? inputPropietario : filtro.propietario}
                                            onChange={(e) => setInputPropietario(e.target.value)}
                                        />
                                        <IconButton onClick={handleBuscar}>
                                            <SearchIcon />
                                        </IconButton>
                                    </Paper>
                                </Grid>

                                {/* SELECT 1 → 25% en md */}
                                <Grid size={{ xs: 6, md: 2 }}>
                                    <SelectItem
                                        value={selEstado.length ? filtro.estado : ""}
                                        onChange={(estado) =>
                                            setFiltro(prev => ({
                                                ...prev,
                                                estado: estado
                                            }))
                                        }
                                        datos={selEstado}
                                        titulo={"Estados"}
                                    />
                                </Grid>

                                {/* SELECT 2 → 25% en md */}
                                <Grid size={{ xs: 6, md: 2 }}>
                                    <SelectItem
                                        value={
                                            selAño.length && filtro.fechaExpiracionDesde
                                                ? filtro.fechaExpiracionDesde.split("-")[0]
                                                : ""
                                        }
                                        onChange={(año) => {
                                            setAño(año);

                                            if (!año) {
                                                setFiltro(prev => ({
                                                    ...prev,
                                                    fechaExpiracionDesde: null,
                                                    fechaExpiracionHasta: null
                                                }));
                                                return;
                                            }

                                            setFiltro(prev => ({
                                                ...prev,
                                                fechaExpiracionDesde: `${año}-01-01`,
                                                fechaExpiracionHasta: `${año}-12-31`
                                            }));
                                        }}
                                        datos={selAño}
                                        titulo={"Año Vencimiento"}
                                    />
                                </Grid>

                            </Grid>
                        </Box>
                    </Box>
                    
                </Box>
                
                <Typography variant="subtitle1" component="h1" color="text.secundary">
                    Registros de cuentas
                </Typography>

                {/* DataGrid */}
                <DataGrid
                    rows={usuarios}
                    columns={registros} // Columnas con flex: 1 aplicado
                    // Configuramos el GridToolbar
                    slots={slots}
                    initialState={{
                        pagination: { paginationModel: { pageSize: 10 } },
                    }}
                    pageSizeOptions={[5, 10, 25]}
                    localeText={{
                        noRowsLabel: "No hay datos",
                        noResultsOverlayLabel: "No se encontraron resultados",
                        MuiTablePagination: {
                            labelRowsPerPage: "Filas:"
                        }
                    }}
                />
            </Box>

            <PerfilUsuarioDialog
                open={openPerfil}
                onClose={cerrarPerfil}
            />

        </Box>
    )
}

