import { Box, IconButton, Tooltip, Typography } from '@mui/material';
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

// Celda combinada: etiqueta pequeña en gris + valor en la línea siguiente
// eslint-disable-next-line react-refresh/only-export-components
const CeldaDoble = ({ etiqueta, valor, valorColor }) => (
    <Box sx={{ display: 'flex', flexDirection: 'column', py: 0.5, minWidth: 0 }}>
        <Typography variant="caption" sx={{ color: 'text.secondary', lineHeight: 1.2 }}>
            {etiqueta}
        </Typography>
        <Typography
            variant="body2"
            sx={{ color: valorColor || 'text.primary', fontWeight: valorColor ? 'bold' : 'normal', lineHeight: 1.3 }}
            noWrap
        >
            {valor || 'S/D'}
        </Typography>
    </Box>
);

// columnas de expediente
export const columnsExpedientes = (isMobile = false) => {
    const estadoMap = {
        1: { label: 'Baja', color: 'error.main' },
        2: { label: 'Activo', color: 'success.main' },
        3: { label: 'Com/Servicio', color: 'warning.main' },
    };

    // En móvil se prioriza la información esencial; el resto queda oculto
    // para que la tabla no se rompa en pantallas pequeñas.
    const columnasEscritorio = [
        { field: 'index', headerName: 'No.', width: 70, sortable: false, filterable: false },
        ...(isMobile ? [] : [{ field: 'codigo', headerName: 'No. de Expediente', flex: 0.9, sortable: false, filterable: false }]),
        { field: 'nombreCompleto', headerName: 'Nombre Completo', flex: 1.2, sortable: false, filterable: false },
        ...(isMobile ? [] : [
            {
                field: 'identificacion',
                headerName: 'Identificación',
                flex: 1,
                sortable: false,
                filterable: false,
                renderCell: (params) => (
                    <CeldaDoble etiqueta={`Cédula: ${params.row.cedula || 'S/D'}`} valor={`INSS: ${params.row.numInss || 'S/D'}`} />
                ),
            },
            {
                field: 'laboral',
                headerName: 'Cargo / Estructura',
                flex: 1.2,
                sortable: false,
                filterable: false,
                renderCell: (params) => (
                    <CeldaDoble etiqueta={params.row.cargo || 'S/D'} valor={params.row.estructura || 'S/D'} />
                ),
            },
        ]),
        {
            field: 'ingreso',
            headerName: isMobile ? 'Estado' : 'Ingreso / Estado',
            flex: isMobile ? 0.8 : 1,
            sortable: false,
            filterable: false,
            renderCell: (params) => {
                const est = estadoMap[params.row.estado] || { label: 'Desconocido', color: 'text.secondary' };
                if (isMobile) {
                    return <Typography variant="body2" sx={{ color: est.color, fontWeight: 'bold' }}>{est.label}</Typography>;
                }
                const fecha = params.row.fecha ? String(params.row.fecha).slice(0, 10) : 'S/D';
                return <CeldaDoble etiqueta={`Ingreso: ${fecha}`} valor={est.label} valorColor={est.color} />;
            },
        },
    ];

    return [
        ...columnasEscritorio,
        {
            field: 'acciones',
            headerName: '',
            width: 70,
            sortable: false,
            filterable: false,
            renderCell: (params) => (
                <BotonVerExpediente idExpediente={params.row.id} />
            ),
        },
    ].filter(Boolean);
};