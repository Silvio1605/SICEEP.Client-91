import React from 'react';
import { Box, Paper, Avatar, Typography, Stack, Button } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import ClearIcon from '@mui/icons-material/Clear';
//
import { getIniciales } from './../../utils/deduccionUtils';

export default function EncabezadoEmpleado({ empleado, onCambiar, onQuitar }) {
    return (
        <Paper
            variant="outlined"
            sx={{ p: 2, mb: 2, borderRadius: 3, borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}
        >
            <Avatar sx={{ width: 48, height: 48, bgcolor: '#1565C0', fontWeight: 700 }}>
                {getIniciales(empleado.nombreCompleto)}
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 200 }}>
                <Typography variant="caption" color="text.secondary">Empleado seleccionado</Typography>
                <Typography variant="body1" fontWeight={700}>{empleado.nombreCompleto}</Typography>
                <Typography variant="caption" color="text.secondary">
                    Deducciones reportadas por instituciones externas
                </Typography>
            </Box>
            <Stack direction="row" spacing={1}>
                <Button size="small" startIcon={<RefreshIcon />} onClick={onCambiar}>Cambiar</Button>
                <Button size="small" color="error" startIcon={<ClearIcon />} onClick={onQuitar}>Quitar</Button>
            </Stack>
        </Paper>
    );
}