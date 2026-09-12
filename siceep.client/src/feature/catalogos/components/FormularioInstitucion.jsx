import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import LinearProgress from '@mui/material/LinearProgress';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import SchoolIcon from '@mui/icons-material/School';
import { useNotificacionContext } from '../../../providers/Notificacion/useNotificacionContext';
import AppInput from '../../../shared/components/AppInput';
import { listarPaises, listarTiposInstitucion, agregarInstitucion, actualizarInstitucion } from '../services/institucionesService';

const vacio = {
    idInstitucion: 0,
    nombre: "",
    siglas: "",
    idTipoInstitucion: "",
    idPais: "",
    departamento: "",
    municipio: "",
};

export default function FormularioInstitucion({ open, onClose, institucion, onCambios }) {
    const { mostrarNotificacion } = useNotificacionContext();
    const [guardando, setGuardando] = useState(false);
    const [paises, setPaises] = useState([]);
    const [tipos, setTipos] = useState([]);
    const [form, setForm] = useState(vacio);

    useEffect(() => {
        if (!open) return;

        if (institucion) {
            setForm({
                idInstitucion: institucion.idInstitucion,
                nombre: institucion.nombre ?? "",
                siglas: institucion.siglas ?? "",
                idTipoInstitucion: institucion.idTipoInstitucion ?? "",
                idPais: institucion.idPais ?? "",
                departamento: institucion.departamento ?? "",
                municipio: institucion.municipio ?? "",
            });
        } else {
            setForm(vacio);
        }

        listarPaises()
            .then(setPaises)
            .catch(() => setPaises([]));
        listarTiposInstitucion()
            .then(setTipos)
            .catch(() => setTipos([]));
    }, [open, institucion]);

    const cambiar = (campo, valor) => setForm((prev) => ({ ...prev, [campo]: valor }));

    const handleGuardar = async () => {
        if (form.nombre.trim() === "" || !form.idTipoInstitucion || Number(form.idTipoInstitucion) <= 0) {
            mostrarNotificacion({
                message: "Complete los campos obligatorios (Nombre y Tipo de institución)",
                severity: "warning",
            });
            return;
        }

        setGuardando(true);
        try {
            const payload = {
                ...form,
                nombre: form.nombre.trim(),
                siglas: form.siglas.trim() || null,
                idTipoInstitucion: Number(form.idTipoInstitucion),
                idPais: form.idPais === "" ? null : form.idPais,
                departamento: form.departamento.trim() || null,
                municipio: form.municipio.trim() || null,
            };

            if (form.idInstitucion > 0) {
                await actualizarInstitucion(form.idInstitucion, payload);
                mostrarNotificacion({ message: "Institución actualizada correctamente", severity: "success" });
            } else {
                await agregarInstitucion(payload);
                mostrarNotificacion({ message: "Institución agregada correctamente", severity: "success" });
            }

            onCambios?.();
            onClose();
        } catch (error) {
            mostrarNotificacion({
                message: typeof error === "string" ? error : "Error al guardar la institución",
                severity: "error",
            });
        } finally {
            setGuardando(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" disableAutoFocus>
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, borderBottom: 1, borderColor: 'divider' }}>
                <SchoolIcon color="primary" />
                {form.idInstitucion > 0 ? "Editar Institución Académica" : "Agregar Institución Académica"}
            </DialogTitle>

            <DialogContent sx={{ pt: 2 }}>
                <Grid container spacing={2} sx={{ mt: 0 }}>
                    <Grid size={{xs:12, sm:8 }}>
                        <AppInput
                            id="nombre"
                            label="Nombre *"
                            value={form.nombre}
                            inputProps={{ maxLength: 200 }}
                            onChange={(e) => cambiar("nombre", e.target.value)}
                        />
                    </Grid>
                    <Grid size={{xs:12, sm:4}}>
                        <AppInput
                            id="siglas"
                            label="Siglas"
                            value={form.siglas}
                            inputProps={{ maxLength: 50 }}
                            onChange={(e) => cambiar("siglas", e.target.value)}
                        />
                    </Grid>
                    <Grid size={{xs:12, sm:6}}>
                        <TextField
                            select
                            fullWidth
                            size="small"
                            id="idTipoInstitucion"
                            label="Tipo de institución *"
                            value={form.idTipoInstitucion === "" || form.idTipoInstitucion == null ? "" : String(form.idTipoInstitucion)}
                            onChange={(e) => cambiar("idTipoInstitucion", e.target.value)}
                            displayEmpty
                            sx={{ mt: 1, '& .MuiOutlinedInput-root': { borderRadius: 2, backgroundColor: 'grey.50' } }}
                        >
                            <MenuItem value="">
                                <em>Seleccione un tipo</em>
                            </MenuItem>
                            {tipos.map((tipo) => (
                                <MenuItem key={tipo.idTipoInstitucion} value={String(tipo.idTipoInstitucion)}>
                                    {tipo.nombre}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid size={{xs:12, sm:6}}>
                        <TextField
                            select
                            fullWidth
                            size="small"
                            id="idPais"
                            label="País"
                            value={form.idPais === "" || form.idPais == null ? "" : String(form.idPais)}
                            onChange={(e) => cambiar("idPais", e.target.value)}
                            displayEmpty
                            sx={{ mt: 1, '& .MuiOutlinedInput-root': { borderRadius: 2, backgroundColor: 'grey.50' } }}
                        >
                            <MenuItem value="">
                                <em>Sin país</em>
                            </MenuItem>
                            {paises.map((pais) => (
                                <MenuItem key={pais.idPais} value={String(pais.idPais)}>
                                    {pais.nombre}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid size={{xs:12, sm:6}}>
                        <AppInput
                            id="departamento"
                            label="Departamento"
                            value={form.departamento}
                            inputProps={{ maxLength: 100 }}
                            onChange={(e) => cambiar("departamento", e.target.value)}
                        />
                    </Grid>
                    <Grid size={{xs:12, sm:6}}>
                        <AppInput
                            id="municipio"
                            label="Municipio"
                            value={form.municipio}
                            inputProps={{ maxLength: 100 }}
                            onChange={(e) => cambiar("municipio", e.target.value)}
                        />
                    </Grid>
                </Grid>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
                <Button onClick={onClose}>
                    Cancelar
                </Button>
                <Button variant="contained" onClick={handleGuardar} disabled={guardando}>
                    {guardando ? "Guardando..." : "Guardar"}
                </Button>
            </DialogActions>

            {guardando && (
                <Box sx={{ width: '100%' }}>
                    <LinearProgress />
                </Box>
            )}
        </Dialog>
    );
}