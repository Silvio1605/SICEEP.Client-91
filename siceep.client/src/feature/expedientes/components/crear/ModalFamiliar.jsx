import React, { useEffect, useState } from 'react';
import {
    Box, Grid, Typography, TextField, Button, Dialog, DialogTitle, DialogContent,
    DialogActions, MenuItem, FormHelperText, Divider, Chip, Paper
} from '@mui/material';
import { sexoSegunParentesco, ajustarDescendiente } from '../../hooks/Select/useSelectParentesco';

// Campo flexible: acepta props de tamaño de grid
const Campo = ({
    label, value, onChange, type = 'text', required = false,
    select = false, children, disabled, error, helperText,
    xs = 12, sm = 6, md = 4, lg = 3, ...rest
}) => (
    <Grid size={{ xs, sm, md, lg }}>
        <TextField
            fullWidth size="small" type={type} label={label} required={required} select={select}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            error={!!error}
            helperText={helperText}
            InputLabelProps={type === 'date' ? { shrink: true } : undefined}
            {...rest}
        >
            {children}
        </TextField>
    </Grid>
);

export default function ModalFamiliar({
    open,
    onClose,
    catalogo,
    tiposUnion,
    sexoEmpleado,
    familiar = null,
    onConfirmar,
    loading = false
}) {
    const [form, setForm] = useState({
        idParentesco: '',
        pnombre: '',
        snombre: '',
        papellido: '',
        sapellido: '',
        cedula: '',
        sexo: '',
        fechaNacimiento: '',
        tipoUnion: '',
        fechaInicio: '',
        observaciones: ''
    });
    const [errors, setErrors] = useState({});

    const parentescoSel = catalogo.find(p => p.id === Number(form.idParentesco));
    const esConyuge = !!parentescoSel?.esConyuge;

    useEffect(() => {
        if (familiar) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setForm(f => ({ ...f, ...familiar }));
            setErrors({});
        } else {
            setForm({
                idParentesco: '',
                pnombre: '', snombre: '', papellido: '', sapellido: '',
                cedula: '', sexo: '', fechaNacimiento: '',
                tipoUnion: '', fechaInicio: '', observaciones: ''
            });
            setErrors({});
        }
    }, [familiar, open]);

    const handleParentescoChange = (value) => {
        const elegido = catalogo.find(p => p.id === Number(value));
        const sexoImpuesto = sexoSegunParentesco(elegido, sexoEmpleado);
        setForm(f => {
            let next = { ...f, idParentesco: value, sexo: sexoImpuesto || f.sexo };
            if (!elegido?.esConyuge) {
                next = { ...next, tipoUnion: '', observaciones: '', fechaInicio: '' };
            }
            return ajustarDescendiente(next, catalogo);
        });
        setErrors(e => ({ ...e, idParentesco: '' }));
    };

    const handleChange = (campo, value) => {
        setForm(f => {
            let next = { ...f, [campo]: value };
            if (campo === 'sexo') next = ajustarDescendiente(next, catalogo);
            return next;
        });
        setErrors(e => ({ ...e, [campo]: '' }));
    };

    const validar = () => {
        const errs = {};
        if (!form.idParentesco) errs.idParentesco = 'Requerido';
        if (!form.pnombre?.trim()) errs.pnombre = 'Requerido';
        if (!form.papellido?.trim()) errs.papellido = 'Requerido';
        if (!form.sexo) errs.sexo = 'Requerido';
        if (!form.fechaNacimiento) errs.fechaNacimiento = 'Requerido';
        if (esConyuge && !form.tipoUnion) errs.tipoUnion = 'Requerido';
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleConfirmar = () => {
        if (!validar()) return;
        onConfirmar({ ...form, id: familiar?.id || Date.now() });
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="lg"
            fullWidth
            sx={{
                '& .MuiDialogContent-root': { maxHeight: '80vh', overflow: 'auto', pt: 1 },
                '& .MuiDialogTitle-root': { px: 3, py: 2 }
            }}
        >
            <DialogTitle>{familiar ? 'EDITAR FAMILIAR' : 'AGREGAR FAMILIAR'}</DialogTitle>

            <DialogContent>
                {/* SECCIÓN 1: Parentesco (full width para destacar) */}
                <Paper elevation={0} variant="outlined" sx={{ p: 2, mb: 2, borderRadius: 2 }}>
                    <Typography variant="subtitle1" color="primary" sx={{ mb: 1.5, fontWeight: 600 }}>
                        Tipo de parentesco
                    </Typography>
                    <Campo xs={12} sm={12} md={12} label="Tipo de parentesco" select required
                        value={form.idParentesco}
                        onChange={handleParentescoChange}
                        error={!!errors.idParentesco} helperText={errors.idParentesco}
                    >
                        <MenuItem value=""><em>Seleccione…</em></MenuItem>
                        {catalogo.map(p => (
                            <MenuItem key={p.id} value={p.id}>{p.nombre}</MenuItem>
                        ))}
                    </Campo>
                </Paper>

                {/* SECCIÓN 2: Datos personales */}
                <Paper elevation={0} variant="outlined" sx={{ p: 2, mb: 2, borderRadius: 2 }}>
                    <Typography variant="subtitle1" color="primary" sx={{ mb: 1.5, fontWeight: 600 }}>
                        Datos personales
                    </Typography>
                    <Grid container spacing={2}>
                        <Campo xs={12} sm={6} md={3} label="P. Nombre" value={form.pnombre} onChange={v => handleChange('pnombre', v)} error={!!errors.pnombre} helperText={errors.pnombre} required />
                        <Campo xs={12} sm={6} md={3} label="S. Nombre" value={form.snombre} onChange={v => handleChange('snombre', v)} />
                        <Campo xs={12} sm={6} md={3} label="P. Apellido" value={form.papellido} onChange={v => handleChange('papellido', v)} error={!!errors.papellido} helperText={errors.papellido} required />
                        <Campo xs={12} sm={6} md={3} label="S. Apellido" value={form.sapellido} onChange={v => handleChange('sapellido', v)} />

                        <Campo xs={12} sm={6} md={4} label="N° Cédula" value={form.cedula} onChange={v => handleChange('cedula', v)} />

                        <Campo xs={12} sm={6} md={4} label="Sexo" select value={form.sexo} onChange={v => handleChange('sexo', v)} error={!!errors.sexo} helperText={errors.sexo} required>
                            <MenuItem value=""><em>Seleccione…</em></MenuItem>
                            <MenuItem value="M">Masculino</MenuItem>
                            <MenuItem value="F">Femenino</MenuItem>
                        </Campo>

                        <Campo xs={12} sm={6} md={4} label="Fecha de Nacimiento" type="date" value={form.fechaNacimiento} onChange={v => handleChange('fechaNacimiento', v)} error={!!errors.fechaNacimiento} helperText={errors.fechaNacimiento} required />
                    </Grid>
                </Paper>

                {/* SECCIÓN 3: Opciones del cónyuge (condicional) */}
                {esConyuge && (
                    <Paper elevation={0} variant="outlined" sx={{ p: 2, mb: 2, borderRadius: 2, border: '1px solid', borderColor: 'primary.main' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                            <Chip size="small" label="OPCIONES DEL CÓNYUGE" color="primary" variant="outlined" />
                            <Typography variant="body2" color="text.secondary">
                                Complete los datos del vínculo conyugal
                            </Typography>
                        </Box>
                        <Grid container spacing={2}>
                            <Campo xs={12} sm={6} md={6} label="Tipo de Unión" select value={form.tipoUnion} onChange={v => handleChange('tipoUnion', v)} error={!!errors.tipoUnion} helperText={errors.tipoUnion} required>
                                <MenuItem value=""><em>Seleccione…</em></MenuItem>
                                {tiposUnion.map(t => (
                                    <MenuItem key={t.id} value={t.nombre}>{t.nombre}</MenuItem>
                                ))}
                            </Campo>

                            <Campo xs={12} sm={6} md={6} label="Fecha de Inicio" type="date" value={form.fechaInicio} onChange={v => handleChange('fechaInicio', v)} />

                            <Campo xs={12} label="Observaciones" value={form.observaciones} onChange={v => handleChange('observaciones', v)} multiline rows={2} />
                        </Grid>
                    </Paper>
                )}

            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2, pt: 1, borderTop: 1, borderColor: 'divider' }}>
                <Button onClick={onClose} variant="outlined">Cancelar</Button>
                <Box sx={{ flexGrow: 1 }} />
                <Button variant="contained" onClick={handleConfirmar} disabled={loading}>
                    {familiar ? 'GUARDAR CAMBIOS' : 'ACEPTAR'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}