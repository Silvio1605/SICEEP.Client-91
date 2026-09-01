import { IconButton, Tooltip } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility'; // Icono de ojito
import { useNavigate } from 'react-router-dom';

// 1. COMPONENTE: Un solo botón directo
const BotonVerExpediente = ({ idExpediente }) => {
    const navigate = useNavigate();

    const irAlExpediente = () => {
        // Te manda directo a la vista principal del expediente
        navigate(`/index/info-personal/${idExpediente}`);
    };

    return (
        <Tooltip title="Ver Expediente">
            <IconButton onClick={irAlExpediente} color="primary" size="small">
                <VisibilityIcon />
            </IconButton>
        </Tooltip>
    );
};

// 2. COLUMNAS: Configuración de la tabla de expedientes
export const columnsExpedientes = () => {
    return [
        { field: 'id', headerName: 'No.', width: 70 },
        { field: 'ident', headerName: 'Número de Expediente', flex: 1 },
        { field: 'nombreCompleto', headerName: 'Nombre Completo', flex: 1.5 },
        { field: 'ubicacion', headerName: 'Ubicación', flex: 1 },
        {
            field: 'estado',
            headerName: 'Estado',
            width: 120,
            renderCell: (params) => (
                <span style={{ color: params.value === 'Activo' ? 'green' : 'red', fontWeight: 'bold' }}>
                    {params.value}
                </span>
            )
        },
        {
            field: 'acciones',
            headerName: 'Acciones',
            width: 100,
            sortable: false,
            renderCell: (params) => (
                <BotonVerExpediente idExpediente={params.row.id} />
            )
        },
    ];
};