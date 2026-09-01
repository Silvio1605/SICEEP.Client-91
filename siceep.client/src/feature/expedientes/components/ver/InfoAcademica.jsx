import React from 'react';
import { Box, Typography, Paper, Avatar, Divider } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import PersonIcon from '@mui/icons-material/Person';

const gridStyles = {
    border: 'none',
    backgroundColor: '#ffffff',
    '& .MuiDataGrid-columnHeaders': { borderBottom: 'none', backgroundColor: '#f8f9fa' },
    '& .MuiDataGrid-cell': { borderBottom: '1px solid #f0f0f0' },
    '& .header-negrita': { fontWeight: 'bold' },
};

export default function InfoAcademica({ data, estudios }) {
    const formatearFecha = (fecha) => (fecha ? String(fecha).slice(0, 10) : '—');

    const columnsProfesional = [
        { field: 'id', headerName: 'NUM', width: 70 },
        { field: 'inicio', headerName: 'INICIO', width: 110, headerClassName: 'header-negrita' },
        { field: 'fin', headerName: 'FIN', width: 110, headerClassName: 'header-negrita' },
        { field: 'nivel', headerName: 'NIVEL', width: 170, headerClassName: 'header-negrita' },
        { field: 'carrera', headerName: 'CARRERA', flex: 1.4, headerClassName: 'header-negrita' },
        { field: 'modalidad', headerName: 'MODALIDAD', width: 130, headerClassName: 'header-negrita' },
        { field: 'lugar', headerName: 'INSTITUCIÓN', flex: 1, headerClassName: 'header-negrita' },
        {
            field: 'documento',
            headerName: 'DOCUMENTO',
            width: 110,
            headerClassName: 'header-negrita',
            renderCell: (params) =>
                params.row.documentoUrl ? (
                    <a href={params.row.documentoUrl} target="_blank" rel="noreferrer" style={{ color: '#1976d2' }}>
                        Ver
                    </a>
                ) : (
                    <span style={{ color: '#9e9e9e' }}>—</span>
                ),
        },
    ];

    const columnsBasica = [
        { field: 'id', headerName: 'NUM', width: 70 },
        { field: 'inicio', headerName: 'INICIO', width: 110, headerClassName: 'header-negrita' },
        { field: 'fin', headerName: 'FIN', width: 110, headerClassName: 'header-negrita' },
        { field: 'nivel', headerName: 'NIVEL', width: 170, headerClassName: 'header-negrita' },
        { field: 'modalidad', headerName: 'MODALIDAD', width: 130, headerClassName: 'header-negrita' },
        { field: 'centro', headerName: 'CENTRO DE ESTUDIO', flex: 1, headerClassName: 'header-negrita' },
        {
            field: 'documento',
            headerName: 'DOCUMENTO',
            width: 110,
            headerClassName: 'header-negrita',
            renderCell: (params) =>
                params.row.documentoUrl ? (
                    <a href={params.row.documentoUrl} target="_blank" rel="noreferrer" style={{ color: '#1976d2' }}>
                        Ver
                    </a>
                ) : (
                    <span style={{ color: '#9e9e9e' }}>—</span>
                ),
        },
    ];

    const columnsCursos = [
        { field: 'id', headerName: 'NUM', width: 70 },
        { field: 'anio', headerName: 'AÑO', width: 100, headerClassName: 'header-negrita' },
        { field: 'curso', headerName: 'CURSO', flex: 2, headerClassName: 'header-negrita' },
        { field: 'lugar', headerName: 'LUGAR', flex: 1, headerClassName: 'header-negrita' },
    ];

    // =================================================================
    // Los estudios se leen de la tabla Estudios (catálogos NivelesEducativos,
    // Instituciones y Modalidades) y se separan por sección: PROFESIONAL / BASICA.
    // =================================================================
    const lista = estudios || data?.estudios || [];

    const rowsProfesional = lista
        .filter((e) => e.seccion === 'PROFESIONAL')
        .map((e, index) => ({
            id: e.idEstudio ?? index + 1,
            inicio: formatearFecha(e.fechaInicio),
            fin: formatearFecha(e.fechaFin),
            nivel: e.nivelNombre || '—',
            carrera: e.tituloObtenido || '—',
            modalidad: e.modalidadNombre || '—',
            lugar: e.institucionNombre || '—',
            documentoUrl: e.documentoUrl || null,
        }));

    const rowsBasica = lista
        .filter((e) => e.seccion === 'BASICA')
        .map((e, index) => ({
            id: e.idEstudio ?? index + 1,
            inicio: formatearFecha(e.fechaInicio),
            fin: formatearFecha(e.fechaFin),
            nivel: e.nivelNombre || '—',
            modalidad: e.modalidadNombre || '—',
            centro: e.institucionNombre || '—',
            documentoUrl: e.documentoUrl || null,
        }));

    const rowsCursos = data?.cursosVarios || [];

    return (
        <Box sx={{ mt: 3, mb: 3 }}>
            <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56, mr: 2 }}>
                        <PersonIcon fontSize="large" />
                    </Avatar>
                    <Box>
                        <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}>
                            {data?.nombreCompleto || 'NOMBRE NO DISPONIBLE'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Ficha General del Funcionario Civil - Perfil Académico
                        </Typography>
                    </Box>
                </Box>
                <Divider sx={{ mb: 3 }} />

                <Typography variant="subtitle1" color="text.primary" sx={{ mb: 2, fontWeight: 'bold' }}>
                    PREPARACIÓN PROFESIONAL
                </Typography>
                <Box sx={{ width: '100%', mb: 4 }}>
                    <DataGrid rows={rowsProfesional} columns={columnsProfesional} autoHeight hideFooter disableColumnMenu disableRowSelectionOnClick sx={gridStyles} />
                </Box>

                <Typography variant="subtitle1" color="text.primary" sx={{ mb: 2, fontWeight: 'bold' }}>
                    EDUCACIÓN BÁSICA
                </Typography>
                <Box sx={{ width: '100%', mb: 4 }}>
                    <DataGrid rows={rowsBasica} columns={columnsBasica} autoHeight hideFooter disableColumnMenu disableRowSelectionOnClick sx={gridStyles} />
                </Box>

                <Typography variant="subtitle1" color="text.primary" sx={{ mb: 2, fontWeight: 'bold' }}>
                    CURSOS VARIOS
                </Typography>
                <Box sx={{ width: '100%' }}>
                    <DataGrid rows={rowsCursos} columns={columnsCursos} autoHeight hideFooter disableColumnMenu disableRowSelectionOnClick sx={gridStyles} />
                </Box>
            </Paper>
        </Box>
    );
}