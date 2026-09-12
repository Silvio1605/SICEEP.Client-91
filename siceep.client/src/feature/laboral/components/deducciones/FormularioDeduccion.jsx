import React, { useState } from 'react';
import { Box, Stack, TextField, MenuItem, Button, Alert, CircularProgress } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import InputAdornment from '@mui/material/InputAdornment';
//
import { hoyIso } from './../../utils/deduccionUtils';

export default function FormularioDeduccion({ tipos, instituciones, valorInicial, alEnviar, alCancelar }) {
    const [tipo, setTipo] = useState(valorInicial?.tipo || '');
    const [inst, setInst] = useState(valorInicial?.inst || '');
    const [monto, setMonto] = useState(valorInicial?.monto ?? '');
    const [totalDeuda, setTotalDeuda] = useState(valorInicial?.totalDeuda ?? '');
    const [fecha, setFecha] = useState(valorInicial?.fecha || hoyIso());
    const [guardando, setGuardando] = useState(false);
    const [error, setError] = useState(null);

    const limpiar = () => {
        setTipo('');
        setInst('');
        setMonto('');
        setTotalDeuda('');
        setFecha(hoyIso());
        setError(null);
    };

    const guardar = async () => {
        if (!tipo) {
            setError("Seleccione el tipo de deducción.");
            return;
        }
        const montoNum = Number(monto);
        if (monto === '' || Number.isNaN(montoNum) || montoNum <= 0) {
            setError("Indique el monto del cobro (mayor que 0).");
            return;
        }
        const totalNum = totalDeuda === '' ? null : Number(totalDeuda);
        if (totalNum !== null && (Number.isNaN(totalNum) || totalNum <= 0)) {
            setError("El total de la deuda debe ser mayor que 0.");
            return;
        }

        setError(null);
        setGuardando(true);
        try {
            await alEnviar({
                tipo: Number(tipo),
                inst: inst ? Number(inst) : null,
                monto: montoNum,
                totalDeuda: totalNum,
                fecha
            }, tipos.find((t) => t.idTipoDeduccion === Number(tipo))?.nombre || '');
            limpiar();
        } catch (e) {
            setError(e?.response?.data?.message || e?.message || "No se pudo guardar la deducción.");
        } finally {
            setGuardando(false);
        }
    };

    return (
        <Box>
            {error && (
                <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>
            )}
            <Stack spacing={2}>
                <TextField
                    select
                    fullWidth
                    size="small"
                    label="Tipo de deducción"
                    value={tipo}
                    onChange={(e) => setTipo(e.target.value)}
                    displayEmpty
                >
                    <MenuItem value="">
                        <em>Seleccione...</em>
                    </MenuItem>
                    {tipos.map((t) => (
                        <MenuItem key={t.idTipoDeduccion} value={String(t.idTipoDeduccion)}>
                            {t.nombre}
                        </MenuItem>
                    ))}
                </TextField>

                <TextField
                    select
                    fullWidth
                    size="small"
                    label="Institución emisora (opcional)"
                    value={inst}
                    onChange={(e) => setInst(e.target.value)}
                    displayEmpty
                >
                    <MenuItem value="">
                        <em>Sin institución</em>
                    </MenuItem>
                    {instituciones.map((i) => (
                        <MenuItem key={i.idInstitucionExterna} value={String(i.idInstitucionExterna)}>
                            {i.nombre}
                        </MenuItem>
                    ))}
                </TextField>

                <TextField
                    fullWidth
                    size="small"
                    label="Monto del cobro (mensual)"
                    type="number"
                    inputProps={{ min: 0, step: '0.01' }}
                    value={monto}
                    onChange={(e) => setMonto(e.target.value)}
                    InputProps={{ startAdornment: <InputAdornment position="start">C$</InputAdornment> }}
                />

                <TextField
                    fullWidth
                    size="small"
                    label="Total de la deuda (opcional)"
                    type="number"
                    inputProps={{ min: 0, step: '0.01' }}
                    value={totalDeuda}
                    onChange={(e) => setTotalDeuda(e.target.value)}
                    InputProps={{ startAdornment: <InputAdornment position="start">C$</InputAdornment> }}
                />

                <TextField
                    fullWidth
                    size="small"
                    label="Mes del cobro"
                    type="date"
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                />

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                    {valorInicial && (
                        <Button size="small" color="inherit" startIcon={<CancelIcon />} onClick={() => { limpiar(); alCancelar(); }}>
                            Cancelar
                        </Button>
                    )}
                    <Button
                        variant="contained"
                        startIcon={<SaveIcon />}
                        onClick={guardar}
                        disabled={guardando}
                    >
                        {guardando ? <CircularProgress size={18} color="inherit" /> : (valorInicial ? "Guardar Cambios" : "Registrar Deducción")}
                    </Button>
                </Box>
            </Stack>
        </Box>
    );
}