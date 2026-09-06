import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Autocomplete from '@mui/material/Autocomplete';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import CloseIcon from '@mui/icons-material/Close';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
// internos
import { useCargos } from './../hooks/useCargos';
import SelectUbicacion from './SelectUbicacion';
import { registrarBitacora } from './../../bitacora/service/bitacoraService';

function ContenidoModal({ onClose, onGuardado }) {

    const { cargos, loading: cargandoCargos } = useCargos();

    const [cargo, setCargo] = useState(null);
    const [ubicacion, setUbicacion] = useState(null);
    const [salario, setSalario] = useState('');
    const [observaciones, setObservaciones] = useState('');
    const [guardando, setGuardando] = useState(false);
    const [error, setError] = useState(null);

    const validar = () => {
        if (!cargo) return 'Seleccione el cargo de la plaza.';
        if (!ubicacion) return 'Seleccione la ubicación de la plaza.';
        if (salario === '' || Number(salario) < 0) return 'Indique un salario base válido.';
        return null;
    };

    const guardar = async () => {
        const mensaje = validar();
        if (mensaje) {
            setError(mensaje);
            return;
        }

        setError(null);
        setGuardando(true);
        try {
            const res = await onGuardado({
                idCargo: cargo.id,
                idUbicacion: ubicacion.id,
                salarioBaseOficial: Number(salario),
                observaciones: observaciones.trim() || null
            });
            if (res?.message) {
                alert(res.message);
            }
            await registrarBitacora(2, `Plaza registrada: ${cargo?.nombre ?? ''} - ${ubicacion?.nombre ?? ''}`);
            onClose();
        } catch (e) {
            setError(e?.response?.data?.message || e?.message || "No se pudo registrar la plaza.");
        } finally {
            setGuardando(false);
        }
    };

    return (
        <React.Fragment>
            <DialogTitle>
                <Typography variant="h6" fontWeight={700}>Nueva Plaza</Typography>
                <Typography variant="body2" color="text.secondary">
                    La plaza se registrará como vacante y podrá asignarse más tarde.
                </Typography>
            </DialogTitle>

            <DialogContent>
                {error && (
                    <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                        {error}
                    </Alert>
                )}

                <Stack spacing={2.5} sx={{ mt: 1 }}>
                    <Autocomplete
                        value={cargo}
                        options={cargos}
                        loading={cargandoCargos}
                        getOptionLabel={(opcion) => opcion?.nombre || ''}
                        isOptionEqualToValue={(opcion, valor) => opcion?.id === valor?.id}
                        onChange={(_event, valor) => setCargo(valor || null)}
                        renderInput={(params) => (
                            <TextField {...params} label="Cargo" required placeholder="Seleccione el cargo..." />
                        )}
                    />

                    <SelectUbicacion
                        value={ubicacion}
                        onChange={setUbicacion}
                        label="Ubicación (sede)"
                        ayuda="Aquí se desempeñará la plaza."
                    />

                    <TextField
                        label="Salario base oficial"
                        type="number"
                        inputProps={{ min: 0, step: '0.01' }}
                        value={salario}
                        onChange={(e) => setSalario(e.target.value)}
                        fullWidth
                        required
                    />

                    <TextField
                        label="Observaciones"
                        multiline
                        minRows={2}
                        value={observaciones}
                        onChange={(e) => setObservaciones(e.target.value)}
                        fullWidth
                    />
                </Stack>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button onClick={onClose} color="inherit">
                    Cancelar
                </Button>
                <Button
                    variant="contained"
                    startIcon={<WorkOutlineIcon />}
                    onClick={guardar}
                    disabled={guardando}
                >
                    {guardando ? <CircularProgress size={18} color="inherit" /> : "Guardar Plaza"}
                </Button>
            </DialogActions>
        </React.Fragment>
    );
}

export default function ModalPlaza({ open, onClose, onGuardado }) {
    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <IconButton
                aria-label="Cerrar"
                onClick={onClose}
                sx={{ position: 'absolute', right: 8, top: 8 }}
            >
                <CloseIcon />
            </IconButton>
            {open ? (
                <Box>
                    <ContenidoModal onClose={onClose} onGuardado={onGuardado} />
                </Box>
            ) : null}
        </Dialog>
    );
}