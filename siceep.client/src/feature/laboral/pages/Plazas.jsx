import React from 'react';
import { Box, Typography } from '@mui/material';
//
import TabPlazas from './../components/TabPlazas';

export default function Plazas() {
    return (
        <Box sx={{ width: '100%', pb: 5 }}>
            <Box sx={{ mb: 2 }}>
                <Typography variant="h5" component="h1" color="text.primary" sx={{ fontWeight: 'bold' }}>
                    Plazas
                </Typography>
                <Typography variant="subtitle1" component="h2" color="text.secondary">
                    Cree plazas y consulte las vacantes de la institución
                </Typography>
            </Box>
            <TabPlazas />
        </Box>
    );
}