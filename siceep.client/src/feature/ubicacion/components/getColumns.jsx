import { Box, IconButton, Chip } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

// Columna de acciones (reutilizable)
const actionsColumn = (handleDelete) => ({
    field: 'acciones',
    headerName: 'Acciones',
    width: 120,
    sortable: false,
    renderCell: (params) => (
        <Box>
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
});

// Columnas específicas de ubicaciones
const locationColumns = [
    { field: 'estructura', headerName: 'Estructura', flex: 0.5, minWidth: 150 },
    { field: 'unidad', headerName: 'Unidad', flex: 0.5, minWidth: 120 },
    {
        field: 'estado',
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
];

// Función principal
export const getColumns = ({ handleDelete, selectedTab }) => {

    // Si es ubicaciones, construimos el array específico
    if (selectedTab === 2) {
        return [
            { field: 'id', headerName: 'Id', width: 50 }, // id explícito
            ...locationColumns,
            actionsColumn(handleDelete),
        ];
    }

    // Columnas base para todos los tabs (excepto ubicaciones)
    const baseColumns = [
        { field: 'id', headerName: 'Id', width: 50 },
        { field: 'codigo', headerName: 'Código', width: 100 },
        { field: 'descripcion', headerName: 'Descripción', flex: 1, minWidth: 150 },
        actionsColumn(handleDelete),
    ];

    return baseColumns;
};