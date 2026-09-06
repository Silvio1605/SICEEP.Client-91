import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Paper, TextField, MenuItem, Dialog, DialogTitle, DialogContent,
    DialogActions, Button, Avatar, Divider, Grid, LinearProgress, FormHelperText
} from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { useNotificacionContext } from './../../../providers/Notificacion/useNotificacionContext';
import { getTiposBaja, aplicarBaja } from './../services/bajaService';
import { registrarBitacora } from './../../bitacora/service/bitacoraService';

export default function ModalBaja({ open, onClose, empleado, onConfirmada }) {

    // Notificaciones
    const { mostrarNotificacion } = useNotificacionContext();

    const [tiposBaja, setTiposBaja] = useState([]);
    const [cargandoTipos, setCargandoTipos] = useState(false);
    const [idTipoBaja, setIdTipoBaja] = useState('');
    const [fechaBaja, setFechaBaja] = useState(() => new Date().toISOString().slice(0, 10));
    const [observacion, setObservacion] = useState('');
    const [guardando, setGuardando] = useState(false);

    // Cargar los motivos de baja al abrir el modal
    useEffect(() => {
        if (!open) return;

        let isMounted = true;

        const cargar = async () => {
            setCargandoTipos(true);
            try {
                const res = await getTiposBaja();
                if (!isMounted) return;
                setTiposBaja(res.data || []);
            } catch {
                if (isMounted) {
                    mostrarNotificacion({
                        message: "No se pudieron cargar los motivos de baja.",
                        severity: "error",
                    });
                }
            } finally {
                if (isMounted) setCargandoTipos(false);
            }
        };

        cargar();

        return () => {
            isMounted = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    const handleCerrar = () => {
        if (guardando) return;
        onClose();
    };

    const handleAplicar = async () => {
        if (!idTipoBaja || !empleado) return;

        setGuardando(true);

        try {
            const resultado = await aplicarBaja({
                idEmpleado: empleado.id,
                idTipoBaja: idTipoBaja,
                fechaBaja: fechaBaja,
                observacion: observacion,
            });

            mostrarNotificacion({
                message: resultado.status === 200 ? "Baja aplicada correctamente." : resultado.data?.message || resultado.message,
                severity: resultado.status === 200 ? "success" : "error",
            });

            if (resultado.status === 200) {
                await registrarBitacora(6, `Baja aplicada a ${empleado.nombreCompleto ?? 'empleado'}`);
                onConfirmada?.();
                onClose();
            }

        } catch (error) {
            const data = error.response?.data;
            if (data?.errors) {
                const primerError = Object.values(data.errors)[0][0];
                mostrarNotificacion({ message: primerError, severity: "error" });
            } else if (error.response) {
                mostrarNotificacion({ message: error.response.data?.message || error.response.data, severity: "error" });
            } else if (error.request) {
                mostrarNotificacion({ message: "No se pudo conectar con el servidor.", severity: "error" });
            } else {
                mostrarNotificacion({ message: error.message, severity: "error" });
            }
        } finally {
            setGuardando(false);
        }
    };

    const iniciales = (nombre) =>
        (nombre || '')
            .split(' ')
            .filter((p) => p.length > 0)
            .slice(0, 2)
            .map((p) => p[0].toUpperCase())
            .join('');

    return (
        <Dialog open={open} onClose={handleCerrar} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'error.main', fontWeight: 'bold' }}>
                <WarningAmberIcon /> Procesar Baja de Funcionario
            </DialogTitle>

            <DialogContent dividers>
                {empleado && (
                    <>
                        <Grid container spacing={3} alignItems="center" sx={{ mb: 2 }}>
                            <Grid item>
                                <Avatar
                                    sx={{ width: 88, height: 88, bgcolor: 'grey.300', color: 'grey.700', fontSize: '1.6rem', fontWeight: 'bold' }}
                                    variant="rounded"
                                >
                                    {iniciales(empleado.nombreCompleto)}
                                </Avatar>
                            </Grid>
                            <Grid item xs>
                                <Typography variant="subtitle2" color="text.secondary">Nombre Completo</Typography>
                                <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
                                    {empleado.nombreCompleto || 'S/D'}
                                </Typography>

                                <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">No. Expediente</Typography>
                                        <Typography variant="body1" fontWeight="medium">{empleado.codigo || 'S/D'}</Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">Estructura / Ubicación</Typography>
                                        <Typography variant="body1" fontWeight="medium">{empleado.estructura || 'S/D'}</Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">Cargo</Typography>
                                        <Typography variant="body1" fontWeight="medium">{empleado.cargo || 'S/D'}</Typography>
                                    </Box>
                                </Box>
                            </Grid>
                        </Grid>

                        <Divider sx={{ mb: 2 }} />

                        <TextField
                            select
                            fullWidth
                            label="Motivo de Baja"
                            value={idTipoBaja}
                            onChange={(e) => setIdTipoBaja(e.target.value)}
                            sx={{ mb: 1 }}
                            disabled={cargandoTipos}
                        >
                            {cargandoTipos ? (
                                <MenuItem disabled value="">Cargando motivos...</MenuItem>
                            ) : (
                                tiposBaja.map((tipo) => (
                                    <MenuItem key={tipo.id} value={tipo.id}>
                                        {tipo.nombre}
                                    </MenuItem>
                                ))
                            )}
                        </TextField>
                        {cargandoTipos && <LinearProgress sx={{ mb: 1 }} />}

                        <TextField
                            fullWidth
                            type="date"
                            label="Fecha de Baja"
                            value={fechaBaja}
                            onChange={(e) => setFechaBaja(e.target.value)}
                            sx={{ mb: 1 }}
                            InputLabelProps={{ shrink: true }}
                        />

                        <TextField
                            fullWidth
                            multiline
                            rows={4}
                            label="Observaciones"
                            placeholder="Detalle los motivos adicionales o entregas pendientes..."
                            value={observacion}
                            onChange={(e) => setObservacion(e.target.value)}
                            inputProps={{ maxLength: 500 }}
                        />
                        <FormHelperText>
                            {observacion.length}/500 caracteres
                        </FormHelperText>
                    </>
                )}
            </DialogContent>

            <DialogActions sx={{ p: 2 }}>
                <Button onClick={handleCerrar} color="inherit" disabled={guardando}>
                    Cancelar
                </Button>
                <Button
                    onClick={handleAplicar}
                    variant="contained"
                    color="error"
                    disabled={!idTipoBaja || guardando}
                >
                    Aplicar Baja
                </Button>
            </DialogActions>
        </Dialog>
    );
}