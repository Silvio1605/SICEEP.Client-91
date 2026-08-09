import React from 'react';
import { Box, Grid, TextField, Typography, Paper, Button, Divider } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

export default function TabNucleofamiliar() {
    return (
        <Box>
            {/* Datos de los Padres */}
            <Typography variant="subtitle2" color="primary" fontWeight="bold" sx={{ mb: 2 }}>
                Datos de los Padres
            </Typography>
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Paper elevation={0} sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: 2, height: '100%' }}>
                        <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 2 }}>Madre</Typography>
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12 }}>
                                <TextField fullWidth size="small" label="Nombre Completo de la Madre" />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <TextField fullWidth size="small" label="N° Cédula (Opcional)" />
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Paper elevation={0} sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: 2, height: '100%' }}>
                        <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 2 }}>Padre</Typography>
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12 }}>
                                <TextField fullWidth size="small" label="Nombre Completo del Padre" />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <TextField fullWidth size="small" label="N° Cédula (Opcional)" />
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>

            {/* SECCIÓN NUEVA: Datos del Cónyuge */}
            <Typography variant="subtitle2" color="primary" fontWeight="bold" sx={{ mb: 2 }}>
                Datos del Cónyuge
            </Typography>
            <Paper elevation={0} sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: 2, mb: 4 }}>
                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField fullWidth size="small" label="Nombre Completo del Cónyuge" />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField fullWidth size="small" label="N° Cédula (Opcional)" />
                    </Grid>
                </Grid>
            </Paper>

            <Divider sx={{ mb: 3 }} />

            {/* Registro de Hijos */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box>
                    <Typography variant="subtitle2" color="primary" fontWeight="bold">
                        Registro de Hijos / Dependientes
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Agregue los nombres y fechas de nacimiento de los hijos del funcionario.
                    </Typography>
                </Box>
                <Button variant="outlined" startIcon={<AddIcon />}>
                    AGREGAR HIJO
                </Button>
            </Box>

            <Paper elevation={0} sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: 2 }}>
                <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 2 }}>Hijo #1</Typography>
                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 8 }}>
                        <TextField fullWidth size="small" label="Nombre Completo" />
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <TextField fullWidth size="small" type="date" label="Fecha de Nacimiento" InputLabelProps={{ shrink: true }} />
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    );
}