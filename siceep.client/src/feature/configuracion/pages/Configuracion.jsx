import React, { useState, useId } from "react";
import { useNavigate } from "react-router-dom";
import {
    Box, Grid, Paper, Typography, Divider, Alert,
    IconButton, InputAdornment, Stack
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import KeyIcon from "@mui/icons-material/Key";
import AppInput from "./../../../shared/components/AppInput";
import AppButton from "./../../../shared/components/AppButton";
import { useAuth } from "./../../../providers/Authenticacion/useAuth";
import { CambiarMiContrasena } from "../services/configuracionService";

// Mismas reglas que el backend (CambiarMiContrasenaValidator) y que el alta de
// usuarios, para no dejar que el formulario acepte lo que el servidor va a rechazar.
const reglas = [
    { texto: "Al menos 8 caracteres", valida: (v) => v.length >= 8 },
    { texto: "Una letra mayúscula", valida: (v) => /[A-Z]/.test(v) },
    { texto: "Una letra minúscula", valida: (v) => /[a-z]/.test(v) },
    { texto: "Un número", valida: (v) => /[0-9]/.test(v) },
    { texto: "Un carácter especial", valida: (v) => /[^a-zA-Z0-9]/.test(v) },
    { texto: "Sin espacios", valida: (v) => !v.includes(" ") }
];

function Configuracion() {

    const { usuario } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        actual: "",
        nueva: "",
        confirmacion: ""
    });
    const [ver, setVer] = useState({ actual: false, nueva: false, confirmacion: false });
    const [error, setError] = useState("");
    const [exito, setExito] = useState("");
    const [enviando, setEnviando] = useState(false);

    const idActual = useId();
    const idNueva = useId();
    const idConfirmacion = useId();

    const cambiar = (campo) => (e) => {
        setForm({ ...form, [campo]: e.target.value });
        setError("");
        setExito("");
    };

    const alternarVisibilidad = (campo) => () =>
        setVer({ ...ver, [campo]: !ver[campo] });

    const adornos = (campo) => ({
        endAdornment: (
            <InputAdornment position="end">
                <IconButton
                    onClick={alternarVisibilidad(campo)}
                    onMouseDown={(e) => e.preventDefault()}
                    edge="end"
                >
                    {ver[campo] ? <VisibilityOff /> : <Visibility />}
                </IconButton>
            </InputAdornment>
        )
    });

    const cumpleTodas = reglas.every((r) => r.valida(form.nueva));

    const coinciden = form.nueva.length > 0 && form.nueva === form.confirmacion;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setExito("");

        if (!cumpleTodas) {
            setError("La nueva contraseña no cumple todos los requisitos.");
            return;
        }

        if (!coinciden) {
            setError("Las contraseñas no coinciden.");
            return;
        }

        setEnviando(true);
        const r = await CambiarMiContrasena({
            "ContraseñaActual": form.actual,
            "NuevaContraseña": form.nueva,
            "ContraseñaConfirmacion": form.confirmacion
        });
        setEnviando(false);

        if (r.status === 200) {
            setExito(r.message);
            setForm({ actual: "", nueva: "", confirmacion: "" });
            return;
        }

        setError(r.message);
    };

    return (
        <Box sx={{ p: 2 }}>
            <Paper sx={{ p: 3, maxWidth: 720, mx: "auto" }}>
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
                    <KeyIcon color="primary" />
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                        Perfil de Usuario
                    </Typography>
                </Stack>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Sesión iniciada como{" "}
                    <strong>{usuario?.nombreUsuario || "sin identificar"}</strong>.
                    Desde aquí puede cambiar su contraseña.
                </Typography>

                <Divider sx={{ mb: 2 }} />

                <Box component="form" onSubmit={handleSubmit} noValidate>
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12 }}>
                            <AppInput
                                id={idActual}
                                label="Contraseña actual"
                                type={ver.actual ? "text" : "password"}
                                value={form.actual}
                                onChange={cambiar("actual")}
                                autoComplete="current-password"
                                required
                                {...adornos("actual")}
                            />
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <AppInput
                                id={idNueva}
                                label="Nueva contraseña"
                                type={ver.nueva ? "text" : "password"}
                                value={form.nueva}
                                onChange={cambiar("nueva")}
                                autoComplete="new-password"
                                required
                                {...adornos("nueva")}
                            />
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <AppInput
                                id={idConfirmacion}
                                label="Confirmar nueva contraseña"
                                type={ver.confirmacion ? "text" : "password"}
                                value={form.confirmacion}
                                onChange={cambiar("confirmacion")}
                                autoComplete="new-password"
                                required
                                error={form.confirmacion.length > 0 && !coinciden}
                                helperText={
                                    form.confirmacion.length > 0 && !coinciden
                                        ? "Las contraseñas no coinciden"
                                        : " "
                                }
                                {...adornos("confirmacion")}
                            />
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <Paper variant="outlined" sx={{ p: 1.5, bgcolor: "grey.50" }}>
                                <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                                    Requisitos de la contraseña
                                </Typography>
                                {reglas.map((r) => {
                                    const ok = r.valida(form.nueva);
                                    return (
                                        <Typography
                                            key={r.texto}
                                            variant="caption"
                                            sx={{
                                                display: "block",
                                                color: form.nueva.length === 0
                                                    ? "text.secondary"
                                                    : ok ? "success.main" : "error.main"
                                            }}
                                        >
                                            {form.nueva.length === 0 ? "•" : ok ? "✓" : "✗"} {r.texto}
                                        </Typography>
                                    );
                                })}
                            </Paper>
                        </Grid>

                        {error && (
                            <Grid size={{ xs: 12 }}>
                                <Alert severity="error">{error}</Alert>
                            </Grid>
                        )}

                        {exito && (
                            <Grid size={{ xs: 12 }}>
                                <Alert severity="success">{exito}</Alert>
                            </Grid>
                        )}

                        {exito && (
                            <Grid size={{ xs: 12 }}>
                                <Alert severity="info">
                                    Las demás sesiones abiertas seguirán funcionando con el token
                                    actual. Si sospecha que alguien más la usó, cierre esa sesión
                                    desde el equipo correspondiente.
                                </Alert>
                            </Grid>
                        )}

                        <Grid size={{ xs: 12 }}>
                            <Stack direction="row" spacing={1} justifyContent="flex-end">
                                <AppButton
                                    type="button"
                                    content="Volver"
                                    onClick={() => navigate("/index")}
                                />
                                <AppButton
                                    type="submit"
                                    content={enviando ? "Guardando..." : "Cambiar contraseña"}
                                    disabled={enviando}
                                />
                            </Stack>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
        </Box>
    );
}

export default Configuracion;
