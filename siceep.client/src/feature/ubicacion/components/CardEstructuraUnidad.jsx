import { useState } from 'React';
import {
    Grid,
    Typography,
    Button,
    Card,
    CardContent,
    Stack
} from "@mui/material";

import AppInput from "./../../../shared/components/AppInput";

export default function CardEstructuraUnidad({
    titulo,
    tipo,
    onClose,
    guardando = false
}) {

    const [registro, setRegistro] = useState({
        nombre: "",
        orden: ""
    });

    const handleGuardar = async () => {

        if (tipo === "estructura") {
            await registrarEstructura(registro);
        } else {
            await registrarUnidad(registro);
        }

        onClose();
    };

    return (
        <Card
            elevation={2}
            sx={{
                borderRadius: 3
            }}
        >
            <CardContent>

                <Typography
                    variant="h6"
                    sx={{
                        mb: 3,
                        fontWeight: 600,
                        color: "primary.main"
                    }}
                >
                    {titulo}
                </Typography>

                <Typography
                    variant="subtitle2"
                    sx={{
                        mb: 2,
                        color: "text.secondary",
                        fontWeight: 600
                    }}
                >
                    Información General
                </Typography>

                <Grid container spacing={2}>

                    <Grid size={{ xs: 12 }}>
                        <AppInput
                            id="nombre"
                            label="Nombre"
                            value={registro.nombre ?? ""}
                            onChange={(e) =>
                                setRegistro({
                                    ...registro,
                                    nombre: e.target.value
                                })
                            }
                        />
                    </Grid>

                    {tipo === "estructura" && (
                        <Grid size={{ xs: 12, md: 4 }}>
                            <AppInput
                                id="orden"
                                label="Orden"
                                type="number"
                                inputProps={{
                                    step: 0.01
                                }}
                                value={registro.orden ?? ""}
                                onChange={(e) =>
                                    setRegistro({
                                        ...registro,
                                        orden: e.target.value
                                    })
                                }
                            />
                        </Grid>
                    )}

                </Grid>

                <Stack
                    direction="row"
                    justifyContent="flex-end"
                    spacing={2}
                    sx={{ mt: 4 }}
                >
                    <Button
                        variant="outlined"
                        color="inherit"
                        onClick={onClose}
                    >
                        Cancelar
                    </Button>

                    <Button
                        variant="contained"
                        onClick={handleGuardar}
                        disabled={guardando}
                    >
                        {guardando ? "Guardando..." : "Guardar"}
                    </Button>

                </Stack>

            </CardContent>
        </Card>
    );
}