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

export default function InfoFamiliar({ data }) {
    const columns = [
        { field: 'id', headerName: 'NUM', width: 70 },
        { field: 'parentesco', headerName: 'PARENTESCO', flex: 1, headerClassName: 'header-negrita' },
        { field: 'identificacion', headerName: 'IDENTIFICACIÓN', flex: 1, headerClassName: 'header-negrita' },
        { field: 'nombre', headerName: 'NOMBRE', flex: 2, headerClassName: 'header-negrita' },
        { field: 'observacion', headerName: 'OBSERVACIÓN', flex: 1, headerClassName: 'header-negrita' },
    ];

    // =================================================================
    // INTEGRACIÓN BACKEND: La tabla leerá el arreglo 'familiares' del JSON
    // =================================================================
    const rows = data?.familiares || [];

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
                            Ficha General del Funcionario Civil - Núcleo Familiar
                        </Typography>
                    </Box>
                </Box>
                <Divider sx={{ mb: 3 }} />

                <Typography variant="subtitle1" color="text.primary" sx={{ mb: 2, fontWeight: 'bold' }}>
                    DETALLE NÚCLEO FAMILIAR
                </Typography>
                <Box sx={{ width: '100%' }}>
                    <DataGrid rows={rows} columns={columns} autoHeight hideFooter disableColumnMenu disableRowSelectionOnClick sx={gridStyles} />
                </Box>
            </Paper>
        </Box>
    );
}