import React, { useState } from 'react';
import {
    Box,
    AppBar,
    Toolbar,
    Typography,
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
    IconButton,
    ThemeProvider,
    createTheme,
    CssBaseline,
    Chip,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
} from '@mui/icons-material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

// ============================================================
// 1. TEMA PERSONALIZADO (Material UI Theme)
// ============================================================
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

// ============================================================
// 2. DATOS DE EJEMPLO (estado inicial)
// ============================================================
const initialUnits = [
    { id: 1, name: 'Dirección General', code: 'DG-001', status: 'Activo', createdAt: '2023-01-15' },
    { id: 2, name: 'Gerencia de Operaciones', code: 'GO-002', status: 'Activo', createdAt: '2023-02-20' },
    { id: 3, name: 'Gerencia de Finanzas', code: 'GF-003', status: 'Inactivo', createdAt: '2023-03-10' },
];

const initialStructures = [
    { id: 1, name: 'Estructura Matriz', code: 'EM-001', status: 'Activo', createdAt: '2023-01-10' },
    { id: 2, name: 'Estructura Regional Norte', code: 'ERN-002', status: 'Activo', createdAt: '2023-04-05' },
];

const initialLocations = [
    { id: 1, name: 'Sede Central', code: 'SC-001', address: 'Av. Principal 123', city: 'Ciudad de México', status: 'Activo', createdAt: '2023-01-01' },
    { id: 2, name: 'Sucursal Guadalajara', code: 'SG-002', address: 'Calle Independencia 456', city: 'Guadalajara', status: 'Activo', createdAt: '2023-05-15' },
];

