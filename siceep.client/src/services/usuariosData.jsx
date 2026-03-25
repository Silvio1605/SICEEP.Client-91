import { Chip } from '@mui/material';
import * as React from 'react'
import MenuAcciones from '../components//Menu/MenuAccionesUsuarios'

const getEstadoColor = (estado) => {
    switch (estado) {
        case 'Activo':
            return 'success';
        case 'Inactivo':
            return 'warning';
        case 'Suspendido':
            return 'default';
        default:
            return 'default';
    }
};

export const columnsUsuarios = ({isMobile, abrirPerfil}) => [
    {
        field: 'id', headerName: 'No.', flex: 1, minWidth: 50,
        align: 'center', headerAlign: 'center', headerClassName: 'header-negrita'

    },
    {
        field: 'carnet', headerName: 'Carnet.', flex: 2, minWidth: 50,
        align: 'center', headerAlign: 'center'
    },
    !isMobile && {
        field: 'propietario', headerName: 'Nombre Completo', flex: 2, minWidth: 200,
        align: 'center', headerAlign: 'center', headerClassName: 'header-negrita',
    },
    {
        field: 'usuario', headerName: 'Usuario', flex: 2, minWidth: 100, 
        align: 'center', headerAlign: 'center', headerClassName: 'header-negrita',
    },
    !isMobile && {
        field: 'estructura', headerName: 'Estructura', flex: 2, minWidth: 50,
        align: 'center', headerAlign: 'center', headerClassName: 'header-negrita',
    },
    !isMobile && {
        field: 'fecha_expiracion', headerName: 'Fecha Expiración', flex: 2, minWidth: 50,
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
    {
        field: 'acciones', headerName: 'Acciones', flex: 1, minWidth: 50,
        sortable: false,
        filterable: false,
        align: 'center',
        headerAlign: 'center',
        renderCell: (params) => (
            <MenuAcciones row={params.row} abrirPerfil={abrirPerfil} />
        ),
    },
].filter(Boolean);

export const rowsUsuarios = [
    {
        id: 1,
        carnet: 2487568,
        propietario: 'Juan Carlos Pérez López',
        usuario: 'jperez',
        estructura: 'Administración Central',
        estado: 'Activo',
        fecha_expiracion: '27/01/2027'
    },
    {
        id: 2,
        carnet: 11574765,
        propietario: 'María Fernanda Gómez Ruiz',
        usuario: 'mgomez',
        estructura: 'Recursos Humanos',
        estado: 'Activo',
        fecha_expiracion: '27/01/2027'
    },
    {
        id: 3,
        carnet: 5687895,
        propietario: 'Luis Alberto Martínez',
        usuario: 'lmartinez',
        estructura: 'Finanzas',
        estado: 'Activo',
        fecha_expiracion: '27/01/2027'
    },
    {
        id: 4,
        carnet: 27485965,
        propietario: 'Ana Sofía Hernández',
        usuario: 'ahernandez',
        estructura: 'Tecnología de la Información',
        estado: 'Inactivo',
        fecha_expiracion: '01/01/2026'
    },
    {
        id: 5,
        carnet: 2251585,
        propietario: 'Carlos Enrique López',
        usuario: 'clopez',
        estructura: 'Operaciones',
        estado: 'Suspendido',
        fecha_expiracion: '15/01/2026'
    },
    {
        id: 6,
        carnet: 5149548,
        propietario: 'Silvio Morales Dominguez',
        usuario: 'clopez',
        estructura: 'Operaciones',
        estado: 'Suspendido',
        fecha_expiracion: '15/01/2026'
    },
    {
        id: 7,
        carnet: 5149548,
        propietario: 'Silvio Morales Dominguez',
        usuario: 'clopez',
        estructura: 'Operaciones',
        estado: 'Suspendido',
        fecha_expiracion: '15/01/2026'
    },
    {
        id: 8,
        carnet: 5149548,
        propietario: 'Silvio Morales Dominguez',
        usuario: 'clopez',
        estructura: 'Operaciones',
        estado: 'Suspendido',
        fecha_expiracion: '15/01/2026'
    },
    {
        id: 9,
        carnet: 5149548,
        propietario: 'Silvio Morales Dominguez',
        usuario: 'clopez',
        estructura: 'Operaciones',
        estado: 'Suspendido',
        fecha_expiracion: '15/01/2026'
    },
    {
        id: 10,
        carnet: 5149548,
        propietario: 'Silvio Morales Dominguez',
        usuario: 'clopez',
        estructura: 'Operaciones',
        estado: 'Suspendido',
        fecha_expiracion: '15/01/2026'
    },
];