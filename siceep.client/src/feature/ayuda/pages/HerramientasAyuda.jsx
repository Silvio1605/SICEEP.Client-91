import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import AccesosDirectos from '../components/AccesosDirectos';
import Soporte from '../components/Soporte';
import GuiasRapidas from '../components/GuiasRapidas';
import FichaPdf from '../components/FichaPdf';
import Consejos from '../components/Consejos';
import AyudaCardFooter from '../components/AyudaCardFooter';

export default function HerramientasAyuda() {
    return (
        <Box sx={{ width: '100%', pb: 5 }}>
            <Box sx={{ mb: 2.5 }}>
                <Typography variant="h5" component="h1" color="text.primary" sx={{ fontWeight: 'bold' }}>
                    Herramientas de Ayuda
                </Typography>
                <Typography variant="subtitle1" component="h2" color="text.secondary">
                    Guías rápidas y accesos directos para aprovechar el sistema
                </Typography>
            </Box>

            <AccesosDirectos />
            <Soporte />

            <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 8 }}>
                    <GuiasRapidas />
                    <FichaPdf />
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                    <Consejos />
                    <AyudaCardFooter />
                </Grid>
            </Grid>
        </Box>
    );
}