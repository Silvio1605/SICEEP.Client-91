import React, { useEffect, useState, useCallback } from 'react';
import {
    Box, Grid, Typography, Paper, Divider, Table, TableHead, TableBody, TableRow,
    TableCell, TableContainer, Chip, CircularProgress, Alert, MenuItem, TextField,
    Stack, Tooltip
} from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { getNominaResumen } from '../../services/expedienteService';
import { formatoMoneda } from '../../../laboral/utils/deduccionUtils';

const ETIQUETA_PERIODO = (periodo) => {
    if (!periodo || !/^\d{4}-\d{2}$/.test(periodo)) return periodo || 'SIN PERIODO';
    const [anio, mes] = periodo.split('-');
    const nombres = ['ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO',
        'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'];
    return `${nombres[Number(mes) - 1] || mes} ${anio}`;
};

const formatearFecha = (fecha) => {
    if (!fecha) return 'SIN REGISTRO';
    // DateOnly llega como "2026-08-31"; sin la T se interpretaria en UTC y
    // retrocederia un dia en zonas con offset negativo.
    return new Date(`${fecha}T00:00:00`).toLocaleDateString('es-NI', {
        day: '2-digit', month: '2-digit', year: 'numeric'
    });
};

const Tarjeta = ({ etiqueta, valor, ayuda, color, fondo, borde }) => (
    <Paper variant="outlined" sx={{
        p: 2, height: '100%', borderRadius: 2,
        border: '1px solid', borderColor: borde || 'divider',
        bgcolor: fondo || '#fafafa'
    }}>
        <Typography variant="caption" color="text.secondary" display="block"
            sx={{ mb: 0.5, letterSpacing: 0.4, fontWeight: 700 }}>
            {etiqueta}
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 700, color: color || 'text.primary' }}>
            {valor}
        </Typography>
        {ayuda && (
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
                {ayuda}
            </Typography>
        )}
    </Paper>
);

