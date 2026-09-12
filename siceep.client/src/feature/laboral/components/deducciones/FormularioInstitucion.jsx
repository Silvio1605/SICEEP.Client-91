import React, { useState } from 'react';
import { Box, Stack, TextField, Button, Alert, CircularProgress } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CancelIcon from '@mui/icons-material/Cancel';

export default function FormularioInstitucion({ valorInicial, onGuardar, onCancelar }) {
    const [nombre, setNombre] = useState(valorInicial?.nombre || '');
    const [descripcion, setDescripcion] = useState(valorInicial?.descripcion || '');
    const [guardando, setGuardando] = useState(false);
    const [error, setError] = useState(null);

    const limpiar = () => {
        setNombre('');
        setDescripcion('');
        setError(null);
    };

    const guardar = async () => {
        if (!nombre.trim()) {
            setError("Indique el nombre de la institución.");
            return;
        }
        setError(null);
        setGuardando(true);
        try {
            await onGuardar({
                id: valorInicial?.idInstitucionExterna || 0,
                nombre: nombre.trim(),
                descripcion: descripcion.trim()
            });
            limpiar();
        } catch (e) {
            setError(e?.response?.data?.message || e?.message || "No se pudo guardar la institución.");
        } finally {
            setGuardando(false);
        }
    };

    return (
        <Box>
            {error && (
                <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>
            )}
            <Stack spacing={1.5}>
                <TextField
                    fullWidth
                    size="small"
                    label="Nombre"
                    placeholder="Ej: TIGO, Banco, Casa comercial..."
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                />
                <TextField
                    fullWidth
                    size="small"
                    label="Descripción (opcional)"
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                />
                <Stack direction="row" spacing={1}>
                    {valorInicial && (
                        <Button size="small" color="inherit" startIcon={<CancelIcon />} onClick={onCancelar}>
                            Cancelar
                        </Button>
                    )}
                    <Button
                        variant="contained"
                        color={valorInicial ? 'warning' : 'primary'}
                        fullWidth
                        startIcon={<AddCircleOutlineIcon />}
                        onClick={guardar}
                        disabled={guardando}
                    >
                        {guardando ? <CircularProgress size={18} color="inherit" /> : (valorInicial ? 'Guardar Institución' : 'Registrar Institución')}
                    </Button>
                </Stack>
            </Stack>
        </Box>
    );
}