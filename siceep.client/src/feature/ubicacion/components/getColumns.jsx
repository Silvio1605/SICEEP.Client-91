import { Box, IconButton, Chip } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import DomainAddIcon from '@mui/icons-material/DomainAdd';
import DomainDisabledIcon from '@mui/icons-material/DomainDisabled';

// Columna de acciones (reutilizable)
const actionsColumn = (handleDelete) => ({
    field: 'acciones',
    headerName: 'Acciones',
    width: 100,
    sortable: false,
    renderCell: (params) => (
        <Box>
            <IconButton
                color={params.row.estado === 'Inactivo' ? "primary" : "error" }
                size="small"
                onClick={() => handleDelete(params.row.id, params.row.estado)}
                aria-label="eliminar"
            >
                {params.row.estado === 'Inactivo' ? <DomainAddIcon /> : <DomainDisabledIcon/> }
            </IconButton>
        </Box>
    ),
});

const editColumn = (handleEdit) => ({
    field: 'editar', headerName: 'Editar', width: 100, sortable: false,
    renderCell: (params) => (
        <Box>
            <IconButton
                color="primary"
                size="small"
                onClick={() => handleEdit(params.row)}
                aria-label="editar"
            >
                <EditIcon fontSize="small" />
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
export const getColumns = ({ handleDelete, handleEdit, selectedTab }) => {

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
        { field: 'id', headerName: 'Id', width: 60 },
        { field: 'codigo', headerName: 'Código', width: 100 },
        ...(selectedTab === 1
            ? [{ field: 'orden', headerName: 'Orden', flex: 1, minWidth: 60 }]
            : []),
        { field: 'descripcion', headerName: 'Descripción', flex: 1, minWidth: 150 },
        editColumn(handleEdit)
    ];

    return baseColumns;
};