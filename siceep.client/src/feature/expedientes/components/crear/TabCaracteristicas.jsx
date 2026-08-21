import React from 'react';
import { Box, Grid, TextField, Typography, Paper, MenuItem } from '@mui/material';

export default function TabCaracteristicas() {
    return (
        <Box>
            
            {/* Características Físicas */}
            <Typography variant="subtitle2" color="primary" fontWeight="bold" sx={{ mb: 2 }}>
                Características Físicas
            </Typography>
            <Paper elevation={0} sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: 2, mb: 4 }}>
                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <TextField fullWidth size="small" label="Estatura (metros)" type="number" />
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <TextField fullWidth size="small" label="Peso (Libras)" type="number" />
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <TextField select fullWidth size="small" label="Tipo Sanguíneo" defaultValue="">
                            <MenuItem value="O+">O+</MenuItem>
                            <MenuItem value="O-">O-</MenuItem>
                            <MenuItem value="A+">A+</MenuItem>
                            <MenuItem value="A-">A-</MenuItem>
                            <MenuItem value="B+">B+</MenuItem>
                            <MenuItem value="B-">B-</MenuItem>
                            <MenuItem value="AB+">AB+</MenuItem>
                            <MenuItem value="AB-">AB-</MenuItem>
                        </TextField>
                    </Grid>
                    <Grid size={{ xs: 12, md: 3 }}>
                        <TextField select fullWidth size="small" label="Color de Piel" defaultValue="">
                            <MenuItem value="BLANCA">Blanca</MenuItem>
                            <MenuItem value="MORENA">Morena</MenuItem>
                            <MenuItem value="NEGRA">Negra</MenuItem>
                            <MenuItem value="OTRO">Otro</MenuItem>
                        </TextField>
                    </Grid>
                    <Grid size={{ xs: 12, md: 3 }}>
                        <TextField select fullWidth size="small" label="Color de Ojos" defaultValue="">
                            <MenuItem value="CAFE">Café</MenuItem>
                            <MenuItem value="NEGRO">Negro</MenuItem>
                            <MenuItem value="VERDE">Verde</MenuItem>
                            <MenuItem value="AZUL">Azul</MenuItem>
                        </TextField>
                    </Grid>
                    <Grid size={{ xs: 12, md: 3 }}>
                        <TextField select fullWidth size="small" label="Color de Pelo" defaultValue="">
                            <MenuItem value="NEGRO">Negro</MenuItem>
                            <MenuItem value="CASTANO">Castaño</MenuItem>
                            <MenuItem value="RUBIO">Rubio</MenuItem>
                            <MenuItem value="CANOSO">Canoso</MenuItem>
                        </TextField>
                    </Grid>
                    <Grid size={{ xs: 12, md: 3 }}>
                        <TextField select fullWidth size="small" label="Tipo de Pelo" defaultValue="">
                            <MenuItem value="LISO">Liso</MenuItem>
                            <MenuItem value="ONDULADO">Ondulado</MenuItem>
                            <MenuItem value="RIZADO">Rizado</MenuItem>
                        </TextField>
                    </Grid>
                </Grid>
            </Paper>

            {/* Contacto  */}
            <Typography variant="subtitle2" color="primary" fontWeight="bold" sx={{ mb: 2 }}>
                Contacto de Emergencia
            </Typography>
            
            <Paper elevation={0} sx={{ p: 3, border: '1px solid #ffcdd2', backgroundColor: '#fff5f5', borderRadius: 2 }}>
                <Typography variant="subtitle2" color="error" fontWeight="bold" sx={{ mb: 2 }}>
                    En caso de emergencia contactar a:
                </Typography>
                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <TextField fullWidth size="small" label="Nombre Completo" />
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <TextField fullWidth size="small" label="Parentesco" />
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <TextField fullWidth size="small" label="Teléfono / Celular" />
                    </Grid>

                    <Grid size={{ xs: 12, md: 12 }}>
                        <TextField fullWidth size="small" label="Dirección" />
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    );
}