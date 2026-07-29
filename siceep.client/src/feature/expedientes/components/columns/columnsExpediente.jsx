import { IconButton, Tooltip } from '@mui/material';
import FolderSharedIcon from '@mui/icons-material/FolderShared';
import { useNavigate } from 'react-router-dom';

// eslint-disable-next-line react-refresh/only-export-components
const BotonVerExpediente = ({ idExpediente }) => {
    const navigate = useNavigate();

    const irAlExpediente = () => {
        // Te manda directo a la vista principal del expediente
        navigate(`/index/info-personal/${idExpediente}`);
    };

    return (
        <Tooltip title="Ver Expediente">
            <IconButton onClick={irAlExpediente} color="primary" size="small">
                <FolderSharedIcon />
            </IconButton>
        </Tooltip>
    );
};

// columnas de expediente
export const columnsExpedientes = () => {

    return [
        { field: 'id', headerName: 'No.', width: 70 },
        { field: 'codigo', headerName: 'No. de Expediente', flex: 1 },
        { field: 'nombreCompleto', headerName: 'Nombre Completo', flex: 1.5 },
        { field: 'estructura', headerName: 'Estuctura', flex: 1 },
        {
            field: 'estado',
            headerName: 'Estado',
            width: 120,
            renderCell: (params) => (
                <span style={{ color: params.value === 1 ? 'green' : 'red', fontWeight: 'bold' }}>
                    {params.value === 1 ? 'Activo' : 'Baja'}
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