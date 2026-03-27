import { Chip } from '@mui/material';
import * as React from 'react'
import MenuAcciones from '../components//Menu/MenuAccionesUsuarios'

const getEstadoColor = (estado) => {
    switch (estado) {
        case "Activo":
            return 'success';
        case "Baja":
            return 'warning';
        case 'Suspendido':
            return 'default';
        default:
            return 'default';
    }
};

export const columnsUsuarios = ({ isMobile, abrirPerfil }) => [
    {
        field: 'id', headerName: 'No.', flex: 2, minWidth: 20,
        align: 'center', headerAlign: 'center'
    },
    !isMobile && {
        field: 'carnet', headerName: 'Carnet.', flex: 2, minWidth: 40,
        align: 'center', headerAlign: 'center'
    },
    {
        field: 'estado',
        headerName: 'Estado',
        flex: 1,
        align: 'center',
        headerAlign: 'center',
        renderCell: (params) => (
            <Chip
                label={params.value}
                color={getEstadoColor(params.value)}
                size="small"
                variant="filled"
            />
        ),
    }, 
    {
        field: 'propietario', headerName: 'Nombre Completo', flex: 2, minWidth: 180,
        align: 'center', headerAlign: 'center', headerClassName: 'header-negrita',
    },
    !isMobile && {
        field: 'fechaExpiracion', headerName: 'Fecha Expiración', flex: 2, minWidth: 50,
        align: 'center', headerAlign: 'center', headerClassName: 'header-negrita',
    },
    {
        field: 'acciones', headerName: 'Acciones', flex: 1, minWidth: 40,
        sortable: false,
        filterable: false,
        align: 'center',
        headerAlign: 'center',
        renderCell: (params) => (
            <MenuAcciones row={params.row} abrirPerfil={abrirPerfil} />
        ),
    },
].filter(Boolean);
