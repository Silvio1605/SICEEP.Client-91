import React from 'react';
import { Box, Typography } from '@mui/material';
//
import TabDeducciones from './../components/deducciones/TabDeducciones';

export default function Deducciones() {
    return (
        <Box sx={{ width: '100%', pb: 5 }}>
            <Box sx={{ mb: 2 }}>
                <Typography variant="h5" component="h1" color="text.primary" sx={{ fontWeight: 'bold' }}>
                    Deducciones
                </Typography>
                <Typography variant="subtitle1" component="h2" color="text.secondary">
                    Controle las deducciones que reportan las instituciones externas cada mes
                </Typography>
            </Box>
            <TabDeducciones />
        </Box>
    );
}
