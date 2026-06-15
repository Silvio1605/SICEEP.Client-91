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
import BitacoraFiltro from './../components/bitacoraFiltro';
// media query para detectar el tamaño de pantalla y ajustar la tabla               
import { useScreenType } from './../../../shared/hooks/useScreenType';

export default function Bitacora() {

    const { historial, buscar } = useBitacora();
    // para manejar los parámetros de búsqueda en la URL (si es necesario)
    const [searchParams, setSearchParams] = useSearchParams();
    const { isMobile } = useScreenType();

    //datos de la busqueda con filtro
    const filtro = useMemo(() => ({
        usuario: searchParams.get("usuario") || null,
        fecha: searchParams.get("fecha") || null,
        accion: searchParams.get("accion") || 0,
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

    const registros = useMemo(() => {
        return columnsBitacora({ isMobile });
    }, [isMobile]);

    const slots = useMemo(() => ({ toolbar: GridToolbar }), []);

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
            {/* componente para el filtro de busqueda */}
            <BitacoraFiltro 
                filtro={filtro}
                actualizarFiltro={actualizarFiltro}
                buscar={buscar}
            />

            <Typography variant="subtitle1" component="h1" color="text.secundary">
                Historial de acciones del sistema
            </Typography>

            {historial ? (
                <DataGrid
                    rows={historial}
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
    );
      
}