export default function Ubicacion() {
    // --- Estados ---
    const [selectedTab, setSelectedTab] = useState(0); // 0: Unidades, 1: Estructuras, 2: Ubicaciones
    const [units, setUnits] = useState(initialUnits);
    const [structures, setStructures] = useState(initialStructures);
    const [locations, setLocations] = useState(initialLocations);

    // Estado del modal
    const [openDialog, setOpenDialog] = useState(false);
    const [editingItem, setEditingItem] = useState(null); // null = nuevo registro
    const [formData, setFormData] = useState({});

    // Snackbar para notificaciones
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    // Filtro de búsqueda (texto)
    const [searchText, setSearchText] = useState('');

    // --- Funciones auxiliares para obtener datos y setters según pestaña ---
    const getCurrentData = () => {
        switch (selectedTab) {
            case 0: return units;
            case 1: return structures;
            case 2: return locations;
            default: return [];
        }
    };

    const getSetData = () => {
        switch (selectedTab) {
            case 0: return setUnits;
            case 1: return setStructures;
            case 2: return setLocations;
            default: return () => { };
        }
    };

    const getEntityName = () => {
        return ['Unidad', 'Estructura', 'Ubicación'][selectedTab] || '';
    };

    // --- Columnas de la tabla según la entidad ---
    const getColumns = () => {
        const baseColumns = [
            { field: 'id', headerName: 'ID', width: 70 },
            { field: 'name', headerName: 'Nombre', flex: 1, minWidth: 150 },
            { field: 'code', headerName: 'Código', width: 130 },
            {
                field: 'status',
                headerName: 'Estado',
                width: 120,
                renderCell: (params) => (
                    <Chip
                        label={params.value}
                        size="small"
                        color={params.value === 'Activo' ? 'success' : 'error'}
                        variant="outlined"
                    />
                ),
            },
            { field: 'createdAt', headerName: 'Fecha de creación', width: 150 },
            {
                field: 'actions',
                headerName: 'Acciones',
                width: 120,
                sortable: false,
                renderCell: (params) => (
                    <Box>
                        <IconButton
                            color="primary"
                            size="small"
                            onClick={() => handleEdit(params.row)}
                            aria-label="copiar"
                        >
                            <ContentCopyIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                            color="primary"
                            size="small"
                            onClick={() => console.log('copiar')}
                            aria-label="copiar" 
                        >
                            <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                            color="error"
                            size="small"
                            onClick={() => handleDelete(params.row.id)}
                            aria-label="eliminar"
                        >
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                    </Box>
                ),
            },
        ];

        // Para Ubicaciones, intercalamos columnas de dirección
        if (selectedTab === 2) {
            const locationColumns = [
                { field: 'address', headerName: 'Dirección', flex: 1, minWidth: 150 },
                { field: 'city', headerName: 'Ciudad', flex: 0.7, minWidth: 120 },
            ];
            // Insertamos después de 'code'
            return [
                baseColumns[0], // id
                baseColumns[1], // name
                baseColumns[2], // code
                ...locationColumns,
                baseColumns[3], // status
                baseColumns[4], // createdAt
                baseColumns[5], // actions
            ];
        }
        return baseColumns;
    };

    // --- Filtrado de datos por búsqueda ---
    const getFilteredData = () => {
        const data = getCurrentData();
        if (!searchText.trim()) return data;
        const lowerSearch = searchText.toLowerCase();
        return data.filter((item) =>
            item.name.toLowerCase().includes(lowerSearch) ||
            item.code.toLowerCase().includes(lowerSearch)
        );
    };

    // --- Manejadores de eventos ---
    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
        setEditingItem(null);
        setFormData({});
        setSearchText(''); // Limpia búsqueda al cambiar de pestaña
    };

    const handleOpenCreate = () => {
        setEditingItem(null);
        setFormData({ status: 'Activo' }); // valor por defecto
        setOpenDialog(true);
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        setFormData(item);
        setOpenDialog(true);
    };

    const handleDelete = (id) => {
        // En una app real, mostraríamos un diálogo de confirmación
        // y luego llamaríamos a la API.
        const currentData = getCurrentData();
        const setData = getSetData();
        const newData = currentData.filter((item) => item.id !== id);
        setData(newData);
        setSnackbar({
            open: true,
            message: `${getEntityName()} eliminada correctamente.`,
            severity: 'success',
        });
    };

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

        const currentData = getCurrentData();
        const setData = getSetData();

        if (editingItem) {
            // Editar
            const updatedData = currentData.map((item) =>
                item.id === editingItem.id ? { ...formData, id: item.id } : item
            );
            setData(updatedData);
            setSnackbar({
                open: true,
                message: `${getEntityName()} actualizada correctamente.`,
                severity: 'success',
            });
        } else {
            // Crear nuevo
            const newItem = {
                ...formData,
                id: Math.max(0, ...currentData.map((o) => o.id)) + 1,
                createdAt: new Date().toISOString().split('T')[0],
                status: formData.status || 'Activo',
            };
            setData([...currentData, newItem]);
            setSnackbar({
                open: true,
                message: `${getEntityName()} creada correctamente.`,
                severity: 'success',
            });
        }
        setOpenDialog(false);
        setEditingItem(null);
        setFormData({});
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditingItem(null);
        setFormData({});
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const handleFormChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        });
    };

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
                        <TextField
                            fullWidth
                            label="Buscar por nombre o código"
                            variant="outlined"
                            size="small"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            InputProps={{ sx: { borderRadius: 2, backgroundColor: 'white' } }}
                        />
                    </Box>

                    {/* Tabla de datos */}
                    <Paper sx={{ height: 'calc(100% - 180px)', width: '100%', p: 1 }}>
                        <DataGrid
                            rows={getFilteredData()}
                            columns={getColumns()}
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
            <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
                <DialogTitle sx={{ fontWeight: 600, color: 'primary.main' }}>
                    {editingItem ? `Editar ${getEntityName()}` : `Nueva ${getEntityName()}`}
                </DialogTitle>
                <DialogContent dividers>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Nombre"
                                name="name"
                                value={formData.name || ''}
                                onChange={handleFormChange}
                                required
                                variant="outlined"
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Código"
                                name="code"
                                value={formData.code || ''}
                                onChange={handleFormChange}
                                variant="outlined"
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Estado"
                                name="status"
                                value={formData.status || 'Activo'}
                                onChange={handleFormChange}
                                select
                                SelectProps={{ native: true }}
                                variant="outlined"
                                size="small"
                            >
                                <option value="Activo">Activo</option>
                                <option value="Inactivo">Inactivo</option>
                            </TextField>
                        </Grid>
                        {/* Campos específicos para Ubicación */}
                        {selectedTab === 2 && (
                            <>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Dirección"
                                        name="address"
                                        value={formData.address || ''}
                                        onChange={handleFormChange}
                                        variant="outlined"
                                        size="small"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Ciudad"
                                        name="city"
                                        value={formData.city || ''}
                                        onChange={handleFormChange}
                                        variant="outlined"
                                        size="small"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Código Postal"
                                        name="postalCode"
                                        value={formData.postalCode || ''}
                                        onChange={handleFormChange}
                                        variant="outlined"
                                        size="small"
                                    />
                                </Grid>
                            </>
                        )}
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={handleCloseDialog} color="inherit">
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleSave}
                        variant="contained"
                        color="secondary"
                        sx={{ borderRadius: 2, boxShadow: 'none' }}
                    >
                        Guardar
                    </Button>
                </DialogActions>
            </Dialog>

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