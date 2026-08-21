import React, { useState, useEffect } from 'react';
import { Box, Grid, TextField, Typography, Paper, MenuItem, Divider } from '@mui/material';
import { useSelectSexo } from './../../hooks/Select/useSelectSexo'
import SelectItemB from './../../../../shared/components/select/SelectItemB'
import { useSelectEstadoCivil } from './../../hooks/Select/useSelectEstadoCivil'

export default function TabDatosGenerales() {

    const { selSexo, loadingS } = useSelectSexo();
    const [sexo, setSexo] = useState('');

    const { selECivil, loadingEC } = useSelectEstadoCivil();
    const [estadoCivil, setEstadoCivil] = useState(1);

    useEffect(() => {
        const cargarSexo = () => {
            setSexo(selSexo?.id || 'M');
        };
        cargarSexo();
    }, [selSexo]);

    useEffect(() => {
        const cargarEstadoCivil = () => {
            setEstadoCivil(selECivil?.id || 1);
        };
        cargarEstadoCivil();
    }, [selECivil]);

    return (

        <Box>
            {/* Se eliminó por completo la sección de Identificación Corporativa */}
            <Typography variant="subtitle1" color="primary" fontWeight="bold" sx={{ mb: 2 }}>
                Información Personal
            </Typography>

            <Paper elevation={0} sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: 2 }}>
                <Grid container spacing={3}>
                    {/* Área de Fotografía (Columna Izquierda) */}
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Box
                            sx={{
                                width: '100%',
                                height: '100%',
                                minHeight: '220px',
                                border: '1px dashed #c4c4c4',
                                borderRadius: 2,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: '#fafafa'
                            }}
                        >
                            <Typography variant="body2" color="text.secondary">
                                Área de Fotografía
                            </Typography>
                        </Box>
                    </Grid>

                    {/* Campos de Datos (Columna Derecha) */}
                    <Grid size={{ xs: 12, md: 8 }}>
                        <Grid container spacing={2}>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField fullWidth size="small" label="Nombres" />
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField fullWidth size="small" label="Primer Apellido" />
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField fullWidth size="small" label="Segundo Apellido" />
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField fullWidth size="small" label="N° Cédula" />
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                {loadingS ? (
                                    <p>Cargando...</p>
                                ) : (
                                    <Box>
                                        <SelectItemB
                                            value={sexo}
                                            onChange={(selSexo) => {
                                                setSexo(selSexo);
                                            }}
                                            datos={selSexo}
                                            titulo=""
                                        />
                                    </Box>
                                )}
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                {loadingEC ? (
                                    <p>Cargando...</p>
                                ) : (
                                    <Box>
                                        <SelectItemB
                                            value={estadoCivil}
                                            onChange={(selECivil) => {
                                                setEstadoCivil(selECivil);
                                            }}
                                            datos={selECivil}
                                            titulo=""
                                        />
                                    </Box>
                                )}
                            </Grid>
                            
                            <Grid size={{ xs: 12, md: 6 }}>
                                {/* Nuevo campo agregado según tu indicación */}
                                <TextField fullWidth size="small" label="Lugar de Nacimiento" />
                            </Grid>
                            
                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField fullWidth size="small" type="date" label="Fecha Nacimiento" InputLabelProps={{ shrink: true }} />
                            </Grid>
                            
                        </Grid>
                        {/* Contacto y Domicilio */}
                        <Divider sx={{ my: 1 }} />
                        <Typography variant="subtitle2" color="primary" fontWeight="bold" sx={{ mb: 2 }}>
                            Domicilio 
                        </Typography>

                        <Grid container spacing={3}>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField fullWidth size="small" label="Dirección Domiciliar" multiline rows={3} />
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }} >
                                <Grid size={{ xs: 12, md: 12 }}>
                                    <TextField fullWidth size="small" label="Teléfono Fijo" />
                                </Grid>
                                <Divider sx={{ my: 1 }} />
                                <Grid size={{ xs: 12, md: 12 }}>
                                    <TextField fullWidth size="small" label="Celular" />
                                </Grid>

                            </Grid>
                        </Grid>

                    </Grid>

                    
                </Grid>
            </Paper>
        </Box>
    );
}