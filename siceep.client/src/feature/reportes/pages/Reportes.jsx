import React from 'react';
import {
    Box, Grid, Paper, Stack, Typography, Divider, Button, Chip,
    Skeleton, Alert, MenuItem, TextField, Tooltip
} from '@mui/material';
import AssessmentIcon from '@mui/icons-material/Assessment';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import SearchIcon from '@mui/icons-material/Search';
import PersonRemoveOutlinedIcon from '@mui/icons-material/PersonRemoveOutlined';
import RefreshIcon from '@mui/icons-material/Refresh';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
//
import { useReportes } from './../hooks/useReportes';
import { nombreMes } from './../pdf/reportePdfService';
import ConstanciasPanel from './../components/ConstanciasPanel';

const anioActual = new Date().getFullYear();
const anios = Array.from({ length: 7 }, (_, i) => anioActual - i);

const estilosCelda = { py: 1, fontSize: '0.875rem' };

export default function Reportes() {
    const {
        fuerza, altasBajas, consultado, mes, setMes, anio, setAnio,
        loadingFuerza, loadingAltas, generando,
        errorFuerza, errorAltas, recargarFuerza,
        consultarAltasBajas, descargarFuerza, descargarAltasBajas,
    } = useReportes();

    const altasBajasVigente = consultado?.mes === mes && consultado?.anio === anio;

    return (
        <Box sx={{ width: '100%', pb: 5 }}>
            <Box sx={{ mb: 2.5 }}>
                <Typography variant="h5" component="h1" color="text.primary" sx={{ fontWeight: 'bold' }}>
                    Reportes
                </Typography>
                <Typography variant="subtitle1" component="h2" color="text.secondary">
                    Genere informes oficiales en PDF para respaldo de la gestión de personal
                </Typography>
            </Box>

            <Grid container spacing={3}>
                {/* Informe diario de fuerza laboral */}
                <Grid size={{ xs: 12, lg: 6 }}>
                    <Paper variant="outlined" sx={{ borderRadius: 3, borderColor: 'divider' }}>
                        <Box sx={{ px: 2.5, pt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <AssessmentIcon fontSize="small" color="primary" />
                            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                                Informe Diario de Fuerza Laboral por Estructura
                            </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ px: 2.5, mt: 0.5 }}>
                            Personal activo agrupado por estructura, separado por sexo, con detalle de bajas del día.
                        </Typography>
                        <Divider sx={{ mx: 2.5, my: 2 }} />
                        <Box sx={{ px: 2.5, pb: 2.5 }}>
                            {loadingFuerza ? (
                                <Stack spacing={1}>
                                    {[0, 1, 2, 3, 4].map((i) => <Skeleton key={i} variant="rounded" height={34} />)}
                                </Stack>
                            ) : errorFuerza ? (
                                <Alert severity="error" action={
                                    <Button size="small" startIcon={<RefreshIcon />} onClick={() => recargarFuerza()}>Reintentar</Button>
                                }>{errorFuerza}</Alert>
                            ) : fuerza && (
                                <Stack spacing={2}>
                                    <TableContainer>
                                        <Table size="small">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell sx={{ ...estilosCelda, fontWeight: 700 }}>Estructura</TableCell>
                                                    <TableCell align="center" sx={{ ...estilosCelda, fontWeight: 700 }}>Hombres</TableCell>
                                                    <TableCell align="center" sx={{ ...estilosCelda, fontWeight: 700 }}>Mujeres</TableCell>
                                                    <TableCell align="center" sx={{ ...estilosCelda, fontWeight: 700 }}>Total</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {fuerza.estructuras.map((e, i) => (
                                                    <TableRow key={i}>
                                                        <TableCell sx={estilosCelda}>{e.estructura}</TableCell>
                                                        <TableCell align="center" sx={estilosCelda}>{e.masculinos}</TableCell>
                                                        <TableCell align="center" sx={estilosCelda}>{e.femeninos}</TableCell>
                                                        <TableCell align="center" sx={estilosCelda}>{e.total}</TableCell>
                                                    </TableRow>
                                                ))}
                                                <TableRow>
                                                    <TableCell sx={{ ...estilosCelda, fontWeight: 800 }}>TOTAL GENERAL</TableCell>
                                                    <TableCell align="center" colSpan={3} sx={{ ...estilosCelda, fontWeight: 800 }}>
                                                        {fuerza.totalGeneral}
                                                    </TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </TableContainer>

                                    <Stack direction="row" alignItems="center" spacing={1.5}>
                                        <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                            Bajas del día ({fuerza.bajasDelDia.length})
                                        </Typography>
                                        <Chip
                                            size="small"
                                            variant="outlined"
                                            color={fuerza.bajasDelDia.length > 0 ? 'error' : 'success'}
                                            icon={<PersonRemoveOutlinedIcon fontSize="small" />}
                                            label={fuerza.bajasDelDia.length > 0 ? 'Hay novedades' : 'Sin novedades'}
                                        />
                                    </Stack>
                                    {fuerza.bajasDelDia.length > 0 && (
                                        <Box sx={{ maxHeight: 140, overflow: 'auto' }}>
                                            <TableContainer>
                                                <Table size="small">
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell sx={{ ...estilosCelda, fontWeight: 700 }}>Nombre completo</TableCell>
                                                            <TableCell sx={{ ...estilosCelda, fontWeight: 700 }}>Estructura</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {fuerza.bajasDelDia.map((b, i) => (
                                                            <TableRow key={i}>
                                                                <TableCell sx={estilosCelda}>{b.nombreCompleto}</TableCell>
                                                                <TableCell sx={estilosCelda}>{b.estructura}</TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                        </Box>
                                    )}

                                    <Button
                                        variant="contained"
                                        startIcon={<PictureAsPdfIcon />}
                                        disabled={generando}
                                        onClick={descargarFuerza}
                                    >
                                        {generando ? 'Generando...' : 'Generar PDF'}
                                    </Button>
                                </Stack>
                            )}
                        </Box>
                    </Paper>
                </Grid>

                {/* Informe mensual de altas y bajas */}
                <Grid size={{ xs: 12, lg: 6 }}>
                    <Paper variant="outlined" sx={{ borderRadius: 3, borderColor: 'divider' }}>
                        <Box sx={{ px: 2.5, pt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CalendarMonthIcon fontSize="small" color="secondary" />
                            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                                Informe Mensual de Altas y Bajas
                            </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ px: 2.5, mt: 0.5 }}>
                            Historial de ingresos (altas) y retiros (bajas) del personal en un mes y año determinados.
                        </Typography>
                        <Divider sx={{ mx: 2.5, my: 2 }} />
                        <Box sx={{ px: 2.5, pb: 2.5 }}>
                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center" sx={{ mb: 2 }}>
                                <TextField
                                    select
                                    label="Mes"
                                    size="small"
                                    value={mes}
                                    onChange={(e) => setMes(Number(e.target.value))}
                                    sx={{ minWidth: 180 }}
                                >
                                    {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                                        <MenuItem key={m} value={m}>{nombreMes(m)}</MenuItem>
                                    ))}
                                </TextField>
                                <TextField
                                    select
                                    label="Año"
                                    size="small"
                                    value={anio}
                                    onChange={(e) => setAnio(Number(e.target.value))}
                                    sx={{ minWidth: 120 }}
                                >
                                    {anios.map((a) => <MenuItem key={a} value={a}>{a}</MenuItem>)}
                                </TextField>
                                <Tooltip title="Consultar información del período">
                                    <Button
                                        variant="outlined"
                                        startIcon={<SearchIcon />}
                                        onClick={() => consultarAltasBajas()}
                                        disabled={loadingAltas}
                                    >
                                        Consultar
                                    </Button>
                                </Tooltip>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    startIcon={<PictureAsPdfIcon />}
                                    disabled={generando || !altasBajasVigente}
                                    onClick={descargarAltasBajas}
                                >
                                    {generando ? 'Generando...' : 'Generar PDF'}
                                </Button>
                            </Stack>

                            {loadingAltas ? (
                                <Stack spacing={1}>
                                    {[0, 1, 2, 3].map((i) => <Skeleton key={i} variant="rounded" height={32} />)}
                                </Stack>
                            ) : errorAltas ? (
                                <Alert severity="error">{errorAltas}</Alert>
                            ) : altasBajasVigente ? (
                                <Stack spacing={2.5}>
                                    <Box>
                                        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.75 }}>
                                            <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                                Altas del mes
                                            </Typography>
                                            <Chip size="small" label={altasBajas.altas.length} color="success" variant="outlined" />
                                        </Stack>
                                        {altasBajas.altas.length === 0 ? (
                                            <Typography variant="body2" color="text.secondary" fontStyle="italic">
                                                No se registraron ingresos en el período.
                                            </Typography>
                                        ) : (
                                            <Box sx={{ maxHeight: 200, overflow: 'auto' }}>
                                                <TablaMovimiento filas={altasBajas.altas} motivo={false} />
                                            </Box>
                                        )}
                                    </Box>
                                    <Box>
                                        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.75 }}>
                                            <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                                Bajas del mes
                                            </Typography>
                                            <Chip size="small" label={altasBajas.bajas.length} color="error" variant="outlined" />
                                        </Stack>
                                        {altasBajas.bajas.length === 0 ? (
                                            <Typography variant="body2" color="text.secondary" fontStyle="italic">
                                                No se registraron bajas en el período.
                                            </Typography>
                                        ) : (
                                            <Box sx={{ maxHeight: 200, overflow: 'auto' }}>
                                                <TablaMovimiento filas={altasBajas.bajas} motivo />
                                            </Box>
                                        )}
                                    </Box>
                                </Stack>
                            ) : (
                                <Typography variant="body2" color="text.secondary" fontStyle="italic">
                                    Seleccione mes y año y presione "Consultar" para ver el informe.
                                </Typography>
                            )}
                        </Box>
                    </Paper>
                </Grid>

                {/* Constancias del personal */}
                <Grid size={{ xs: 12 }}>
                    <ConstanciasPanel />
                </Grid>
            </Grid>
        </Box>
    );
}

