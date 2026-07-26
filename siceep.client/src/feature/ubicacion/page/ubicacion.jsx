import { Add as AddIcon } from '@mui/icons-material';
import SearchIcon from '@mui/icons-material/Search';
import {
    Box,
    Button,
    CssBaseline,
    Paper,
    Stack,
    Tab,
    Tabs,
    TextField,
    ThemeProvider,
    createTheme
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import React, { useState } from 'react';
import ModalManager from '../../../shared/components/Modal/ModalManager';
import useModalManager from '../../../shared/hooks/useModalManager';
import { useNotificacionContext } from './../../../providers/Notificacion/useNotificacionContext';
import CardCrear from './../components/cardCrear';
import { getColumns } from './../components/getColumns';
import { useEstructuras } from './../hooks/useEstructuras';
import { useUbicaciones } from './../hooks/useUbicaciones';
import { useUnidades } from './../hooks/useUnidades';

const theme = createTheme({
    palette: {
        secondary: {
            main: '#2e7d32',
        },
        background: {
            default: '#f4f6f8',
        },
    },
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        h6: { fontWeight: 600 },
        button: { textTransform: 'none' },
    },
    components: {
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    boxShadow: '0px 2px 8px rgba(0,0,0,0.04)',
                },
            },
        },
        MuiDialog: {
            styleOverrides: {
                paper: { borderRadius: 16, padding: '4px' },
            },
        },
    },
});

