import React from 'react';
import { Box, Typography, Paper, Divider, Grid } from '@mui/material';
import FaceOutlinedIcon from '@mui/icons-material/FaceOutlined';

// Componente auxiliar para que los campos se vean limpios y uniformes
const CampoInfo = ({ etiqueta, valor }) => (
    <Box sx={{
        height: '100%',
        borderRadius: 1.5,
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: '#fafafa',
        p: 1.5,
    }}>
        <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5, letterSpacing: 0.3 }}>
            {etiqueta.toUpperCase()}
        </Typography>
        <Typography variant="body1" color="text.primary" sx={{ fontWeight: 600 }}>
            {valor || 'NO DISPONIBLE'}
        </Typography>
    </Box>
);

// Subtítulo de agrupación dentro de una sección
const SubSeccion = ({ titulo, children }) => (
    <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" color="text.secondary" sx={{
            fontWeight: 600,
            textTransform: 'uppercase',
            fontSize: '0.78rem',
            letterSpacing: 0.5,
            mb: 1.5,
        }}>
            {titulo}
        </Typography>
        {children}
    </Box>
);

const Seccion = ({ titulo, icono, children }) => (
    <Box>
        <Typography variant="subtitle2" color="primary" fontWeight="bold" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            {icono}
            {titulo}
        </Typography>
        <Divider sx={{ mb: 2 }} />
        {children}
    </Box>
);

export default function InfoCaracteristicasFisicas({ data }) {
    const caracteristicas = data?.caracteristicasFisicas || {};

    return (
        <Box sx={{ mt: 3, mb: 3 }}>
            <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                <Seccion titulo="Características Físicas" icono={<FaceOutlinedIcon fontSize="small" />}>
                    {data?.caracteristicasFisicas ? (
                        <>
                            <SubSeccion titulo="Medidas y Complexión">
                                <Grid container spacing={2}>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <CampoInfo etiqueta="Estatura" valor={caracteristicas.estatura ? `${caracteristicas.estatura} m` : null} />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <CampoInfo etiqueta="Peso" valor={caracteristicas.peso ? `${caracteristicas.peso} lbs` : null} />
                                    </Grid>
                                </Grid>
                            </SubSeccion>
                            <SubSeccion titulo="Rasgos">
                                <Grid container spacing={2}>
                                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                        <CampoInfo etiqueta="Tono de Piel" valor={caracteristicas.tonoPiel} />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                        <CampoInfo etiqueta="Color de Ojos" valor={caracteristicas.colorOjos} />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                        <CampoInfo etiqueta="Color de Cabello" valor={caracteristicas.colorCabello} />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                        <CampoInfo etiqueta="Tipo de Cabello" valor={caracteristicas.tipoCabello} />
                                    </Grid>
                                </Grid>
                            </SubSeccion>
                        </>
                    ) : (
                        <Typography variant="body2" color="text.secondary">No registrado.</Typography>
                    )}
                </Seccion>
            </Paper>
        </Box>
    );
}
