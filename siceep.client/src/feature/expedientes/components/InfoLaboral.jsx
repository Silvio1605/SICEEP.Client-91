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

export default function InfoLaboral({ data }) {
    const columnsRecorrido = [
        { field: 'id', headerName: 'NUM', width: 70 },
        { field: 'periodo', headerName: 'PERIODO', width: 130, headerClassName: 'header-negrita' },
        { field: 'cargo', headerName: 'CARGO', flex: 1, headerClassName: 'header-negrita' },
        { field: 'estructura', headerName: 'ESTRUCTURA', flex: 2, headerClassName: 'header-negrita' },
    ];

    const columnsBajas = [
        { field: 'id', headerName: 'NUM', width: 70 },
        { field: 'empleado', headerName: 'EMPLEADO', width: 120, headerClassName: 'header-negrita' },
        { field: 'fecha', headerName: 'FECHA', width: 120, headerClassName: 'header-negrita' },
        { field: 'tipoBaja', headerName: 'TIPO DE BAJA', flex: 1, headerClassName: 'header-negrita' },
        { field: 'observacion', headerName: 'OBSERVACIÓN', flex: 1.5, headerClassName: 'header-negrita' },
    ];

    // =================================================================
    // INTEGRACIÓN BACKEND: Las tablas leerán los arreglos correspondientes
    // =================================================================
    const rowsRecorrido = data?.recorrido || [];
    const rowsBajas = data?.historialBajas || [];

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
                            Ficha General del Funcionario Civil - Trayectoria Laboral
                        </Typography>
                    </Box>
                </Box>
                <Divider sx={{ mb: 3 }} />

                <Typography variant="subtitle1" color="text.primary" sx={{ mb: 2, fontWeight: 'bold' }}>
                    RECORRIDO
                </Typography>
                <Box sx={{ width: '100%', mb: 4 }}>
                    <DataGrid rows={rowsRecorrido} columns={columnsRecorrido} autoHeight hideFooter disableColumnMenu disableRowSelectionOnClick sx={gridStyles} />
                </Box>

                <Typography variant="subtitle1" color="text.primary" sx={{ mb: 2, fontWeight: 'bold' }}>
                    HISTORIAL DE BAJAS
                </Typography>
                <Box sx={{ width: '100%' }}>
                    <DataGrid rows={rowsBajas} columns={columnsBajas} autoHeight hideFooter disableColumnMenu disableRowSelectionOnClick sx={gridStyles} />
                </Box>
            </Paper>
        </Box>
    );
}