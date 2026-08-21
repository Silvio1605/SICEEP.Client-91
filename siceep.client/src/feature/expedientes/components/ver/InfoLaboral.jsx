import React from 'react';
import { Box, Grid, TextField, Typography, Paper, MenuItem } from '@mui/material';

export default function TabInfoLaboral() {
    return (
        <Box>
            <Typography variant="subtitle2" color="primary" fontWeight="bold" sx={{ mb: 2 }}>
                Información del Contrato
            </Typography>
            <Paper elevation={0} sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: 2, mb: 4 }}>
                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 4 }}> 
                        <TextField select fullWidth size="small" label="Tipo de Contrato" defaultValue="">
                            <MenuItem value="INDETERMINADO">Indeterminado</MenuItem>
                            <MenuItem value="DETERMINADO">Determinado</MenuItem>
                        </TextField>
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <TextField fullWidth size="small" type="date" label="Fecha de Inicio" InputLabelProps={{ shrink: true }} />
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <TextField fullWidth size="small" type="date" label="Fecha de Cese" InputLabelProps={{ shrink: true }} />
                    </Grid>
                </Grid>
            </Paper>

            <Typography variant="subtitle2" color="primary" fontWeight="bold" sx={{ mb: 2 }}>
                Información de la Plaza
            </Typography>
            <Paper elevation={0} sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: 2, mb: 4 }}>
                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField fullWidth size="small" label="Código de Plaza (Número)" />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField select fullWidth size="small" label="Estado de la Plaza" defaultValue="">
                            <MenuItem value="ACTIVA">Activa</MenuItem>
                            <MenuItem value="INACTIVA">Inactiva</MenuItem>
                        </TextField>
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <TextField fullWidth size="small" label="Orden" />
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <TextField fullWidth size="small" label="Estructura" />
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <TextField fullWidth size="small" label="Unidad Administrativa" />
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <TextField fullWidth size="small" label="Cargo Asignado" />
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <TextField fullWidth size="small" label="Nivel / Categoría" />
                    </Grid>
                </Grid>
            </Paper>

            <Typography variant="subtitle2" color="primary" fontWeight="bold" sx={{ mb: 2 }}>
                Desglose Salarial
            </Typography>
            <Paper elevation={0} sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: 2 }}>
                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <TextField fullWidth size="small" label="Devengado" type="number" />
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <TextField fullWidth size="small" label="Deducciones" type="number" />
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <TextField fullWidth size="small" label="Salario Ordinario" type="number" />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField fullWidth size="small" label="Salario Bruto" type="number" />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            fullWidth
                            size="small"
                            label="Salario Neto"
                            type="number"
                            sx={{ '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'success.main', borderWidth: 2 } } }}
                        />
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    );
}