export default function Ubicacion() {

    const modal = useModalManager();

    // Notificaciones
    const { mostrarNotificacion } = useNotificacionContext();

    const { data: unidades, search: searchUnidades, page : pagUnidad, totalRegistros : totalUnidad } = useUnidades();
    const { data: estructuras, search: searchEstructuras, page: pagEstructura, totalRegistros: totalE } = useEstructuras();
    const { data: ubicaciones,
        search: searchUbicaciones,
        page: pagUbicacion,
        totalRegistros: totalU, registrar, actualizar } = useUbicaciones();

    // Estados
    const [selectedTab, setSelectedTab] = useState(0); // 0: Unidades, 1: Estructuras, 2: Ubicaciones

    // Filtro de búsqueda (texto)
    const [searchText, setSearchText] = useState('');

    // --- Funciones auxiliares para obtener datos y setters según pestaña ---
    const getCurrentData = () => {
        switch (selectedTab) {
            case 0: return unidades;
            case 1: return estructuras;
            case 2: return ubicaciones;
            default: return [];
        }
    };

    const getPage = () => {
        switch (selectedTab) {
            case 0: return pagUnidad;
            case 1: return pagEstructura;
            case 2: return pagUbicacion;
            default: return 1;
        }
    }

    const getTotal = () => {
        switch (selectedTab) {
            case 0: return totalUnidad;
            case 1: return totalE;
            case 2: return totalU;
            default: return 0;
        }
    }

    // --- Filtrado de datos por búsqueda ---
    const getFilteredData = () => {
        const data = getCurrentData();

        if (!searchText.trim()) return data;

        const lowerSearch = searchText.toLowerCase();

        switch (selectedTab) {
            case 0: // Unidades
            case 1: // Estructuras
                return data.filter(item =>
                    (item.descripcion ?? "").toLowerCase().includes(lowerSearch) ||
                    String(item.codigo ?? "").toLowerCase().includes(lowerSearch)
                );
            case 2: // Ubicaciones
                return data.filter(item =>
                    (item.estructura ?? "").toLowerCase().includes(lowerSearch) ||
                    (item.unidad ?? "").toLowerCase().includes(lowerSearch) ||
                    (item.estado ?? "").toLowerCase().includes(lowerSearch)
                );
            default:
                return data;
        }
    };

    // Manejadores de eventos
    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);

        setSearchText('');
        // Refrescar los datos de la nueva pestaña
        switch (newValue) {
            case 0: searchUnidades("", 1); break;
            case 1: searchEstructuras("", 1); break;
            case 2: searchUbicaciones("", 1); break;
            default: break;
        }
    };

    const handleOpenCreate = () => {

        var titulo = (selectedTab === 1) ? "Registrar Estructura" : "Registrar Unidad Administrativa";

        // registrar estructura
        if (selectedTab === 2) {
            
            modal.abrirModal("registrarUbicacion", {
                tipo: selectedTab,
                titulo: titulo,
                registrar: registrar,
                refrescar: handleSearch
            })
        } else {
            modal.abrirModal("registrarEstUnidad", {
                tipo: selectedTab,
                titulo: titulo,
                refrescar: handleSearch
            })
        }
    };

    const handleSearch = async (model = 1) => {
        switch (selectedTab) {
            case 0: return await searchUnidades(searchText, model);
            case 1: return await searchEstructuras(searchText, model);
            case 2: return await searchUbicaciones(searchText, model);
            default: return [];
        }
    };

    const handleDelete = async (id, estado) => {

        // cambiar estado, si esta inactivo, enviar 1 para activar
        var activo = estado === "Inactivo" ? 1 : 0;
        try {
            const resultado = await actualizar(id, activo);
            if (resultado.status == 200) {
                mostrarNotificacion({
                    message: resultado.data.message,
                    severity: "success",
                });
            }

            await handleSearch();

        } catch (error) {

            if (error.response) {
                // La API respondió con un error (400, 409, 500, etc.)
                mostrarNotificacion({
                    message: error.response.data.message,
                    severity: "error",
                });
      
            } else if (error.request) {
                // La petición se envió pero no hubo respuesta
                mostrarNotificacion({
                    message: "No se pudo conectar con el servidor.",
                    severity: "error",
                });
            } else {
                // Error al crear la petición
                mostrarNotificacion({
                    message: error.message,
                    severity: "error",
                });
            }
        }
        
    };

    const handleEdit = (row) => {

        var titulo = (selectedTab === 1) ? "Editar Estructura" : "Editar Unidad Administrativa";
        const datos = {
            id: row.id,
            descripcion: row.descripcion
        };

        // Solo las estructuras tienen orden
        if (selectedTab === 1) {
            datos.orden = row.orden;
        }

        modal.abrirModal("registrarEstUnidad", {
            tipo: selectedTab,
            titulo: titulo,
            editar: datos,
            refrescar: handleSearch
        })
    }

    return (

        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
               
                {/* Contenido principal */}
                <Box sx={{ flexGrow: 1, p: 3, backgroundColor: 'background.default', overflow: 'auto' }}>
                    {/* Cabecera con tabs y botón agregar */}
                    <Paper elevation={0}
                        sx={{ p: 2, mb: 3, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Tabs
                            value={selectedTab}
                            onChange={handleTabChange}
                            indicatorColor="primary"
                            textColor="primary"
                            sx={{ '& .MuiTab-root': { fontWeight: 500, fontSize: '0.9rem' } }}
                        >
                            <Tab label="Unidades" />
                            <Tab label="Estructuras" />
                            <Tab label="Ubicaciones" />
                        </Tabs>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<AddIcon />}
                            onClick={handleOpenCreate}
                            sx={{ borderRadius: 2, boxShadow: 'none', mt: { xs: 1, sm: 0 } }}
                        >
                            Agregar Nuevo
                        </Button>
                    </Paper>

                    {/* Filtro de búsqueda */}
                    <Box sx={{ mb: 3 }}>
                        <Stack direction="row" spacing={2}>
                            <TextField
                                fullWidth
                                label="Buscar por nombre o código"
                                variant="outlined"
                                size="small"
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                InputProps={{
                                    sx: {
                                        borderRadius: 2,
                                        backgroundColor: 'white',
                                    },
                                }}
                            />

                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<SearchIcon />}
                                onClick={() => handleSearch()}
                                sx={{
                                    borderRadius: 2,
                                    minWidth: 130,
                                }}
                            >
                                Buscar
                            </Button>
                        </Stack>
                    </Box>

                    {/* Tabla de datos */}
                    <Paper sx={{ height: 'calc(100% - 180px)', width: '100%', p: 1 }}>
                        <DataGrid
                            rows={getFilteredData()}
                            columns={getColumns({ handleDelete, handleEdit,selectedTab })}
                            pagination
                            paginationMode="server"
                            rowCount={getTotal()}
                            paginationModel={{
                                page: getPage() - 1,
                                pageSize: 10
                            }}
                            onPaginationModelChange={(model) => {
                                handleSearch(model.page + 1);
                            }}
                            pageSizeOptions={[10]}
                            disableSelectionOnClick
                            autoHeight={false}
                            sx={{
                                border: 'none',
                                '& .MuiDataGrid-columnHeaders': {
                                    backgroundColor: '#f8fafc',
                                    fontWeight: 600,
                                    color: '#1a3b5d',
                                },
                                '& .MuiDataGrid-cell': {
                                    borderBottom: '1px solid #f0f0f0',
                                },
                                '& .MuiDataGrid-footerContainer': {
                                    borderTop: '1px solid #f0f0f0',
                                },
                            }}
                        />
                    </Paper>
                </Box>
            </Box>

            <ModalManager
                modal={modal}
                onClose={modal.cerrarModal}
                {...modal.props}
            />

        </ThemeProvider>
    );
}