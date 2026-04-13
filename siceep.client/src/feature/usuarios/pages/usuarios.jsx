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
import { useUsuarios } from './../hooks/useUsuarios';
// componentes
import FiltrosBusqueda from '../components/filtrosBusqueda';
// loading
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';

export default function Usuarios() {

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const { usuarios, buscar } = useUsuarios();
    // para manejar los parámetros de búsqueda en la URL (si es necesario)
    const [searchParams, setSearchParams] = useSearchParams();

    //datos de la busqueda con filtro
    const filtro = useMemo(() => ({
        propietario: searchParams.get("propietario") || null,
        fechaExpiracionDesde: searchParams.get("fechaExpiracionDesde") || null,
        fechaExpiracionHasta: searchParams.get("fechaExpiracionHasta") || null,
        estado: searchParams.get("estado") || null,
        pagina: Number(searchParams.get("pagina")) || 1,
        tamañoPagina: Number(searchParams.get("tamañoPagina")) || 10
    }), [searchParams]);

    const actualizarFiltro = (nuevoFiltro) => {
        const params = new URLSearchParams(searchParams);

        Object.entries(nuevoFiltro).forEach(([key, value]) => {
            if (value !== null && value !== "" && value !== undefined) {
                params.set(key, value);
            } else {
                params.delete(key);
            }
        });
        setSearchParams(params);
    };

    // Cargar usuarios cada vez que cambie el filtro o los parámetros de búsqueda en la URL
    useEffect(() => {
        const timer = setTimeout(() => {
            const cargarDatos = async () => {
                try {
                    await buscar(filtro);
                } catch (error) {
                    console.error("Error:", error);
                }
            };
            cargarDatos();
        }, 500);
        return () => clearTimeout(timer);
    }, [filtro, buscar]);

    //logica para abrir perfil de usuario
    const [openPerfil, setOpenPerfil] = useState(false);
    const abrirPerfil = useCallback(() => {
        setOpenPerfil(true);
    }, []);
    const cerrarPerfil = useCallback(() => {
        setOpenPerfil(false);
    }, []);

    // 
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
                <FiltrosBusqueda
                    filtro={filtro}
                    actualizarFiltro={actualizarFiltro}
                />
                
                <Typography variant="subtitle1" component="h1" color="text-secundary">
                    Registros de cuentas
                </Typography>

                {usuarios ? (
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
                ): (
                    <Stack spacing={1}>
                         {/* For variant="text", adjust the height via font-size */}
                          <Skeleton variant="rectangular" width={'100%'} height={20} />
                         <Skeleton variant="rounded" width={'100%'} height={60} />
                    </Stack>
                )}
            </Box>

            <PerfilUsuarioDialog
                open={openPerfil}
                onClose={cerrarPerfil}
            />

        </Box>
    )
}

