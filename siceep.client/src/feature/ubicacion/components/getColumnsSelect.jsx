import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import CheckIcon from '@mui/icons-material/Check';

// Función principal
export const getColumnsSelect = () => {

    // Columnas base para todos los tabs (excepto ubicaciones)
    const baseColumns = [
        { field: 'id', headerName: 'Id', width: 50 },
        { field: 'codigo', headerName: 'Código', width: 100 },
        { field: 'descripcion', headerName: 'Descripción', flex: 1, minWidth: 150 },
        {
            field: 'acciones', headerName: 'Seleccionar', width: 100, sortable: false, renderCell: (params) => (
                <Box>
                    <IconButton
                        color="primary"
                        size="small"
                        onClick={() => console.log('copiar')}
                        aria-label="copiar"
                    >
                        <CheckIcon fontSize="small" />
                    </IconButton>
                </Box>
            ),
        }
    ];

    return baseColumns;
};