import React from 'react';
import { Box, Grid, TextField, Typography, Paper, Divider, MenuItem } from '@mui/material';

export default function TabInfoAcademica() {
    return (
        <Box>
            {/* --- SECCIÓN 1: Preparación Profesional --- */}
            <Typography variant="subtitle1" color="primary" fontWeight="bold" sx={{ mb: 2 }}>
                Preparación Profesional
            </Typography>

            <Paper elevation={0} sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: 2, mb: 4 }}>
                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 3 }}>
                        <TextField select fullWidth size="small" label="Nivel Académico" defaultValue="">
                            <MenuItem value="ESTUDIANTE">Estudiante</MenuItem>
                            <MenuItem value="EGRESADO">Egresado</MenuItem>
                            <MenuItem value="LICENCIADO">Licenciado / Ingeniero</MenuItem>
                            <MenuItem value="MAESTRIA">Maestría / Postgrado</MenuItem>
                        </TextField>
                    </Grid>
                    <Grid size={{ xs: 12, md: 5 }}>
                        <TextField fullWidth size="small" label="Carrera o Profesión" placeholder="Ej: Ingeniería en Computación" />
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <TextField fullWidth size="small" label="Lugar / Universidad" placeholder="Ej: UNI-MANAGUA" />
                    </Grid>
                    <Grid size={{ xs: 12, md: 3 }}>
                        <TextField fullWidth size="small" label="Año" type="number" placeholder="Ej: 2026" />
                    </Grid>
                </Grid>
            </Paper>

            <Divider sx={{ mb: 4 }} />

            {/* --- SECCIÓN 2: Educación Básica --- */}
            <Typography variant="subtitle1" color="primary" fontWeight="bold" sx={{ mb: 2 }}>
                Educación Básica
            </Typography>

            <Paper elevation={0} sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: 2 }}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={3}>
                        <TextField select fullWidth size="small" label="Nivel" defaultValue="">
                            <MenuItem value="PRIMARIA">Primaria</MenuItem>
                            <MenuItem value="BACHILLER">Bachiller</MenuItem>
                        </TextField>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField fullWidth size="small" label="Centro de Estudio" placeholder="Ej: Inst. Nacional Rafael Angel Reyes" />
                    </Grid>
                    <Grid size={{ xs: 12, md: 3 }}>
                        <TextField fullWidth size="small" label="Año" type="number" placeholder="Ej: 2017" />
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    );
}