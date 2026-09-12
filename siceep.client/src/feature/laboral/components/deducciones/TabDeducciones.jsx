import React, { useState } from 'react';
import { Box, Paper, Stack, Avatar, Typography, Button, Grid, Skeleton, Divider, Chip } from '@mui/material';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
//
import BusquedaPropietario from './../../../usuarios/components/BusquedaPropietario';
import { useDeducciones } from './../../hooks/useDeducciones';
import EncabezadoEmpleado from './EncabezadoEmpleado';
import ListaDeducciones from './ListaDeducciones';
import FormularioDeduccion from './FormularioDeduccion';
import FormularioInstitucion from './FormularioInstitucion';
import ListaInstituciones from './ListaInstituciones';
import { formatoMoneda } from './../../utils/deduccionUtils';

export default function TabDeducciones() {
    const {
        empleado, deducciones, tipos, instituciones,
        loading, loadingCatalogos, error,
        seleccionarEmpleado, quitarEmpleado,
        editando, editarDeduccion, cancelarEdicion, guardarDeduccion, eliminarDeduccion,
        editandoInst, editarInstitucion, limpiarInstitucion, guardarInstitucion, eliminarInstitucion
    } = useDeducciones();

    const [openBusqueda, setOpenBusqueda] = useState(false);

    const confirmarEliminarDeduccion = (fila) => {
        if (!window.confirm(`¿Eliminar la deducción de ${fila.nombreTipoDeduccion} por ${formatoMoneda(fila.monto)} (${fila.periodo})?`)) return;
        eliminarDeduccion(fila).catch((e) =>
            alert(e?.response?.data?.message || e?.message || "No se pudo eliminar la deducción.")
        );
    };

    const confirmarEliminarInstitucion = (i) => {
        if (!window.confirm(`¿Eliminar la institución "${i.nombre}"?`)) return;
        eliminarInstitucion(i).catch((e) =>
            alert(e?.response?.data?.message || e?.message || "No se pudo eliminar la institución.")
        );
    };

    if (!empleado) {
        return (
            <Paper
                variant="outlined"
                sx={{ p: 5, borderRadius: 3, borderColor: 'divider', textAlign: 'center' }}
            >
                <Stack spacing={2} alignItems="center">
                    <Avatar sx={{ width: 72, height: 72, bgcolor: (theme) => theme.palette.primary.main }}>
                        <ReceiptLongIcon sx={{ fontSize: 40 }} />
                    </Avatar>
                    <Box>
                        <Typography variant="h6" fontWeight={700}>Selecciona un empleado</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 520, mx: 'auto' }}>
                            Busque al empleado para registrar las deducciones que reportan las instituciones
                            externas cada mes (préstamos, pensión alimenticia, planes telefónicos, casas comerciales, etc.).
                        </Typography>
                    </Box>
                    <Button
                        variant="contained"
                        startIcon={<PersonSearchIcon />}
                        onClick={() => setOpenBusqueda(true)}
                    >
                        Buscar Empleado
                    </Button>
                </Stack>
            </Paper>
        );
    }

    return (
        <Box>
            <EncabezadoEmpleado
                empleado={empleado}
                onCambiar={() => setOpenBusqueda(true)}
                onQuitar={quitarEmpleado}
            />

            <Grid container spacing={3}>
                {/* Columna principal — lista de deducciones */}
                <Grid size={{ xs: 12, lg: 8 }}>
                    <Stack spacing={3}>
                        {/* Registro rápido */}
                        <Paper variant="outlined" sx={{ borderRadius: 3, borderColor: 'divider' }}>
                            <Box sx={{ px: 2.5, pt: 2, display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                <ReceiptLongIcon fontSize="small" color="success" />
                                <Typography variant="subtitle1" fontWeight={700}>
                                    {editando ? 'Editar deducción' : 'Registrar deducción'}
                                </Typography>
                            </Box>
                            <Divider sx={{ mx: 2.5, mb: 2 }} />
                            <Box sx={{ px: 2.5, pb: 2.5 }}>
                                {loadingCatalogos ? (
                                    <Stack spacing={1}>
                                        <Skeleton variant="rounded" height={36} />
                                        <Skeleton variant="rounded" height={36} />
                                    </Stack>
                                ) : (
                                    <FormularioDeduccion
                                        key={editando?.id || 'nuevo'}
                                        tipos={tipos}
                                        instituciones={instituciones}
                                        valorInicial={editando}
                                        alEnviar={guardarDeduccion}
                                        alCancelar={cancelarEdicion}
                                    />
                                )}
                            </Box>
                        </Paper>

                        {/* Tabla de deducciones */}
                        <ListaDeducciones
                            deducciones={deducciones}
                            loading={loading}
                            error={error}
                            onEditar={editarDeduccion}
                            onEliminar={confirmarEliminarDeduccion}
                        />
                    </Stack>
                </Grid>

                {/* Columna lateral — catálogo de instituciones */}
                <Grid size={{ xs: 12, lg: 4 }}>
                    <Paper variant="outlined" sx={{ borderRadius: 3, borderColor: 'divider' }}>
                        <Box sx={{ px: 2.5, pt: 2, display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <AccountBalanceIcon fontSize="small" color="primary" />
                            <Typography variant="subtitle1" fontWeight={700}>
                                Instituciones emisoras
                            </Typography>
                            <Chip
                                size="small"
                                label={`${instituciones.length}`}
                                color="primary"
                                variant="outlined"
                                sx={{ ml: 'auto' }}
                            />
                        </Box>
                        <Divider sx={{ mx: 2.5, mb: 2 }} />
                        <Box sx={{ px: 2.5, pb: 2.5 }}>
                            {loadingCatalogos ? (
                                <Stack spacing={1}>
                                    <Skeleton variant="rounded" height={36} />
                                    <Skeleton variant="rounded" height={36} />
                                </Stack>
                            ) : (
                                <Stack spacing={2.5}>
                                    <FormularioInstitucion
                                        key={editandoInst?.idInstitucionExterna || 'nuevo'}
                                        valorInicial={editandoInst}
                                        onGuardar={guardarInstitucion}
                                        onCancelar={limpiarInstitucion}
                                    />
                                    <Divider />
                                    <ListaInstituciones
                                        instituciones={instituciones}
                                        onEditar={editarInstitucion}
                                        onEliminar={confirmarEliminarInstitucion}
                                    />
                                </Stack>
                            )}
                        </Box>
                    </Paper>
                </Grid>
            </Grid>

            <BusquedaPropietario
                open={openBusqueda}
                onClose={() => setOpenBusqueda(false)}
                onSeleccionar={seleccionarEmpleado}
                OriginRegistro
            />
        </Box>
    );
}