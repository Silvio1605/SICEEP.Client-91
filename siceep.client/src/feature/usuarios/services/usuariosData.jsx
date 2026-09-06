import { Chip } from '@mui/material';
import * as React from 'react'
import MenuAcciones from '../components/MenuAcciones'

const getEstadoColor = (estado) => {
    switch (estado) {
        case 1:
            return 'success';
        case 2:
            return 'error';
        case 3:
            return 'warning';
        default:
            return 'default';
    }
};

// Los nombres completos se devuelven separados por espacios; algunos pueden traer
// espacios múltiples o nulos entremedio. Lo normalizamos para una visualización limpia.
const formatearNombre = (nombre) => (nombre || '').replace(/\s+/g, ' ').trim();

export const columnsUsuarios = ({ isMobile, abrirPerfil, abrirCambioContra }) => [
    {
        field: 'index', headerName: 'No.', width: 70,
        align: 'center', headerAlign: 'center',
    },
    !isMobile && {
        field: 'id', headerName: 'Ident.', width: 80,
        align: 'center', headerAlign: 'center',
    },
    !isMobile && {
        field: 'propietario', headerName: 'Nombre Completo', flex: 1, minWidth: 220,
        align: 'left', headerAlign: 'left', headerClassName: 'header-negrita',
        valueGetter: (params) => formatearNombre(params?.row?.propietario),
        renderCell: (params) => (
            <span style={{ whiteSpace: 'normal', lineHeight: 1.4 }}>{formatearNombre(params?.row?.propietario) || 'S/D'}</span>
        ),
    },
    {
        field: 'usuario', headerName: 'Usuario', flex: 1, minWidth: 120,
        align: 'left', headerAlign: 'left', headerClassName: 'header-negrita',
        renderCell: (params) => <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{params?.row?.usuario || 'S/D'}</span>,
    },
    {
        field: 'estado',
        headerName: 'Estado',
        width: 110,
        align: 'center',
        headerAlign: 'center',
        renderCell: (params) => (
            <Chip
                label={params.value === 1 ? "Activo" : params.value === 3 ? "Expirado" : "Inactivo" }
                color={getEstadoColor(params.value)}
                size="small"
                variant="filled"
            />
        ),
    },
    !isMobile && {
        field: 'fechaExpiracion', headerName: 'Fecha Expiración', width: 150,
        align: 'left', headerAlign: 'left', headerClassName: 'header-negrita',
        renderCell: (params) => <span style={{ whiteSpace: 'nowrap' }}>{params?.row?.fechaExpiracion || 'S/D'}</span>,
    },
    {
        field: 'acciones', headerName: 'Acciones', width: 90,
        sortable: false,
        filterable: false,
        align: 'center',
        headerAlign: 'center',
        renderCell: (params) => (
            <MenuAcciones row={params.row} abrirPerfil={abrirPerfil}  abrirCambioContra={abrirCambioContra} />
        ),
    },

].filter(Boolean);
