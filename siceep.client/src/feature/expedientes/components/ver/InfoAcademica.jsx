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

const CATEGORIAS = [
    { valor: 'BASICA', etiqueta: 'EDUCACIÓN BÁSICA', esCurso: false },
    { valor: 'MEDIA', etiqueta: 'EDUCACIÓN MEDIA', esCurso: false },
    { valor: 'TECNICA', etiqueta: 'EDUCACIÓN TÉCNICA', esCurso: false },
    { valor: 'SUPERIOR', etiqueta: 'EDUCACIÓN SUPERIOR', esCurso: false },
    { valor: 'POSGRADO', etiqueta: 'POSGRADO', esCurso: false },
    { valor: 'CURSOS', etiqueta: 'CURSOS Y CAPACITACIONES', esCurso: true },
];

const COLUMNAS_ESTUDIO = [
    { field: 'id', headerName: 'NUM', width: 70 },
    { field: 'inicio', headerName: 'INICIO', width: 110, headerClassName: 'header-negrita' },
    { field: 'fin', headerName: 'FIN', width: 110, headerClassName: 'header-negrita' },
    { field: 'nivel', headerName: 'NIVEL', width: 200, headerClassName: 'header-negrita' },
    { field: 'titulo', headerName: 'CARRERA / ESTUDIO', flex: 1.3, headerClassName: 'header-negrita' },
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

const COLUMNAS_CURSO = [
    { field: 'id', headerName: 'NUM', width: 70 },
    { field: 'inicio', headerName: 'INICIO', width: 110, headerClassName: 'header-negrita' },
    { field: 'fin', headerName: 'FIN', width: 110, headerClassName: 'header-negrita' },
    { field: 'nivel', headerName: 'TIPOLOGÍA', width: 170, headerClassName: 'header-negrita' },
    { field: 'titulo', headerName: 'CURSO', flex: 2, headerClassName: 'header-negrita' },
    { field: 'modalidad', headerName: 'MODALIDAD', width: 130, headerClassName: 'header-negrita' },
    { field: 'lugar', headerName: 'LUGAR', flex: 1, headerClassName: 'header-negrita' },
];

export default function InfoAcademica({ data, estudios }) {
    const formatearFecha = (fecha) => (fecha ? String(fecha).slice(0, 10) : '—');

    // =================================================================
    // Los estudios se leen de la tabla Estudios. La categoría la deriva el
    // backend del Subsistema del nivel (BASICA/MEDIA/TECNICA/SUPERIOR/
    // POSGRADO con documento de soporte; CURSOS sin documento).
    // =================================================================
    const lista = estudios || data?.estudios || [];

    const construirFila = (e, index) => ({
        id: e.idEstudio ?? index + 1,
        inicio: formatearFecha(e.fechaInicio),
        fin: formatearFecha(e.fechaFin),
        nivel: e.nivelNombre || '—',
        titulo: e.tituloObtenido || '—',
        modalidad: e.modalidadNombre || '—',
        lugar: e.institucionNombre || '—',
        documentoUrl: e.documentoUrl || null,
    });

    const categoriasConDatos = [...new Set(lista.map((e) => e.categoria).filter(Boolean))];

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

                {categoriasConDatos.length === 0 && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        No se han registrado estudios académicos.
                    </Typography>
                )}

                {CATEGORIAS.map((c) => {
                    if (!categoriasConDatos.includes(c.valor)) return null;

                    const filas = lista
                        .filter((e) => e.categoria === c.valor)
                        .map(construirFila);

                    return (
                        <Box key={c.valor} sx={{ mb: 4 }}>
                            <Typography variant="subtitle1" color="text.primary" sx={{ mb: 2, fontWeight: 'bold' }}>
                                {c.etiqueta}
                            </Typography>
                            <Box sx={{ width: '100%' }}>
                                <DataGrid
                                    rows={filas}
                                    columns={c.esCurso ? COLUMNAS_CURSO : COLUMNAS_ESTUDIO}
                                    autoHeight
                                    hideFooter
                                    disableColumnMenu
                                    disableRowSelectionOnClick
                                    sx={gridStyles}
                                />
                            </Box>
                        </Box>
                    );
                })}
            </Paper>
        </Box>
    );
}