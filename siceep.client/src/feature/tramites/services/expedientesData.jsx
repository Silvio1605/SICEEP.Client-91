import { Chip } from '@mui/material';
import MenuAcciones from '../components/MenuAcciones';

// 1 = Baja, 2 = Activo, 3 = Com/Servicio
const getEstadoColor = (estado) => {
    switch (estado) {
        case 1:
            return 'error';
        case 2:
            return 'success';
        case 3:
            return 'warning';
        default:
            return 'default';
    }
};

const getEstadoLabel = (estado) => {
    switch (estado) {
        case 1:
            return 'Baja';
        case 2:
            return 'Activo';
        case 3:
            return 'Com/Servicio';
        default:
            return 'Desconocido';
    }
};

export const columnsBusquedaRapida = ({ isMobile, onFicha, onConstancia, onDocumentos }) => [
    {
        field: 'index', headerName: 'No.', width: 70,
        align: 'center', headerAlign: 'center', sortable: false, filterable: false,
    },
    {
        field: 'codigo', headerName: 'Número de Expediente', flex: 1, minWidth: 160,
        align: 'left', headerAlign: 'left', headerClassName: 'header-negrita',
        sortable: false, filterable: false,
        renderCell: (params) => <span>{params?.row?.codigo || params?.row?.noExp || 'S/D'}</span>,
    },
    {
        field: 'nombreCompleto', headerName: 'Nombre Completo', flex: 1.3, minWidth: 200,
        align: 'left', headerAlign: 'left', headerClassName: 'header-negrita',
        sortable: false, filterable: false,
        renderCell: (params) => (
            <span style={{ whiteSpace: 'normal', lineHeight: 1.4 }}>{params?.row?.nombreCompleto || params?.row?.nombre || 'S/D'}</span>
        ),
    },
    !isMobile && {
        field: 'estructura', headerName: 'Estructura', flex: 1, minWidth: 160,
        align: 'left', headerAlign: 'left', headerClassName: 'header-negrita',
        sortable: false, filterable: false,
        renderCell: (params) => <span>{params?.row?.estructura || params?.row?.ubicacion || 'S/D'}</span>,
    },
    {
        field: 'estado',
        headerName: 'Estado',
        width: 120,
        align: 'center',
        headerAlign: 'center',
        sortable: false,
        filterable: false,
        renderCell: (params) => (
            <Chip
                label={getEstadoLabel(params?.row?.estado)}
                color={getEstadoColor(params?.row?.estado)}
                size="small"
                variant="filled"
            />
        ),
    },
    {
        field: 'acciones', headerName: 'Acciones', width: 90,
        sortable: false, filterable: false, align: 'center', headerAlign: 'center',
        renderCell: (params) => (
            <MenuAcciones
                row={params.row}
                onFicha={onFicha}
                onConstancia={onConstancia}
                onDocumentos={onDocumentos}
            />
        ),
    },
].filter(Boolean);
