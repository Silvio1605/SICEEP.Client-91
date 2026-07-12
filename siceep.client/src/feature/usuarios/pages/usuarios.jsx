import { useEffect, useState, useCallback, useMemo } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import {
    DataGrid,
    GridToolbar,
} from '@mui/x-data-grid';
import Grid from '@mui/material/Grid';
import AddIcon from '@mui/icons-material/Add';
// React Router
import { useSearchParams } from "react-router-dom";
// extraer datos de la api
import { columnsUsuarios } from './../services/usuariosData';
import { useUsuarios } from './../hooks/useUsuarios';
// componentes
import FiltrosBusqueda from '../components/FiltrosBusqueda';
import Perfil from '../components/Perfil';
import CardReestrablecerContra from '../components/CardReestrablecerContra';
import CardRegistrar from './../components/Registrar/CardRegistrar';
// loading
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
// media query para detectar el tamaño de pantalla y ajustar la tabla               
import { useScreenType } from './../../../shared/hooks/useScreenType';
// hooks
import { PermisoProvider } from './../../../providers/Permisos/PermisoProvider';
import { useBusquedaContext } from './../../../providers/BusquedaUsers/useBusquedaContext';
// componentes personalizados
import AppButton from './../../../shared/components/AppButton';

export default function Usuarios() {

    const { isMobile } = useScreenType();

    const { usuarios, buscar } = useUsuarios();
    // para manejar los parámetros de búsqueda en la URL (si es necesario)
    const [searchParams, setSearchParams] = useSearchParams();

    var { idSeleccionado } = useBusquedaContext();

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
        const cargarDatos = async () => {
            try {
                await buscar(filtro);
            } catch (error) {
                console.error("Error:", error);
            }
        };
        cargarDatos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    //logica para abrir card de reestablecer contraseña
    const [openCambioContra, setOpenCambioContra] = useState(false);
    const abrirCambioContra = useCallback(() => {
        setOpenCambioContra(true);
    }, []);
    const cerrarCambioContra = useCallback(() => {
        setOpenCambioContra(false);
    }, []);

    //logica para abrir perfil de usuario
    const [openPerfil, setOpenPerfil] = useState(false);
    const abrirPerfil = useCallback(() => {
        setOpenPerfil(true);
    }, []);
    const cerrarPerfil = useCallback(() => {
        setOpenPerfil(false);
    }, []);

    const [openReg, setOpenReg] = useState(false);

    const abrirReg = () => {
        setOpenReg(true);
    };
    const closeReg = () => {
        setOpenReg(false);
    };

    const registros = useMemo(() => {
        return columnsUsuarios({ isMobile, abrirPerfil, abrirCambioContra });
    }, [isMobile, abrirPerfil, abrirCambioContra]);

    const slots = useMemo(() => ({ toolbar: GridToolbar }), []);

    return (
        <Box>
            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                <Box sx={{ flexGrow: 1 }}>
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 7, sm: 9, md: 10 }}>
                            <Typography variant="h5" component="h1" color="text.primary">
                                Gestion de Usuarios
                            </Typography>
                            <Typography variant="subtitle1" component="h1" color="text.secundary">
                                Control de cuentas de usuario
                            </Typography>
                        </Grid>
                        <Grid size={{ xs: 5, sm: 3, md: 2 }}>
                            <AppButton
                                isfullWidth={false}
                                colorBtn="primary"
                                iconBtn={<AddIcon />}
                                content="Registrar"
                                onClick={abrirReg}
                            />
                        </Grid>
                    </Grid>
                </Box>
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
                    buscar={buscar}
                />

                <Typography variant="subtitle1" component="h1" color="text.secundary">
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
                ) : (
                    <Stack spacing={1}>
                        {/* For variant="text", adjust the height via font-size */}
                        <Skeleton variant="rectangular" width={'100%'} height={20} />
                        <Skeleton variant="rounded" width={'100%'} height={60} />
                    </Stack>
                )}
            </Box>
            <PermisoProvider idUsuario={idSeleccionado}>
                <Perfil
                    open={openPerfil}
                    onClose={cerrarPerfil}
                    buscar={buscar}
                    filtro={ filtro }
                />

                <CardReestrablecerContra
                    open={openCambioContra}
                    onClose={cerrarCambioContra}
                    id={idSeleccionado}
                />
            </PermisoProvider>
            <CardRegistrar
                open={openReg}
                onClose={closeReg}
            />
        </Box>
        
    )
}

