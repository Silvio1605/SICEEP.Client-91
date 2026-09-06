import { useState, useEffect, useContext } from 'react';
import { Box, Grid, TextField, Typography, Paper, Divider, InputAdornment } from '@mui/material';
import { useSelectPlaza } from './../../hooks/useSelectPlaza';
import { ExpedienteContext } from './../../context/ExpedienteContext';
import FormContratoPlaza from '../FormContratoPlaza';

// Definir el tipo de Plaza según tu modelo
export default function TabInfoLaboral() {

    const { plazas, loading, error, buscarPlazas } = useSelectPlaza();
    const { expediente, actualizarSeccion, actualizarCampo } = useContext(ExpedienteContext);

    // Estados para los campos (ejemplo)
    const [devengado, setDevengado] = useState('');
    const [deducciones, setDeducciones] = useState('');

    // Calcular salario bruto y neto desde el contexto (contrato)
    const salarioBruto = Number(expediente.contrato?.salarioMensual) || 0;
    const totalDeducciones = parseFloat(deducciones) || 0;
    const salarioNeto = salarioBruto - totalDeducciones;

    useEffect(() => {
        if (!expediente.contrato) {
            // Si la sección está vacía, la creamos con valores predeterminados
            actualizarSeccion('contrato', {
                ordinal: null,
                numInss: '',
                tipoContrato: 'P',
                fechaInicio: null,
                fechaCese: null,
                salarioMensual: '',
            });
        }

    }, [expediente, actualizarSeccion]);

    const contrato = expediente.contrato || {};

    return (
        <Box>

            {/* 1 y 2. INFORMACIÓN DEL CONTRATO + INFORMACIÓN DE LA PLAZA */}
            <FormContratoPlaza
                value={contrato}
                onChange={(campo, valor) => actualizarCampo('contrato', campo, valor)}
                plazas={plazas}
                loading={loading}
                error={error}
                buscarPlazas={buscarPlazas}
                requerirInss
            />

            {/* 3. DESGLOSE SALARIAL (Abajo, con su borde verde) */}
            <Typography variant="subtitle2" color="primary" fontWeight="bold" sx={{ mb: 2 }}>
                Desglose Salarial
            </Typography>

            <Paper elevation={1} sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: 2 }}>
                <Grid container spacing={3}>

                    {/* Primera fila: Ingresos */}
                    <Grid size={{ xs: 12 }}>
                        <Typography variant="caption" color="textSecondary" fontWeight="bold" sx={{ display: 'block', mb: 1 }}>
                            INGRESOS
                        </Typography>
                        <Grid container spacing={3}>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    type="number"
                                    label="Salario Mensual"
                                    value={contrato.salarioMensual || ''}
                                    onChange={(e) => actualizarCampo('contrato', 'salarioMensual', parseFloat(e.target.value) || 0)}
                                    placeholder="0.00"
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">C$</InputAdornment>,
                                    }}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    label="Devengado"
                                    value={devengado}
                                    onChange={(e) => setDevengado(e.target.value)}
                                    placeholder="0.00"
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">C$</InputAdornment>,
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <Divider />
                    </Grid>

                    {/* Segunda fila: Deducciones */}
                    <Grid size={{ xs: 12 }}>
                        <Typography variant="caption" color="textSecondary" fontWeight="bold" sx={{ display: 'block', mb: 1 }}>
                            DEDUCCIONES
                        </Typography>
                        <Grid container spacing={3}>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    label="Deducciones Totales"
                                    value={deducciones}
                                    onChange={(e) => setDeducciones(e.target.value)}
                                    placeholder="0.00"
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">C$</InputAdornment>,
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <Divider />
                    </Grid>

                    {/* Tercera fila: Totales con estilo */}
                    <Grid size={{ xs: 12 }}>
                        <Typography variant="caption" color="textSecondary" fontWeight="bold" sx={{ display: 'block', mb: 1 }}>
                            TOTALES
                        </Typography>
                        <Grid container spacing={3}>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    label="Salario Bruto"
                                    value={salarioBruto.toFixed(2)}
                                    InputProps={{
                                        readOnly: true,
                                        startAdornment: <InputAdornment position="start">C$</InputAdornment>,
                                        sx: { backgroundColor: '#f5f5f5' }
                                    }}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    label="Salario Neto"
                                    value={salarioNeto.toFixed(2)}
                                    InputProps={{
                                        readOnly: true,
                                        startAdornment: <InputAdornment position="start">C$</InputAdornment>,
                                        sx: {
                                            backgroundColor: '#e8f5e9',
                                            fontWeight: 'bold',
                                            '& .MuiInputBase-input': { fontWeight: 'bold', color: '#2e7d32' }
                                        }
                                    }}
                                    InputLabelProps={{ shrink: true }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': { borderColor: '#2e7d32', borderWidth: 2 }
                                        }
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </Grid>

                </Grid>
            </Paper>
        </Box>
    );
}