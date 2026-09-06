import React, { useState } from 'react';
import {
    Box, Typography, Dialog, DialogTitle, DialogContent,
    DialogActions, Button, Avatar, Divider, Grid, FormHelperText
} from '@mui/material';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import { useNotificacionContext } from './../../../providers/Notificacion/useNotificacionContext';
import { reactivarEmpleado } from './../services/bajaService';
import { getPlazas } from './../../laboral/services/laboralServices';
import { registrarBitacora } from './../../bitacora/service/bitacoraService';
import FormContratoPlaza from './FormContratoPlaza';

export default function ModalReactivar({ open, onClose, empleado, onConfirmada }) {

    const { mostrarNotificacion } = useNotificacionContext();

    const [contrato, setContrato] = useState({
        numInss: '',
        tipoContrato: 'P',
        fechaInicio: new Date().toISOString().slice(0, 10),
        fechaCese: '',
        salarioMensual: 0,
        ordinal: null,
        plaza: null,
    });
    const [opcionesPlaza, setOpcionesPlaza] = useState([]);
    const [buscandoPlazas, setBuscandoPlazas] = useState(false);
    const [errorPlazas, setErrorPlazas] = useState('');
    const [guardando, setGuardando] = useState(false);

    const actualizarCampo = (campo, valor) => setContrato((prev) => ({ ...prev, [campo]: valor }));

    const buscarOpcionesPlaza = async (termino) => {
        if (!termino || termino.trim().length < 2) {
            setOpcionesPlaza([]);
            setErrorPlazas('');
            return;
        }
        setBuscandoPlazas(true);
        setErrorPlazas('');
        try {
            const res = await getPlazas({ texto: termino.trim(), soloDisponibles: true, page: 1, pageSize: 10 });
            setOpcionesPlaza(res?.data?.data || []);
        } catch (error) {
            setOpcionesPlaza([]);
            setErrorPlazas(error.response?.data?.message || 'Error al buscar plazas disponibles.');
        } finally {
            setBuscandoPlazas(false);
        }
    };

    const handleCerrar = () => {
        if (guardando) return;
        onClose();
    };

    const plazaValida = !!(contrato.ordinal && contrato.plaza);
    const bocetoValido = plazaValida && contrato.fechaInicio && Number(contrato.salarioMensual) > 0;

    const handleReactivar = async () => {
        if (!bocetoValido || !empleado) return;

        setGuardando(true);

        try {
            const resultado = await reactivarEmpleado({
                idEmpleado: empleado.id,
                ordinalPlaza: contrato.ordinal,
                fechaInicio: contrato.fechaInicio,
                tipoContrato: contrato.tipoContrato,
                numInss: contrato.numInss || null,
                salarioMensual: Number(contrato.salarioMensual),
            });

            mostrarNotificacion({
                message: resultado.status === 200 ? "Empleado reactivado correctamente." : resultado.data?.message || resultado.message,
                severity: resultado.status === 200 ? "success" : "error",
            });

            if (resultado.status === 200) {
                await registrarBitacora(7, `Reactivación de ${empleado.nombreCompleto ?? 'empleado'} en la plaza ${contrato.ordinal}`);
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
        <Dialog open={open} onClose={handleCerrar} maxWidth="md" fullWidth>
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'success.main', fontWeight: 'bold' }}>
                <HowToRegIcon /> Reactivación de Funcionario
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

                        <FormContratoPlaza
                            value={contrato}
                            onChange={actualizarCampo}
                            plazas={opcionesPlaza}
                            loading={buscandoPlazas}
                            error={errorPlazas}
                            buscarPlazas={buscarOpcionesPlaza}
                            freeSolo={false}
                        />

                        <FormHelperText>
                            La reactivación anexa un nuevo contrato y recorrido, y reabre el expediente del funcionario.
                        </FormHelperText>
                    </>
                )}
            </DialogContent>

            <DialogActions sx={{ p: 2 }}>
                <Button onClick={handleCerrar} color="inherit" disabled={guardando}>
                    Cancelar
                </Button>
                <Button
                    onClick={handleReactivar}
                    variant="contained"
                    color="success"
                    disabled={!bocetoValido || guardando}
                >
                    Reactivar Funcionario
                </Button>
            </DialogActions>
        </Dialog>
    );
}