const TablaDetalle = ({ titulo, colorBorde, filas, columnaMonto, total, subtotalTexto, vacio }) => (
    <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" color="primary" fontWeight="bold" sx={{ mb: 1.5 }}>
            {titulo}
        </Typography>
        <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
            <Table size="small">
                <TableHead>
                    <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                        <TableCell sx={{ fontWeight: 700 }}>Concepto</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Fecha</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700 }}>{columnaMonto}</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {filas.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={3} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                                {vacio}
                            </TableCell>
                        </TableRow>
                    ) : filas.map((f) => (
                        <TableRow key={f.id} hover>
                            <TableCell>
                                <Typography variant="body2" fontWeight={600}>
                                    {f.concepto}
                                </Typography>
                                {f.detalle && (
                                    <Typography variant="caption" color="text.secondary">
                                        {f.detalle}
                                    </Typography>
                                )}
                            </TableCell>
                            <TableCell>
                                <Typography variant="body2" color="text.secondary">
                                    {f.fecha}
                                </Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Typography variant="body2" fontWeight={600}>
                                    {formatoMoneda(f.monto)}
                                </Typography>
                            </TableCell>
                        </TableRow>
                    ))}
                    {filas.length > 0 && (
                        <TableRow sx={{ bgcolor: '#fafafa' }}>
                            <TableCell colSpan={2} sx={{ fontWeight: 700, borderLeft: `3px solid ${colorBorde}` }}>
                                {subtotalTexto}
                            </TableCell>
                            <TableCell align="right" sx={{ fontWeight: 700, borderLeft: `3px solid ${colorBorde}` }}>
                                {formatoMoneda(total)}
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    </Box>
);

export default function InfoNomina({ idEmpleado }) {
    const [nomina, setNomina] = useState(null);
    const [periodo, setPeriodo] = useState('');
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    const cargar = useCallback(async (periodoPedido) => {
        if (!idEmpleado) return;
        setCargando(true);
        setError(null);
        try {
            const res = await getNominaResumen(idEmpleado, periodoPedido);
            setNomina(res?.data || null);
        } catch (e) {
            setNomina(null);
            setError(e?.response?.data?.message || e?.message || 'No se pudo cargar el resumen salarial.');
        } finally {
            setCargando(false);
        }
    }, [idEmpleado]);

    useEffect(() => {
        cargar(periodo);
    }, [cargar, periodo]);

    if (cargando && !nomina) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ mt: 3 }}>
                <Alert severity="warning">{error}</Alert>
            </Box>
        );
    }

    if (!nomina || nomina.sinRegistros) {
        return (
            <Box sx={{ mt: 3 }}>
                <Alert severity="info">
                    Este empleado no tiene nomina registrada.
                </Alert>
            </Box>
        );
    }

    const hayPeriodos = nomina.periodos?.length > 0;
    const filasDevengados = (nomina.devengados || []).map((d) => ({
        id: d.idDevengado,
        concepto: d.nombreTipoDevengado,
        detalle: null,
        fecha: formatearFecha(d.fechaDevengado),
        monto: d.monto
    }));

    const filasDeducciones = (nomina.deducciones || []).map((d) => ({
        id: d.idDeduccion,
        concepto: d.nombreTipoDeduccion,
        detalle: d.nombreInstitucion || null,
        fecha: formatearFecha(d.fechaDeduccion),
        monto: d.monto
    }));

    const hayMasPeriodos = nomina.periodos?.length > 1;

    return (
        <Box sx={{ mt: 3, mb: 3 }}>
            <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                <Stack direction={{ xs: 'column', sm: 'row' }}
                    justifyContent="space-between"
                    alignItems={{ xs: 'flex-start', sm: 'center' }}
                    sx={{ mb: 1, gap: 2 }}
                >
                    <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}>
                        Resumen Salarial
                    </Typography>

                    {hayMasPeriodos && (
                        <TextField
                            select
                            size="small"
                            label="Periodo"
                            value={nomina.periodo || ''}
                            onChange={(e) => setPeriodo(e.target.value)}
                            sx={{ minWidth: 200 }}
                        >
                            {nomina.periodos.map((p) => (
                                <MenuItem key={p.periodo} value={p.periodo}>
                                    {ETIQUETA_PERIODO(p.periodo)}
                                </MenuItem>
                            ))}
                        </TextField>
                    )}
                </Stack>

                <Stack direction="row" spacing={1} sx={{ mb: 3, flexWrap: 'wrap', gap: 1 }}>
                    <Chip size="small" label={ETIQUETA_PERIODO(nomina.periodo)} color="primary" />
                    <Chip size="small" variant="outlined" label={`Pago: ${formatearFecha(nomina.fechaPago)}`} />
                </Stack>

                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={3}>
                        <Tarjeta etiqueta="Salario ordinario"
                            valor={formatoMoneda(nomina.salarioOrdinario)}
                            ayuda="Segun contrato" />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Tarjeta etiqueta="Salario bruto"
                            valor={formatoMoneda(nomina.salarioBruto)}
                            ayuda="Suma de devengados"
                            color="#1b5e20" fondo="#e8f5e9" borde="#2e7d32" />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Tarjeta etiqueta="Deducciones"
                            valor={formatoMoneda(nomina.totalDeducciones)}
                            ayuda="Total del periodo"
                            color="#b71c1c" fondo="#fdecea" borde="#c62828" />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Tooltip title="Bruto menos deducciones">
                            <Tarjeta etiqueta="Salario neto"
                                valor={formatoMoneda(nomina.salarioNeto)}
                                ayuda="Lo que recibe el empleado"
                                color="#0d47a1" fondo="#e3f2fd" borde="#1565c0" />
                        </Tooltip>
                    </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                <TablaDetalle
                    titulo="Devengados"
                    colorBorde="#2e7d32"
                    filas={filasDevengados}
                    columnaMonto="Monto"
                    total={nomina.salarioBruto}
                    subtotalTexto="TOTAL DEVENGADO (SALARIO BRUTO)"
                    vacio="Sin ingresos registrados en el periodo."
                />

                <TablaDetalle
                    titulo="Deducciones"
                    colorBorde="#c62828"
                    filas={filasDeducciones}
                    columnaMonto="Monto"
                    total={nomina.totalDeducciones}
                    subtotalTexto="TOTAL DEDUCIDO"
                    vacio="Sin deducciones registradas en el periodo."
                />

                <Stack direction="row" spacing={1} alignItems="center" sx={{ color: 'text.secondary' }}>
                    <AccountBalanceWalletIcon fontSize="small" />
                    <Typography variant="caption">
                        {hayPeriodos
                            ? `${nomina.periodos.length} periodo(s) con nomina registrada.`
                            : 'Nomina calculada a partir del detalle registrado.'}
                    </Typography>
                </Stack>
            </Paper>
        </Box>
    );
}
