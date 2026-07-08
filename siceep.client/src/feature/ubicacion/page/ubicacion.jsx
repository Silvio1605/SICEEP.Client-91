import React, { useState } from 'react';
import {
    Box,
    Tabs,
    Tab,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Grid,
    Paper,
    Snackbar,
    Alert,
    ThemeProvider,
    createTheme,
    CssBaseline,
    Chip,
    Stack
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import {
    Add as AddIcon,
} from '@mui/icons-material';

import SearchIcon from '@mui/icons-material/Search';
import { getColumns } from './../components/getColumns';
import { useUnidades } from './../hooks/useUnidades';
import { useEstructuras } from './../hooks/useEstructuras';
import { useUbicaciones } from './../hooks/useUbicaciones';
import CardCrear from './../components/cardCrear';

const theme = createTheme({
    palette: {
        primary: {
            main: '#1a3b5d', // Azul corporativo
        },
        secondary: {
            main: '#2e7d32', // Verde para acciones positivas
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

    const { data: unidades, search: searchUnidades } = useUnidades();
    const { data: estructuras, search: searchEstructuras } = useEstructuras();
    const { data: ubicaciones, search: searchUbicaciones } = useUbicaciones();

    // Estados 
    const [selectedTab, setSelectedTab] = useState(0); // 0: Unidades, 1: Estructuras, 2: Ubicaciones

    // Estado del modal
    const [openDialog, setOpenDialog] = useState(false);
    //const [formData, setFormData] = useState({});

    // Snackbar para notificaciones
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

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

    const getEntityName = () => {
        return ['Unidad', 'Estructura', 'Ubicación'][selectedTab] || '';
    };

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
        //setFormData({});
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
        //setFormData({ status: 'Activo' }); 
        setOpenDialog(true);
    };
    const handleSearch = () => {
        switch (selectedTab) {
            case 0: return searchUnidades(searchText, 1);
            case 1: return searchEstructuras(searchText, 1);
            case 2: return searchUbicaciones(searchText, 1);
            default: return [];
        }
    };

    const handleDelete = () => {
        
        setSnackbar({
            open: true,
            message: `${getEntityName()} eliminada correctamente.`,
            severity: 'success',
        });
    };
    /*
    const handleSave = () => {
        // Validación simple
        if (!formData.name || formData.name.trim() === '') {
            setSnackbar({
                open: true,
                message: 'El campo "Nombre" es obligatorio.',
                severity: 'error',
            });
            return;
        }

        // Crear nuevo
        setSnackbar({
            open: true,
            message: `${getEntityName()} creada correctamente.`,
            severity: 'success',
        });

        setOpenDialog(false);
        setFormData({});
    };*/

    const handleCloseDialog = () => {
        setOpenDialog(false);
        //setFormData({});
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    /*
    const handleFormChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        });
    };*/

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
               
                {/* Contenido principal */}
                <Box sx={{ flexGrow: 1, p: 3, backgroundColor: 'background.default', overflow: 'auto' }}>
                    {/* Cabecera con tabs y botón agregar */}
                    <Paper elevation={0} sx={{ p: 2, mb: 3, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
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
                                onClick={handleSearch}
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
                            columns={getColumns({ handleDelete, selectedTab })}
                            pageSize={10}
                            rowsPerPageOptions={[10, 25, 50, 100]}
                            pagination
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

            {/* Modal de creación/edición */}
            <CardCrear
                open={openDialog}
                onClose={handleCloseDialog}
            />

            {/* Snackbar de notificaciones */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%', borderRadius: 2 }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
            
        </ThemeProvider>
    );
}