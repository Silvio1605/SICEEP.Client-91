import React, { useState } from 'react';
import {
    Box, Typography, Paper, Stack, Avatar, Button, Chip, Skeleton, Alert, TextField,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Autocomplete,
    CircularProgress, Divider
} from '@mui/material';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import RefreshIcon from '@mui/icons-material/Refresh';
import ClearIcon from '@mui/icons-material/Clear';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import BadgeIcon from '@mui/icons-material/Badge';
import DirectionsIcon from '@mui/icons-material/Directions';
import HistoryIcon from '@mui/icons-material/History';
//
import BusquedaPropietario from './../../usuarios/components/BusquedaPropietario';
import { useSituacion } from './../hooks/useSituacion';
import { useCargos } from './../hooks/useCargos';
import { getPlazas } from './../services/laboralServices';
import SelectUbicacion from './SelectUbicacion';

const formatoSalario = (salario) =>
    new Intl.NumberFormat('es-NI', { style: 'currency', currency: 'NIO', maximumFractionDigits: 2 }).format(salario || 0);

const formatoFecha = (fecha) => {
    if (!fecha) return '—';
    return new Date(`${fecha}T00:00:00`).toLocaleString('es-NI', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const getIniciales = (nombre) => {
    if (!nombre) return '?';
    const partes = nombre.trim().split(/\s+/).filter(Boolean);
    if (partes.length === 1) return partes[0][0].toUpperCase();
    return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
};

export default function TabMovimientos() {

    const { situacion, historial, loading, error, cargarSituacion, cargarHistorial, moverEmpleado } = useSituacion();
    const { cargos } = useCargos();

    const [openBusqueda, setOpenBusqueda] = useState(false);
    const [empleado, setEmpleado] = useState(null);

    // formulario de traslado
    const hoyIso = new Date().toISOString().slice(0, 10);
    const [fechaInicio, setFechaInicio] = useState(hoyIso);
    const [ubicacion, setUbicacion] = useState(null);
    const [plazaNueva, setPlazaNueva] = useState(null);
    const [cargoNuevo, setCargoNuevo] = useState(null);
    const [opcionesPlaza, setOpcionesPlaza] = useState([]);
    const [buscandoPlazas, setBuscandoPlazas] = useState(false);
    const [guardando, setGuardando] = useState(false);
    const [errorGuardar, setErrorGuardar] = useState(null);

    const seleccionarEmpleado = (propietario) => {
        setEmpleado({ id: propietario.id, nombreCompleto: propietario.nombreCompleto });
        cargarSituacion(propietario.id);
        cargarHistorial(propietario.id);
    };

    const quitarSeleccion = () => {
        setEmpleado(null);
    };

    const buscarOpcionesPlaza = async (termino) => {
        if (!termino || termino.trim().length < 2) {
            setOpcionesPlaza([]);
            return;
        }
        setBuscandoPlazas(true);
        try {
            const res = await getPlazas({ texto: termino.trim(), soloDisponibles: true, page: 1, pageSize: 10 });
            setOpcionesPlaza(res?.data?.data || []);
        } catch {
            setOpcionesPlaza([]);
        } finally {
            setBuscandoPlazas(false);
        }
    };

    const guardarTraslado = async () => {
        if (!ubicacion) {
            setErrorGuardar("Seleccione la sede de destino.");
            return;
        }
        if (!fechaInicio) {
            setErrorGuardar("Indique la fecha de inicio del traslado.");
            return;
        }

        setErrorGuardar(null);
        setGuardando(true);
        try {
            const res = await moverEmpleado({
                idEmpleado: empleado.id,
                idUbicacion: ubicacion.id,
                ordinalPlazaNueva: plazaNueva?.ordinal || null,
                idCargo: cargoNuevo?.id || null,
                fechaInicio: fechaInicio
            });
            if (res?.message) {
                alert(res.message);
            }
            // refrescar la situación
            cargarSituacion(empleado.id);
            cargarHistorial(empleado.id);
            setUbicacion(null);
            setPlazaNueva(null);
            setCargoNuevo(null);
            setFechaInicio(hoyIso);
        } catch (e) {
            setErrorGuardar(e?.response?.data?.message || e?.message || "No se pudo registrar el movimiento.");
        } finally {
            setGuardando(false);
        }
    };

    return (
        <Box>
            {
                !empleado ? (
                    <Paper
                        variant="outlined"
                        sx={{ p: 5, borderRadius: 3, borderColor: 'divider', textAlign: 'center' }}
                    >
                        <Stack spacing={2} alignItems="center">
                            <Avatar sx={{ width: 72, height: 72, bgcolor: (theme) => theme.palette.primary.main }}>
                                <PersonSearchIcon sx={{ fontSize: 40 }} />
                            </Avatar>
                            <Box>
                                <Typography variant="h6" fontWeight={700}>Selecciona un empleado</Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 460, mx: 'auto' }}>
                                    Busque al empleado para consultar su situación laboral y registrar un traslado
                                    entre sedes.
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
                ) : (
                    <>
                        {/* Cabecera del empleado */}
                        <Paper
                            variant="outlined"
                            sx={{ p: 2, mb: 2, borderRadius: 3, borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}
                        >
                            <Avatar sx={{ width: 48, height: 48, bgcolor: '#1565C0', fontWeight: 700 }}>
                                {getIniciales(empleado.nombreCompleto)}
                            </Avatar>
                            <Box sx={{ flex: 1, minWidth: 200 }}>
                                <Typography variant="caption" color="text.secondary">Empleado seleccionado</Typography>
                                <Typography variant="body1" fontWeight={700}>{empleado.nombreCompleto}</Typography>
                                {situacion && (
                                    <Typography variant="caption" color="text.secondary">
                                        Código {situacion.codigo}{situacion.cedula ? ` · Cédula ${situacion.cedula}` : ''}
                                    </Typography>
                                )}
                            </Box>
                            <Stack direction="row" spacing={1}>
                                <Button size="small" startIcon={<RefreshIcon />} onClick={() => setOpenBusqueda(true)}>Cambiar</Button>
                                <Button size="small" color="error" startIcon={<ClearIcon />} onClick={quitarSeleccion}>Quitar</Button>
                            </Stack>
                        </Paper>

                        {loading ? (
                            <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, borderColor: 'divider' }}>
                                <Stack spacing={1}>
                                    <Skeleton variant="rounded" height={48} />
                                    <Skeleton variant="rounded" height={48} />
                                    <Skeleton variant="rounded" height={48} />
                                </Stack>
                            </Paper>
                        ) : error ? (
                            <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>
                        ) : (
                            <Stack spacing={2}>
                                {/* Situación actual */}
                                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                                    <Paper variant="outlined" sx={{ p: 2, flex: 1, borderRadius: 3, borderColor: 'divider' }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                                            <DirectionsIcon fontSize="small" color="primary" />
                                            <Typography variant="subtitle1" fontWeight={700}>Recorrido vigente</Typography>
                                        </Box>
                                        {situacion?.recorridoActivo ? (
                                            <Stack spacing={0.5}>
                                                <Typography variant="body1" fontWeight={600}>
                                                    {situacion.recorridoActivo.cargo}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {situacion.recorridoActivo.estructura} - {situacion.recorridoActivo.unidad}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    Desde {formatoFecha(situacion.recorridoActivo.fechaInicio)}
                                                </Typography>
                                            </Stack>
                                        ) : (
                                            <Typography variant="body2" color="text.secondary">
                                                El empleado no tiene un recorrido vigente.
                                            </Typography>
                                        )}
                                    </Paper>

                                    <Paper variant="outlined" sx={{ p: 2, flex: 1, borderRadius: 3, borderColor: 'divider' }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                                            <BadgeIcon fontSize="small" color="primary" />
                                            <Typography variant="subtitle1" fontWeight={700}>Contrato activo</Typography>
                                        </Box>
                                        {situacion?.contratoActivo ? (
                                            <Stack spacing={0.5}>
                                                <Typography variant="body1" fontWeight={600}>
                                                    Plaza {situacion.contratoActivo.ordinal}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Salario {formatoSalario(situacion.contratoActivo.salarioMensual)}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    Desde {formatoFecha(situacion.contratoActivo.fechaInicio)}
                                                </Typography>
                                            </Stack>
                                        ) : (
                                            <Typography variant="body2" color="text.secondary">
                                                El empleado no tiene contrato activo.
                                            </Typography>
                                        )}
                                    </Paper>
                                </Stack>

                                {/* Formulario de traslado */}
                                <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3, borderColor: 'divider' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                        <SwapHorizIcon fontSize="small" color="success" />
                                        <Typography variant="subtitle1" fontWeight={700}>Registrar traslado</Typography>
                                    </Box>

                                    {errorGuardar && (
                                        <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{errorGuardar}</Alert>
                                    )}

                                    <Stack spacing={2.5}>
                                        <SelectUbicacion
                                            value={ubicacion}
                                            onChange={setUbicacion}
                                            label="Sede de destino"
                                            ayuda="El traslado cierra el recorrido actual y abre uno nuevo en esta sede."
                                        />

                                        <Autocomplete
                                            value={plazaNueva}
                                            options={opcionesPlaza}
                                            loading={buscandoPlazas}
                                            getOptionLabel={(opcion) =>
                                                opcion?.ordinal
                                                    ? `${opcion.ordinal} · ${opcion.cargo} · ${opcion.estructura} - ${opcion.unidad}`
                                                    : ''
                                            }
                                            isOptionEqualToValue={(opcion, valor) => opcion?.idPlaza === valor?.idPlaza}
                                            onChange={(_event, valor) => setPlazaNueva(valor || null)}
                                            onInputChange={(_event, termino) => buscarOpcionesPlaza(termino)}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="Plaza nueva (opcional)"
                                                    placeholder="Escriba el ordinal o cargo de una plaza disponible..."
                                                />
                                            )}
                                        />

                                        <Autocomplete
                                            value={cargoNuevo}
                                            options={cargos}
                                            getOptionLabel={(opcion) => opcion?.nombre || ''}
                                            isOptionEqualToValue={(opcion, valor) => opcion?.id === valor?.id}
                                            onChange={(_event, valor) => setCargoNuevo(valor || null)}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="Cargo nuevo (opcional)"
                                                    placeholder="Si no se indica, se conserva el cargo actual"
                                                />
                                            )}
                                        />

                                        <TextField
                                            label="Fecha de inicio"
                                            type="date"
                                            value={fechaInicio}
                                            onChange={(e) => setFechaInicio(e.target.value)}
                                            fullWidth
                                            required
                                            InputLabelProps={{ shrink: true }}
                                        />

                                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                            <Button
                                                variant="contained"
                                                color="success"
                                                startIcon={<SwapHorizIcon />}
                                                onClick={guardarTraslado}
                                                disabled={guardando}
                                            >
                                                {guardando ? <CircularProgress size={18} color="inherit" /> : "Guardar Traslado"}
                                            </Button>
                                        </Box>
                                    </Stack>
                                </Paper>

                                {/* Historial de recorridos */}
                                <Paper variant="outlined" sx={{ borderRadius: 3, borderColor: 'divider' }}>
                                    <Box sx={{ px: 2.5, pt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <HistoryIcon fontSize="small" color="primary" />
                                        <Typography variant="subtitle1" fontWeight={700}>Historial de recorridos</Typography>
                                        <Chip size="small" color="primary" variant="outlined" label={`${historial.length}`} />
                                    </Box>
                                    {historial.length === 0 ? (
                                        <Box sx={{ p: 3, textAlign: 'center' }}>
                                            <Typography variant="body2" color="text.secondary">
                                                Sin movimientos registrados.
                                            </Typography>
                                        </Box>
                                    ) : (
                                        <TableContainer sx={{ mt: 1 }}>
                                            <Table size="small">
                                                <TableHead sx={{ backgroundColor: '#f8f9fa' }}>
                                                    <TableRow>
                                                        <TableCell sx={{ fontWeight: 'bold' }}>Cargo</TableCell>
                                                        <TableCell sx={{ fontWeight: 'bold' }}>Sede</TableCell>
                                                        <TableCell sx={{ fontWeight: 'bold' }}>Desde</TableCell>
                                                        <TableCell sx={{ fontWeight: 'bold' }}>Hasta</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {historial.map((r) => (
                                                        <TableRow key={r.idRecorrido} hover>
                                                            <TableCell>{r.cargo}</TableCell>
                                                            <TableCell>{r.estructura} - {r.unidad}</TableCell>
                                                            <TableCell>{formatoFecha(r.fechaInicio)}</TableCell>
                                                            <TableCell>
                                                                {r.fechaFin ? (
                                                                    formatoFecha(r.fechaFin)
                                                                ) : (
                                                                    <Chip size="small" color="success" label="Vigente" />
                                                                )}
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    )}
                                </Paper>
                            </Stack>
                        )}
                    </>
                )
            }

            <BusquedaPropietario
                open={openBusqueda}
                onClose={() => setOpenBusqueda(false)}
                onSeleccionar={seleccionarEmpleado}
                OriginRegistro
            />
        </Box>
    );
}