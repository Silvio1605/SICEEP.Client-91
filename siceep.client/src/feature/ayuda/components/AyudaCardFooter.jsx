import React from 'react';
import { Paper, Typography } from '@mui/material';
import HelpCenterIcon from '@mui/icons-material/HelpCenter';

export default function AyudaCardFooter() {
    return (
        <Paper variant="outlined" sx={{ borderRadius: 3, borderColor: 'divider', mt: 3, p: 2.5, textAlign: 'center' }}>
            <HelpCenterIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="body1" sx={{ fontWeight: 700 }}>
                ¿Encontraste lo que buscabas?
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                Esta sección se irá actualizando con nuevas guías según el uso del sistema.
            </Typography>
        </Paper>
    );
}