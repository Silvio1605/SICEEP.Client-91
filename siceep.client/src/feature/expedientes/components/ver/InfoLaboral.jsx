import React from 'react';
import { Box, Grid, Typography, Paper, Divider } from '@mui/material';
import { formatearFechaLegible, nombreTipoContrato } from '../../utils/expedienteMappers';

const CampoInfo = ({ etiqueta, valor, destacado = false }) => (
    <Box sx={{
        height: '100%',
        borderRadius: 1.5,
        border: '1px solid',
        borderColor: destacado ? 'primary.main' : 'divider',
        bgcolor: destacado ? 'rgba(46,116,181,0.08)' : '#fafafa',
        p: 1.5,
    }}>
        <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5, letterSpacing: 0.3 }}>
            {etiqueta.toUpperCase()}
        </Typography>
        <Typography variant="body1" color="text.primary" sx={{ fontWeight: destacado ? 'bold' : 600 }}>
            {valor || 'NO DISPONIBLE'}
        </Typography>
    </Box>
);

const Seccion = ({ titulo, children }) => (
    <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle2" color="primary" fontWeight="bold" sx={{ mb: 2 }}>
            {titulo}
        </Typography>
        <Divider sx={{ mb: 2 }} />
        {children}
    </Box>
);

export default function InfoLaboral({ data }) {
    const contrato = data?.contrato || {};
    const plaza = data?.plaza || {};

    return (
        <Box sx={{ mt: 3, mb: 3 }}>
            <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold', textTransform: 'uppercase', mb: 3 }}>
                    Información Laboral
                </Typography>

                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <Seccion titulo="Información del Contrato">
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <CampoInfo etiqueta="N° INSS" valor={data?.numInss || contrato?.numInss} />
                                </Grid>
                                <Grid item xs={12}>
                                    <CampoInfo etiqueta="Tipo de Contrato" valor={nombreTipoContrato(contrato?.tipoContrato)} />
                                </Grid>
                                <Grid item xs={12}>
                                    <CampoInfo etiqueta="Fecha de Ingreso" valor={formatearFechaLegible(data?.fechaIngreso || contrato?.fechaInicio)} />
                                </Grid>
                                <Grid item xs={12}>
                                    <CampoInfo etiqueta="Fecha de Cese" valor={formatearFechaLegible(contrato?.fechaCese)} />
                                </Grid>
                                <Grid item xs={12}>
                                    <CampoInfo etiqueta="Número de Expediente" valor={data?.numeroExpediente || data?.codigo} />
                                </Grid>
                                <Grid item xs={12}>
                                    <CampoInfo etiqueta="Salario Mensual" valor={contrato?.salarioMensual ? `C$ ${Number(contrato.salarioMensual).toLocaleString()}` : null} destacado />
                                </Grid>
                            </Grid>
                        </Seccion>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Seccion titulo="Información de la Plaza (se administra por separado)">
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <CampoInfo etiqueta="Código de Plaza" valor={plaza?.ordinal} />
                                </Grid>
                                <Grid item xs={12}>
                                    <CampoInfo etiqueta="Orden" valor={plaza?.orden} />
                                </Grid>
                                <Grid item xs={12}>
                                    <CampoInfo etiqueta="Estructura" valor={plaza?.estructura} />
                                </Grid>
                                <Grid item xs={12}>
                                    <CampoInfo etiqueta="Unidad Administrativa" valor={plaza?.unidad} />
                                </Grid>
                                <Grid item xs={12}>
                                    <CampoInfo etiqueta="Cargo Asignado" valor={plaza?.cargo} />
                                </Grid>
                                <Grid item xs={12}>
                                    <CampoInfo etiqueta="Nivel / Categoría" valor={plaza?.categoria} />
                                </Grid>
                                <Grid item xs={12}>
                                    <CampoInfo etiqueta="Salario Presupuestado" valor={plaza?.salario ? `C$ ${Number(plaza.salario).toLocaleString()}` : null} />
                                </Grid>
                                <Grid item xs={12}>
                                    <CampoInfo etiqueta="Estado de la Plaza" valor={plaza?.estado} />
                                </Grid>
                            </Grid>
                        </Seccion>
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    );
}