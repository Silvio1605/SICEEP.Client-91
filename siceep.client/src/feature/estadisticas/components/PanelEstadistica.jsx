import React from 'react';
import { Paper, Box, Typography, Divider, Stack } from '@mui/material';

const PanelEstadistica = ({ titulo, icono, accion, children, sx }) => (
    <Paper variant="outlined" sx={{ borderRadius: 3, borderColor: 'divider', height: '100%', ...sx }}>
        <Box sx={{ px: 2.5, pt: 2, display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            {icono}
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                {titulo}
            </Typography>
            {accion}
        </Box>
        <Divider sx={{ mx: 2.5, mb: 2 }} />
        <Box sx={{ px: 2.5, pb: 2.5 }}>
            <Stack spacing={2}>{children}</Stack>
        </Box>
    </Paper>
);

export default PanelEstadistica;