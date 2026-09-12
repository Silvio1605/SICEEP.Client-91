import React from 'react';
import { Box, Typography, Grid, Skeleton, Stack, Chip, Button, Alert } from '@mui/material';
import Groups3Icon from '@mui/icons-material/Groups3';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import PersonRemoveOutlinedIcon from '@mui/icons-material/PersonRemoveOutlined';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import BadgeIcon from '@mui/icons-material/Badge';
import WcIcon from '@mui/icons-material/Wc';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import SchoolIcon from '@mui/icons-material/School';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import RefreshIcon from '@mui/icons-material/Refresh';
//
import { useDashboard } from './../hooks/useDashboard';
import TarjetaKpi from './../components/TarjetaKpi';
import PanelEstadistica from './../components/PanelEstadistica';
import GraficoDona from './../components/GraficoDona';
import BarrasEstructura from './../components/BarrasEstructura';
import BarrasSimples from './../components/BarrasSimples';

const colorM = '#1976d2';
const colorF = '#d81b60';

export default function Dashboard() {
    const { data, loading, error, recargar } = useDashboard();

    const esqueletoKpis = (
        <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap', gap: 1.5, mb: 3 }}>
            {[0, 1, 2, 3, 4].map((i) => (
                <Skeleton key={i} variant="rounded" height={104} sx={{ flex: '1 1 170px', borderRadius: 3 }} />
            ))}
        </Stack>
    );

    const esqueletoPanel = (alto = 260) => (
        <Skeleton variant="rounded" height={alto} sx={{ borderRadius: 3 }} />
    );

    return (
        <Box sx={{ width: '100%', pb: 5 }}>
            <Box sx={{ mb: 2.5 }}>
                <Typography variant="h5" component="h1" color="text.primary" sx={{ fontWeight: 'bold' }}>
                    Panel de Control
                </Typography>
                <Typography variant="subtitle1" component="h2" color="text.secondary">
                    Distribución de la fuerza laboral en tiempo real
                </Typography>
            </Box>

            {loading && (
                <>
                    {esqueletoKpis}
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, md: 5 }}>{esqueletoPanel()}</Grid>
                        <Grid size={{ xs: 12, md: 7 }}>{esqueletoPanel(340)}</Grid>
                        <Grid size={{ xs: 12, md: 7 }}>{esqueletoPanel()}</Grid>
                        <Grid size={{ xs: 12, md: 5 }}>{esqueletoPanel()}</Grid>
                    </Grid>
                </>
            )}

            {!loading && error && (
                <Alert
                    severity="error"
                    action={
                        <Button color="inherit" size="small" startIcon={<RefreshIcon />} onClick={recargar}>
                            Reintentar
                        </Button>
                    }
                >
                    {error}
                </Alert>
            )}

            {!loading && !error && data && (
                <>
                    <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap', gap: 1.5, mb: 3 }}>
                        <TarjetaKpi
                            titulo="Total de empleados"
                            valor={data.resumen.totalEmpleados}
                            icono={<Groups3Icon fontSize="small" />}
                            subvalor={`${data.resumen.contratosActivos} contratos vigentes`}
                        />
                        <TarjetaKpi
                            titulo="Activos"
                            valor={data.resumen.activos}
                            color="success.main"
                            icono={<CheckCircleOutlineIcon fontSize="small" />}
                            subvalor={`${data.resumen.porcentajeActivos}% de la planilla`}
                        />
                        <TarjetaKpi
                            titulo="En baja"
                            valor={data.resumen.bajas}
                            color="error.main"
                            icono={<PersonRemoveOutlinedIcon fontSize="small" />}
                        />
                        <TarjetaKpi
                            titulo="Comisión de servicio"
                            valor={data.resumen.comisionServicio}
                            color="warning.main"
                            icono={<SwapHorizIcon fontSize="small" />}
                        />
                        <TarjetaKpi
                            titulo="Contratos vigentes"
                            valor={data.resumen.contratosActivos}
                            icono={<BadgeIcon fontSize="small" />}
                        />
                    </Stack>

                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, md: 5 }}>
                            <PanelEstadistica
                                titulo="Personal por sexo"
                                icono={<WcIcon fontSize="small" color="primary" />}
                            >
                                <GraficoDona
                                    items={[
                                        { label: 'Masculino', valor: data.porSexo.find((s) => s.sexo === 'Masculino')?.cantidad || 0, color: colorM },
                                        { label: 'Femenino', valor: data.porSexo.find((s) => s.sexo === 'Femenino')?.cantidad || 0, color: colorF },
                                    ]}
                                    centerSub="empleados"
                                />
                            </PanelEstadistica>
                        </Grid>

                        <Grid size={{ xs: 12, md: 7 }}>
                            <PanelEstadistica
                                titulo="Fuerza laboral por estructura"
                                icono={<AccountTreeIcon fontSize="small" color="primary" />}
                                accion={
                                    <Chip
                                        size="small"
                                        label="M / F"
                                        variant="outlined"
                                        sx={{ ml: 'auto', fontSize: 12 }}
                                    />
                                }
                                sx={{ height: '100%' }}
                            >
                                <BarrasEstructura items={data.porEstructura.slice(0, 12)} />
                            </PanelEstadistica>
                        </Grid>

                        <Grid size={{ xs: 12, md: 7 }}>
                            <PanelEstadistica
                                titulo="Nivel académico máximo alcanzado"
                                icono={<SchoolIcon fontSize="small" color="primary" />}
                            >
                                <BarrasSimples items={data.porNivelAcademico} color="success.main" />
                            </PanelEstadistica>
                        </Grid>

                        <Grid size={{ xs: 12, md: 5 }}>
                            <PanelEstadistica
                                titulo="Situación del personal"
                                icono={<FamilyRestroomIcon fontSize="small" color="primary" />}
                            >
                                <GraficoDona
                                    items={[
                                        { label: 'Activos', valor: data.resumen.activos, color: '#2e7d32' },
                                        { label: 'En baja', valor: data.resumen.bajas, color: '#d32f2f' },
                                        { label: 'Comisión de servicio', valor: data.resumen.comisionServicio, color: '#ed6c02' },
                                    ]}
                                    centerTexto={`${data.resumen.porcentajeActivos}%`}
                                    centerSub="activos"
                                />
                            </PanelEstadistica>
                        </Grid>
                    </Grid>
                </>
            )}
        </Box>
    );
}