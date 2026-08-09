import React from 'react';
import { Box, Grid, Paper, Typography, TextField, Button, Divider, MenuItem, InputAdornment } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

export default function GestionDeducciones() {
    return (
        <Box sx={{ width: '100%', pb: 5 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box>
                    <Typography variant="h5" color="text.primary" fontWeight="bold">
                        Gestión de Deducciones
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                        Control de préstamos, adelantos y retenciones del personal
                    </Typography>
                </Box>
            </Box>

            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    <Paper elevation={2} sx={{ p: 3, borderRadius: 2, height: '100%', minHeight: '400px' }}>
                        <Typography variant="subtitle1" color="primary" fontWeight="bold" sx={{ mb: 2 }}>
                            Deducciones Activas del Funcionario
                        </Typography>

                        <TextField
                            fullWidth
                            size="small"
                            label="Buscar Funcionario (Nombre o N° Expediente)"
                            sx={{ mb: 3 }}
                        />

                        <Box sx={{ border: '1px dashed #c4c4c4', borderRadius: 2, height: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fafafa' }}>
                            <Typography variant="body2" color="text.secondary">
                                Seleccione un funcionario para ver sus deducciones...
                            </Typography>
                        </Box>
                    </Paper>
                </Grid>

              
                <Grid item xs={12} md={4}>
                    <Grid container spacing={3}>

                        <Grid item xs={12}>
                            <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
                                <Typography variant="subtitle2" color="primary" fontWeight="bold" sx={{ mb: 2 }}>
                                    Agregar Deducción
                                </Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <TextField select fullWidth size="small" label="Institución (Inst)" defaultValue="">
                                            <MenuItem value="GALLO">El Gallo más Gallo</MenuItem>
                                            <MenuItem value="CONCEP">CONCEP</MenuItem>
                                        </TextField>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField fullWidth size="small" label="Monto Mensual" type="number" InputProps={{ startAdornment: <InputAdornment position="start">C$</InputAdornment> }} />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField fullWidth size="small" label="Total de la Deuda" type="number" InputProps={{ startAdornment: <InputAdornment position="start">C$</InputAdornment> }} />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Button variant="contained" color="primary" fullWidth startIcon={<SaveIcon />}>
                                            Guardar Deducción
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>

                        <Grid item xs={12}>
                            <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1 }}>
                                    <AccountBalanceIcon color="primary" fontSize="small" />
                                    <Typography variant="subtitle2" color="primary" fontWeight="bold">
                                        Agregar Institución
                                    </Typography>
                                </Box>
                                <Divider sx={{ mb: 2 }} />
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <TextField fullWidth size="small" label="Nombre de la Institución" placeholder="Ej: El Gallo más Gallo" />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Button variant="outlined" color="primary" fullWidth startIcon={<AddCircleOutlineIcon />}>
                                            Registrar Institución
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>

                    </Grid>
                </Grid>
            </Grid>
        </Box>
    );
}