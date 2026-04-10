import { Chip } from '@mui/material';
import * as React from 'react'
import MenuAcciones from './../components/MenuAccionesUsuarios'

const getEstadoColor = (estado) => {
    switch (estado) {
        case "Activo":
            return 'success';
        case "Inactivo":
            return 'warning';
        case 'Expirado':
            return 'default';
        default:
            return 'default';
    }
};

export const columnsUsuarios = ({ isMobile, abrirPerfil }) => [
    {
        field: 'index', headerName: 'No.', flex: 2, minWidth: 20, maxWidth: 80,
        align: 'center', headerAlign: 'center'
    },
    !isMobile && {
        field: 'id', headerName: 'Ident.', flex: 2, minWidth: 20,
        align: 'center', headerAlign: 'center'
    },
    !isMobile && {
        field: 'propietario', headerName: 'Nombre Completo', flex: 2, minWidth: 150,
        align: 'center', headerAlign: 'center', headerClassName: 'header-negrita',
    },
    {
        field: 'usuario', headerName: 'Usuario', flex: 2, minWidth: 40,
        align: 'center', headerAlign: 'center', headerClassName: 'header-negrita',
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
    !isMobile && {
        field: 'fechaExpiracion', headerName: 'Fecha Expiración', flex: 2, minWidth: 30,
        align: 'center', headerAlign: 'center', headerClassName: 'header-negrita',
    },
    {
        field: 'acciones', headerName: 'Acciones', flex: 1, minWidth: 30,
        sortable: false,
        filterable: false,
        align: 'center',
        headerAlign: 'center',
        renderCell: (params) => (
            <MenuAcciones row={params.row} abrirPerfil={abrirPerfil} />
        ),
    },

].filter(Boolean);
