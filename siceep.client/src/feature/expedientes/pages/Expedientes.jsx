import { useState, useMemo, useCallback } from 'react'; // ✅ Importamos useCallback
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { DataGrid } from '@mui/x-data-grid';
import Grid from '@mui/material/Grid';
import { useSearchParams } from "react-router-dom";
import { columnsExpedientes } from '../services/expedientesData';
import FiltrosBusqueda from '../../usuarios/components/FiltrosBusqueda';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import { useScreenType } from '../../../shared/hooks/useScreenType';

export default function Expedientes() {
    const { isMobile } = useScreenType();
    const [searchParams, setSearchParams] = useSearchParams();

    const [expedientes, setExpedientes] = useState([
        { id: 1, ident: 'EXP-001', nombreCompleto: 'Juan Perez', ubicacion: 'Managua', estado: 'Activo' },
        { id: 2, ident: 'EXP-002', nombreCompleto: 'Ana Lopez', ubicacion: 'Leon', estado: 'Inactivo' },
        { id: 3, ident: 'EXP-003', nombreCompleto: 'Carlos Gomez', ubicacion: 'Estelí', estado: 'Activo' },
    ]);

    const filtro = useMemo(() => ({
        propietario: searchParams.get("propietario") || null,
        estado: searchParams.get("estado") || null,
    }), [searchParams]);

    // ✅ SOLUCIÓN 2: Memorizamos la función para que no cause bucle infinito en el filtro
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

    const buscar = useCallback(() => {
        console.log("Buscando con filtros:", filtro);
    }, [filtro]);

    const registros = useMemo(() => {
        return columnsExpedientes();
    }, []);

    return (
        <Box sx={{ width: '100%', pb: 5 }}>
            <Box sx={{ mb: 3 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12}>
                        <Typography variant="h5" component="h1" color="text.primary">
                            Búsqueda de Expedientes
                        </Typography>
                        <Typography variant="subtitle1" component="h1" color="text.secondary">
                            Consulta centralizada de expedientes del personal
                        </Typography>
                    </Grid>
                </Grid>
            </Box>

            <Box sx={{ width: '100%', minWidth: 0, minHeight: 0 }}>
                <FiltrosBusqueda
                    filtro={filtro}
                    actualizarFiltro={actualizarFiltro}
                    buscar={buscar}
                />

                <Typography variant="subtitle1" component="h1" color="text.secondary" sx={{ mt: 2, mb: 1 }}>
                    Registros de expedientes
                </Typography>

                {expedientes ? (
                    <DataGrid
                        rows={expedientes}
                        columns={registros}
                        autoHeight
                        disableColumnMenu
                        disableRowSelectionOnClick
                        hideFooterSelectedRowCount
                        disableColumnFilter
                        disableColumnSelector
                        disableDensitySelector
                        slots={{ toolbar: null }}
                        initialState={{
                            pagination: { paginationModel: { pageSize: 10 } },
                        }}
                        pageSizeOptions={[5, 10, 25]}
                        localeText={{
                            noRowsLabel: "No hay expedientes",
                            noResultsOverlayLabel: "No se encontraron resultados",
                            MuiTablePagination: { labelRowsPerPage: "Filas:" }
                        }}
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
        </Box>
    );
}