import { useEffect, useState, useCallback, useMemo } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { DataGrid } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import { useSearchParams } from "react-router-dom";
import { columnsUsuarios } from './../services/usuariosData';
import { useUsuarios } from './../hooks/useUsuarios';
import FiltrosBusqueda from '../components/FiltrosBusqueda';
import Perfil from '../components/Perfil';
import CardReestrablecerContra from '../components/CardReestrablecerContra';
import CardRegistrar from '../components/CardRegistrar';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import { useScreenType } from './../../../shared/hooks/useScreenType';
import { PermisoProvider } from './../../../providers/Permisos/PermisoProvider';
import { useBusquedaContext } from './../../../providers/BusquedaUsers/useBusquedaContext';
import AppButton from './../../../shared/components/AppButton';

export default function Usuarios() {
    const { isMobile } = useScreenType();
    const { usuarios, buscar } = useUsuarios();
    const [searchParams, setSearchParams] = useSearchParams();
    const { idSeleccionado } = useBusquedaContext();

    const filtro = useMemo(() => ({
        propietario: searchParams.get("propietario") || null,
        fechaExpiracionDesde: searchParams.get("fechaExpiracionDesde") || null,
        fechaExpiracionHasta: searchParams.get("fechaExpiracionHasta") || null,
        estado: searchParams.get("estado") || null,
        pagina: Number(searchParams.get("pagina")) || 1,
        tamañoPagina: Number(searchParams.get("tamañoPagina")) || 10
    }), [searchParams]);

    // 🛠️ SOLUCIÓN 1: Memorizamos el filtro para que no rompa la memoria al navegar
    const actualizarFiltro = useCallback((nuevoFiltro) => {
        const params = new URLSearchParams(searchParams);
        Object.entries(nuevoFiltro).forEach(([key, value]) => {
            if (value !== null && value !== "" && value !== undefined) {
                params.set(key, value);
            } else {
                params.delete(key);
            }
        });
        setSearchParams(params);
    }, [searchParams, setSearchParams]);

    // 🛠️ SOLUCIÓN 2: Rompemos el bucle infinito del useEffect
    useEffect(() => {
        const cargarDatos = async () => {
            try {
                await buscar(filtro);
            } catch (error) {
                console.error("Error:", error);
            }
        };
        cargarDatos();

        // Ignoramos la función 'buscar' a propósito en las dependencias. 
        // Como dedujo Silvio, los cambios de estado en permisos y búsquedas 
        // forzaban a 'buscar' a recargarse y congelaba React Router.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filtro]);

    const [openCambioContra, setOpenCambioContra] = useState(false);
    const abrirCambioContra = useCallback(() => setOpenCambioContra(true), []);
    const cerrarCambioContra = useCallback(() => setOpenCambioContra(false), []);

    const [openPerfil, setOpenPerfil] = useState(false);
    const abrirPerfil = useCallback(() => setOpenPerfil(true), []);
    const cerrarPerfil = useCallback(() => setOpenPerfil(false), []);

    // 🛠️ SOLUCIÓN 3: Memorizamos también la apertura del registro
    const [openReg, setOpenReg] = useState(false);
    const abrirReg = useCallback(() => setOpenReg(true), []);
    const closeReg = useCallback(() => setOpenReg(false), []);

    const registros = useMemo(() => {
        return columnsUsuarios({ isMobile, abrirPerfil, abrirCambioContra });
    }, [isMobile, abrirPerfil, abrirCambioContra]);

    return (
        <Box sx={{ width: '100%', pb: 5 }}>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box>
                    <Typography variant="h5" component="h1" color="text.primary">Gestion de Usuarios</Typography>
                    <Typography variant="subtitle1" component="h1" color="text.secondary">Control de cuentas de usuario</Typography>
                </Box>
                <Box>
                    <AppButton isfullWidth={false} colorBtn="primary" iconBtn={<AddIcon />} content="Registrar" onClick={abrirReg} />
                </Box>
            </Box>

            <Box sx={{ width: '100%', minWidth: 0, minHeight: 0 }}>
                <FiltrosBusqueda filtro={filtro} actualizarFiltro={actualizarFiltro} buscar={buscar} />

                <Typography variant="subtitle1" component="h1" color="text.secondary" sx={{ mt: 2, mb: 1 }}>Registros de cuentas</Typography>

                {usuarios ? (
                    <DataGrid
                        rows={usuarios}
                        columns={registros}
                        autoHeight
                        disableColumnMenu
                        disableRowSelectionOnClick
                        hideFooterSelectedRowCount
                        disableColumnFilter
                        disableColumnSelector
                        disableDensitySelector
                        slots={{ toolbar: null }}
                        initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
                        pageSizeOptions={[5, 10, 25]}
                        localeText={{ noRowsLabel: "No hay datos", noResultsOverlayLabel: "No se encontraron resultados", MuiTablePagination: { labelRowsPerPage: "Filas:" } }}
                        sx={{
                            border: 'none',
                            backgroundColor: '#ffffff',
                            '& .MuiDataGrid-columnHeaders': { borderBottom: 'none', backgroundColor: '#f8f9fa' },
                            '& .MuiDataGrid-cell': { borderBottom: '1px solid #f0f0f0' },
                            '& .header-negrita': { fontWeight: 'bold' },
                        }}
                    />
                ) : (
                    <Stack spacing={1}>
                        <Skeleton variant="rectangular" width={'100%'} height={20} />
                        <Skeleton variant="rounded" width={'100%'} height={60} />
                    </Stack>
                )}
            </Box>

            <PermisoProvider idUsuario={idSeleccionado}>
                <Perfil open={openPerfil} onClose={cerrarPerfil} buscar={buscar} filtro={filtro} />
                <CardReestrablecerContra open={openCambioContra} onClose={cerrarCambioContra} id={idSeleccionado} />
            </PermisoProvider>

            <CardRegistrar open={openReg} onClose={closeReg} />
        </Box>
    );
}