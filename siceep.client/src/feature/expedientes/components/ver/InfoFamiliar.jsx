import React from 'react';
import { Box, Typography, Paper, Avatar, Divider, Chip } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import PersonIcon from '@mui/icons-material/Person';
import {
    nombreCompletoPersona,
    formatearFechaLegible,
} from '../../utils/expedienteMappers';

const gridStyles = {
    border: 'none',
    backgroundColor: '#ffffff',
    '& .MuiDataGrid-columnHeaders': { borderBottom: 'none', backgroundColor: '#f8f9fa' },
    '& .MuiDataGrid-cell': { borderBottom: '1px solid #f0f0f0' },
    '& .header-negrita': { fontWeight: 'bold' },
};

export default function InfoFamiliar({ data }) {
    const persona = data?.persona || {};

    const columns = [
        { field: 'id', headerName: 'NUM', width: 70 },
        { field: 'parentesco', headerName: 'PARENTESCO', flex: 1, headerClassName: 'header-negrita' },
        { field: 'identificacion', headerName: 'IDENTIFICACIÓN', flex: 1, headerClassName: 'header-negrita' },
        { field: 'nombre', headerName: 'NOMBRE', flex: 2, headerClassName: 'header-negrita' },
        { field: 'fechaNacimiento', headerName: 'FECHA NACIMIENTO', width: 150, headerClassName: 'header-negrita' },
        { field: 'tipoUnion', headerName: 'TIPO UNIÓN', flex: 1, headerClassName: 'header-negrita' },
        { field: 'observacion', headerName: 'OBSERVACIÓN', flex: 1, headerClassName: 'header-negrita' },
    ];

    // Lectura real del DTO (ExpedienteCompletoDto.familiares)
    const rows = (data?.familiares || [])
        .filter((f) => f && f.activo !== false)
        .map((f) => ({
            id: f.idRelacion,
            parentesco: f.nombreParentesco || 'FAMILIAR',
            identificacion: f.persona?.cedula || 'S/D',
            nombre: nombreCompletoPersona(f.persona),
            fechaNacimiento: formatearFechaLegible(f.persona?.fechaNacimiento) || 'S/D',
            tipoUnion: f.tipoUnion || 'S/D',
            observacion: f.observaciones || '',
        }));

    return (
        <Box sx={{ mt: 3, mb: 3 }}>
            <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56, mr: 2 }}>
                        <PersonIcon fontSize="large" />
                    </Avatar>
                    <Box>
                        <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}>
                            {nombreCompletoPersona(persona) || 'NOMBRE NO DISPONIBLE'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Ficha General del Funcionario Civil - Núcleo Familiar
                        </Typography>
                    </Box>
                </Box>
                <Divider sx={{ mb: 3 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="subtitle1" color="text.primary" sx={{ fontWeight: 'bold' }}>
                        DETALLE NÚCLEO FAMILIAR
                    </Typography>
                    <Chip label={`${rows.length} integrante(s)`} color="primary" size="small" variant="outlined" />
                </Box>
                <Box sx={{ width: '100%' }}>
                    {rows.length === 0 ? (
                        <Typography variant="body2" color="text.secondary" sx={{ py: 3, textAlign: 'center' }}>
                            No se han registrado familiares.
                        </Typography>
                    ) : (
                        <DataGrid rows={rows} columns={columns} autoHeight hideFooter disableColumnMenu disableRowSelectionOnClick sx={gridStyles} />
                    )}
                </Box>
            </Paper>
        </Box>
    );
}