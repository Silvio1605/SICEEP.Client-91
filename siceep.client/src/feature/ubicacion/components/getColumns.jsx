import {
    Box,
    IconButton,
    Chip,
} from '@mui/material';
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
} from '@mui/icons-material';
//import ContentCopyIcon from '@mui/icons-material/ContentCopy';

// --- Columnas de la tabla según la entidad ---
export const getColumns = ({ handleDelete, selectedTab }) => {
    const baseColumns = [
        { field: 'id', headerName: 'Id', width: 50 },
        { field: 'codigo', headerName: 'Código', width: 80 },
        { field: 'descripcion', headerName: 'Descripción', flex: 1, minWidth: 150 },
        {
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
        },
    ];

    // Para Ubicaciones, intercalamos columnas de dirección
    if (selectedTab === 2) {
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

        // Insertamos después de 'id'
        return [
            baseColumns[0], // id
            ...locationColumns,
            baseColumns[3], // actions
        ];
    }
    return baseColumns;
};
