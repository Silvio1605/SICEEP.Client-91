import { useEffect, useMemo, useCallback } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { DataGrid } from '@mui/x-data-grid';
import Grid from '@mui/material/Grid';
import { useSearchParams } from "react-router-dom";
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import { columnsExpedientes } from '../components/columns/columnsExpediente';
import FiltroExpediente from '../components/FiltroExpediente';
import { useExpediente } from '../hooks/useExpediente'

export default function Expedientes() {

    //const { isMobile } = useScreenType();
    const [searchParams, setSearchParams] = useSearchParams();
    const { expedientes, buscar, page, total } = useExpediente();

    const filtro = useMemo(() => ({
        busqueda: searchParams.get("busqueda") || "",
        estado: searchParams.get("estado") || 1,
        estructura: searchParams.get("estructura") || "",
        cargo: searchParams.get("cargo") || "",
        pagina: 1
    }), [searchParams]);

    // Memorizamos la función para que no cause bucle infinito en el filtro
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
                
                <FiltroExpediente
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
                        disableColumnMenu
                        disableRowSelectionOnClick
                        hideFooterSelectedRowCount
                        disableColumnFilter
                        disableColumnSelector
                        disableDensitySelector
                        pagination
                        paginationMode="server"
                        rowCount={total}
                        paginationModel={{
                            page: page - 1,
                            pageSize: 10
                        }}
                        onPaginationModelChange={(model) => {
                            const nuevoFiltro = {
                                ...filtro,
                                page: model + 1
                            };
                            buscar(nuevoFiltro);
                        }}
                        pageSizeOptions={[10]}
                        disableSelectionOnClick
                        slots={{ toolbar: null }}
                        initialState={{
                            pagination: { paginationModel: { pageSize: 10 } },
                        }}
                        autoHeight={false}
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