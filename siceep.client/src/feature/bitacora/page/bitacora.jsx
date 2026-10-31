import { useEffect, useMemo } from "react";
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import {
    DataGrid,
    GridToolbar,
} from '@mui/x-data-grid';
// React Router
import { useSearchParams } from "react-router-dom";
// extraer datos de la api
import { useBitacora } from "./../hooks/useBitacora";
import { columnsBitacora } from './../components/bitacoraColumns';
import { Stack, Skeleton } from '@mui/material';
import BitacoraFiltro from './../components/bitacoraFiltro';
// media query para detectar el tamaño de pantalla y ajustar la tabla               
import { useScreenType } from './../../../shared/hooks/useScreenType';

export default function Bitacora() {

    const { historial, buscar, total, cargandoHistorial } = useBitacora();
    // para manejar los parámetros de búsqueda en la URL (si es necesario)
    const [searchParams, setSearchParams] = useSearchParams();
    const { isMobile } = useScreenType();

    // datos de la busqueda con filtro
    const filtro = useMemo(() => ({
        busqueda: searchParams.get("busqueda") || searchParams.get("usuario") || null,
        usuario: searchParams.get("usuario") || null,
        fecha: searchParams.get("fecha") || null,
        accion: searchParams.get("accion") || 0,
        pagina: Number(searchParams.get("pagina")) || 1,
        tamañoPagina: Number(searchParams.get("tamañoPagina")) || 10
    }), [searchParams]);

    // Al cambiar un filtro se vuelve a la primera página.
    // Al cambiar de página se conserva la página solicitada.
    const actualizarFiltro = (nuevoFiltro, { resetPagina = true } = {}) => {
        const params = new URLSearchParams(searchParams);

        Object.entries(nuevoFiltro).forEach(([key, value]) => {
            if (value !== null && value !== "" && value !== undefined) {
                params.set(key, value);
            } else {
                params.delete(key);
            }
        });

        if (resetPagina)
            params.set("pagina", "1");

        setSearchParams(params);
    };

    // Carga el historial cada vez que cambia el filtro o la paginación.
    useEffect(() => {
        buscar(filtro).catch((error) => {
            console.error("Error:", error);
        });
    }, [filtro, buscar]);

    const registros = useMemo(() => {
        return columnsBitacora({ isMobile });
    }, [isMobile]);

    const slots = useMemo(() => ({ toolbar: GridToolbar }), []);

    const paginationModel = {
        page: Math.max(0, (Number(filtro.pagina) || 1) - 1),
        pageSize: Number(filtro.tamañoPagina) || 10
    };

    const manejarPaginacion = (model) => {
        actualizarFiltro(
            { pagina: model.page + 1, tamañoPagina: model.pageSize },
            { resetPagina: false }
        );
    };

    return (
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
            <BitacoraFiltro 
                filtro={filtro}
                actualizarFiltro={actualizarFiltro}
            />

            <Typography variant="subtitle1" component="h1" color="text.secundary">
                Historial de acciones del sistema
            </Typography>

            {historial ? (
                <DataGrid
                    rows={historial}
                    columns={registros}
                    slots={slots}
                    loading={cargandoHistorial}
                    paginationMode="server"
                    rowCount={total}
                    paginationModel={paginationModel}
                    onPaginationModelChange={manejarPaginacion}
                    pageSizeOptions={[5, 10, 25]}
                    disableColumnSorting
                    disableColumnFilter
                    localeText={{
                        noRowsLabel: "No hay datos",
                        noResultsOverlayLabel: "No se encontraron resultados",
                        MuiTablePagination: {
                            labelRowsPerPage: "Filas:",
                            labelDisplayedRows: ({ from, to, count }) =>
                                `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`
                        }
                    }}
                />
            ) : (
                <Stack spacing={1}>
                    <Skeleton variant="rectangular" width={'100%'} height={20} />
                    <Skeleton variant="rounded" width={'100%'} height={60} />
                </Stack>
            )}
        </Box>
    );
      
}
