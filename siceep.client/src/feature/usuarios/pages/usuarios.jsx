/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useState, useCallback, useMemo } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import {
    DataGrid,
    GridToolbar,
} from '@mui/x-data-grid';
import { useTheme, useMediaQuery } from "@mui/material";
import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PerfilUsuarioDialog from './../components/MenuAccionesUsuarios';
// React Router
import { useSearchParams } from "react-router-dom";
// extraer datos de la api
import { columnsUsuarios } from './../services/usuariosData';
import { getUsuarios } from './../services/usuarioService';
//import { usuarios, buscar } from './../hooks/useUsuarios';
// componentes
import FiltrosBusqueda from '../components/filtrosBusqueda';

export default function usuarios() {

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    //datos de la busqueda con filtro
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

            if (filtro.estado === "") {
                filtro.estado = null;
            }
            filtro.pagina = 1; // Reiniciar a la primera página al cambiar el filtro
            filtro.tamañoPagina = 10; // Asegurar que el tamaño de página esté definido

            const cargarUsuarios = async () => {
                const res = await getUsuarios(filtro);
                setUsuariosData(res.data.data);
            };
            // Evitar cargar si el filtro de propietario está vacío (puede ser el caso al sincronizar con URL sin ese parámetro)
            if (filtro.propietario === "") return;
            //buscar(filtro);
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
   
    const handleBuscar = async () => {
        try {
            
            if (filtro.estado === "") {
                filtro.estado = null;
            }
            filtro.pagina = 1; // Reiniciar a la primera página al cambiar el filtro
            filtro.tamañoPagina = 10; // Asegurar que el tamaño de página esté definido
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
                {/* componente para el filtro de busqueda */}
                <FiltrosBusqueda filtro={filtro} setFiltro={setFiltro} handleBuscar={ handleBuscar } />
                
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

