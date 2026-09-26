import React, { useState } from 'react';
import { Box, TextField, Typography, Paper, Alert, InputAdornment, IconButton, Tooltip, CircularProgress } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import SearchIcon from '@mui/icons-material/Search';
import SchoolIcon from '@mui/icons-material/School';
import useExpedientes from '../../tramites/hooks/useExpedientes';
import { getExpedienteCompleto, getEstudios } from '../../expedientes/services/expedienteService';
import InfoAcademica from '../../expedientes/components/ver/InfoAcademica';

const estadoMap = {
    1: { label: 'Baja', color: 'error.main' },
    2: { label: 'Activo', color: 'success.main' },
    3: { label: 'Com/Servicio', color: 'warning.main' },
};

const AccionVerFormacion = ({ empleado, onVer }) => (
    <Tooltip title="Ver formación académica">
        <IconButton color="primary" size="small" onClick={() => onVer(empleado)}>
            <SchoolIcon />
        </IconButton>
    </Tooltip>
);

const gridStyles = {
    border: 'none',
    backgroundColor: '#ffffff',
    '& .MuiDataGrid-columnHeaders': { borderBottom: 'none', backgroundColor: '#f8f9fa' },
    '& .MuiDataGrid-cell': { borderBottom: '1px solid #f0f0f0' },
    '& .header-negrita': { fontWeight: 'bold' },
};

const construirColumnas = (onVer) => [
    { field: 'codigo', headerName: 'No. de Expediente', width: 160, headerClassName: 'header-negrita' },
    { field: 'nombreCompleto', headerName: 'Nombre Completo', flex: 1.2, headerClassName: 'header-negrita' },
    { field: 'cedula', headerName: 'Identificación', width: 140, headerClassName: 'header-negrita' },
    {
        field: 'estado',
        headerName: 'Estado',
        width: 130,
        headerClassName: 'header-negrita',
        renderCell: (params) => {
            const est = estadoMap[params.row.estado] || { label: 'Desconocido', color: 'text.secondary' };
            return <Typography variant="body2" sx={{ color: est.color, fontWeight: 'bold' }}>{est.label}</Typography>;
        },
    },
    {
        field: 'acciones',
        headerName: '',
        width: 70,
        sortable: false,
        filterable: false,
        renderCell: (params) => <AccionVerFormacion empleado={params.row} onVer={onVer} />,
    },
];

export default function ConsultaAcademica() {
    const { expedientes, total, cargando, error, busqueda, page, manejarBusqueda, cambiarPagina } = useExpedientes();
    const [cargandoPerfil, setCargandoPerfil] = useState(false);
    const [perfil, setPerfil] = useState(null);
    const [errorPerfil, setErrorPerfil] = useState(null);

    const verFormacion = async (empleado) => {
        setCargandoPerfil(true);
        setErrorPerfil(null);
        setPerfil(null);
        try {
            const exp = await getExpedienteCompleto(empleado.id);
            const idPersona = exp?.data?.persona?.idPersona;
            if (!idPersona) throw new Error('No se pudo determinar la persona del expediente.');
            const estudiosRes = await getEstudios(idPersona);
            setPerfil({ nombreCompleto: empleado.nombreCompleto, estudios: estudiosRes?.data || [] });
        } catch (err) {
            setErrorPerfil(err?.response?.data?.message || err?.message || 'No se pudo cargar la formación académica.');
        } finally {
            setCargandoPerfil(false);
        }
    };

    return (
        <Box sx={{ width: '100%', pb: 5 }}>
            <Box sx={{ mb: 3 }}>
                <Typography variant="h5" component="h1" color="text.primary">
                    Consulta de Formación Académica
                </Typography>
                <Typography variant="subtitle1" component="h1" color="text.secondary">
                    Búsqueda de funcionarios y consulta de su perfil académico
                </Typography>
            </Box>

            <Paper variant="outlined" sx={{ p: 2, mb: 2, borderRadius: 2 }}>
                <TextField
                    fullWidth
                    value={busqueda}
                    onChange={manejarBusqueda}
                    placeholder="Buscar por nombre o número de cédula del funcionario"
                    size="small"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon color="action" />
                            </InputAdornment>
                        ),
                    }}
                />
            </Paper>

            {error && (
                <Alert severity="error" variant="filled" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
                <DataGrid
                    rows={expedientes}
                    columns={construirColumnas(verFormacion)}
                    autoHeight
                    loading={cargando}
                    disableColumnMenu
                    disableRowSelectionOnClick
                    hideFooterSelectedRowCount
                    disableColumnFilter
                    disableColumnSelector
                    disableDensitySelector
                    pagination
                    paginationMode="server"
                    rowCount={total ?? 0}
                    paginationModel={{
                        page: page,
                        pageSize: 10,
                    }}
                    onPaginationModelChange={(model) => cambiarPagina(null, model.page)}
                    pageSizeOptions={[10]}
                    initialState={{
                        pagination: { paginationModel: { pageSize: 10 } },
                    }}
                    localeText={{
                        noRowsLabel: "No hay funcionarios",
                        noResultsOverlayLabel: "No se encontraron resultados",
                        MuiTablePagination: { labelRowsPerPage: "Filas:" }
                    }}
                    sx={gridStyles}
                />
            </Paper>

            <Box sx={{ mt: 3 }}>
                {cargandoPerfil && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                        <CircularProgress />
                    </Box>
                )}
                {!cargandoPerfil && errorPerfil && (
                    <Alert severity="error" variant="filled">
                        {errorPerfil}
                    </Alert>
                )}
                {!cargandoPerfil && perfil && (
                    <InfoAcademica data={{ nombreCompleto: perfil.nombreCompleto }} estudios={perfil.estudios} />
                )}
            </Box>
        </Box>
    );
}