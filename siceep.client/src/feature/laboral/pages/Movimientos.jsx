import React from 'react';
import { Box, Typography } from '@mui/material';
//
import TabMovimientos from './../components/TabMovimientos';

export default function Movimientos() {
    return (
        <Box sx={{ width: '100%', pb: 5 }}>
            <Box sx={{ mb: 2 }}>
                <Typography variant="h5" component="h1" color="text.primary" sx={{ fontWeight: 'bold' }}>
                    Movimientos
                </Typography>
                <Typography variant="subtitle1" component="h2" color="text.secondary">
                    Registre los traslados (movimientos) de los empleados entre sedes
                </Typography>
            </Box>
            <TabMovimientos />
        </Box>
    );
}