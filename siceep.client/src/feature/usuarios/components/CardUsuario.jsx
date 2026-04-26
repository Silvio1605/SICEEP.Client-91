import { Box, Typography, Divider } from "@mui/material";
import { styled } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { TextField } from "@mui/material";
import VillaIcon from '@mui/icons-material/Villa';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import BoyIcon from '@mui/icons-material/Boy';
import WorkIcon from '@mui/icons-material/Work';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LockClockIcon from '@mui/icons-material/LockClock';
// servicios
import { useBusqueda } from './../hooks/useBusqueda';
import { usePerfil } from '../hooks/usePerfil'; 

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'left',
    color: (theme.vars ?? theme).palette.text.secondary,
    ...theme.applyStyles('dark', {
        backgroundColor: '#1A2027',
    }),
}));

const esFechaValida = (fecha) => {
    const f = new Date(fecha);
    return !isNaN(f.getTime());
};

const tiempoRestante = (fecha) => {
    // Validación de fecha
    if (!esFechaValida(fecha)) {
        return "Fecha inválida";
    }
    // Cálculo de tiempo restante
    const ahora = new Date();
    const objetivo = new Date(fecha);

    if (objetivo <= ahora) return "Cuenta Expirada";

    let anios = objetivo.getFullYear() - ahora.getFullYear();
    let meses = objetivo.getMonth() - ahora.getMonth();
    let dias = objetivo.getDate() - ahora.getDate();

    if (dias < 0) {
        meses--;
        const diasMesAnterior = new Date(
            objetivo.getFullYear(),
            objetivo.getMonth(),
            0
        ).getDate();
        dias += diasMesAnterior;
    }

    if (meses < 0) {
        anios--;
        meses += 12;
    }

    // Construcción dinámica
    const partes = [];

    if (anios > 0) partes.push(`${anios} año${anios > 1 ? "s" : ""}`);
    if (meses > 0) partes.push(`${meses} mes${meses > 1 ? "es" : ""}`);
    if (dias > 0) partes.push(`${dias} día${dias > 1 ? "s" : ""}`);

    return partes.length > 0 ? partes.join(", ") : "Hoy";
};

function CardUsuario() {

    const { idSeleccionado } = useBusqueda();
    const { perfil } = usePerfil(idSeleccionado);

    return (
        // Información del Usuario
        <Box sx={{ flexGrow: 1, mb: 1 }}>
            <Grid container spacing={2}>
                <Grid size={12}>
                    <Item>
                        <Box sx={{ p: 1, bgcolor: "background.default" }}>
                            <Box display="flex" alignItems="center" sx={{ pl: 4 }}>

                                {/* Avatar */}
                                <Avatar alt="user" src="/image/default-user.jpg" />

                                {/* Textos */}
                                <Box sx={{ ml: 2 }}>
                                    <Typography variant="h5">
                                        <strong>{perfil.usuario?.usuario}</strong>
                                    </Typography>

                                    <Typography variant="body2" sx={{ pt: 1 }}>
                                        <strong>Propietario: </strong> {perfil.usuario?.propietario}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Item>

                </Grid>

                <Grid size={12}>
                    <Item>
                        <Box display="flex" alignItems="center" sx={{ ml: 3, pb: 1, pt: 1 }}>
                            <WorkIcon sx={{ mr: 1 }} />

                            <Typography variant="body2">
                                <strong>Rol :</strong> {perfil.usuario?.rol}
                            </Typography>
                        </Box>

                        <Box display="flex" alignItems="center" sx={{ ml: 3, pb: 1, pt: 1 }}>
                            <VillaIcon sx={{ mr: 1 }} />

                            <Typography variant="body2">
                                <strong>Ubicado en:</strong> {perfil.estructura?.estructura}
                            </Typography>
                        </Box>
                    </Item>
                </Grid>
                <Grid size={12}>
                    <Item>
                        <Box display="flex" alignItems="center" sx={{ ml: 3, pb: 1, pt: 1 }}>
                            <CalendarTodayIcon sx={{ mr: 1 }} />

                            <Typography variant="body2">
                                <strong>La cuenta expira el:</strong> {perfil.usuario?.fechaExpiracion}
                            </Typography>
                        </Box>

                        <Box display="flex" alignItems="center" sx={{ ml: 3, pb: 1, pt: 1 }}>
                            <LockClockIcon sx={{ mr: 1 }} />

                            <Typography variant="body2">
                                <strong>Tiempo de uso restante:</strong> {tiempoRestante(perfil.usuario?.fechaExpiracion)}
                            </Typography>
                        </Box>
                    </Item>
                </Grid>
            </Grid>
        </Box>
    );
}

export default CardUsuario;