const TablaMovimiento = ({ filas, motivo }) => (
    <TableContainer>
        <Table size="small">
            <TableHead>
                <TableRow>
                    <TableCell sx={{ ...estilosCelda, fontWeight: 700 }}>Código</TableCell>
                    <TableCell sx={{ ...estilosCelda, fontWeight: 700 }}>Nombre completo</TableCell>
                    <TableCell sx={{ ...estilosCelda, fontWeight: 700 }}>Cargo</TableCell>
                    <TableCell sx={{ ...estilosCelda, fontWeight: 700 }}>Estructura</TableCell>
                    <TableCell sx={{ ...estilosCelda, fontWeight: 700 }}>Fecha</TableCell>
                    {motivo && <TableCell sx={{ ...estilosCelda, fontWeight: 700 }}>Motivo</TableCell>}
                </TableRow>
            </TableHead>
            <TableBody>
                {filas.map((f, i) => (
                    <TableRow key={i}>
                        <TableCell sx={estilosCelda}>{f.codigo}</TableCell>
                        <TableCell sx={estilosCelda}>{f.nombreCompleto}</TableCell>
                        <TableCell sx={estilosCelda}>{f.cargo}</TableCell>
                        <TableCell sx={estilosCelda}>{f.estructura}</TableCell>
                        <TableCell sx={estilosCelda}>{f.fecha}</TableCell>
                        {motivo && <TableCell sx={estilosCelda}>{f.motivo || 'S/D'}</TableCell>}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </TableContainer>
);