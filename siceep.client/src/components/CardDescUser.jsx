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

function CardDescUser() {
    
    return (
      // Información del Usuario
        <Box sx={{ flexGrow: 1 , mb: 2 }}>
            <Grid container spacing={2}>
                <Grid size={{ xs: 12, lg: 6 }}>
                    <Item>
                        <Box sx={{ p: 1, bgcolor: "background.default" }}>
                            <Box display="flex" alignItems="center" sx={{ pl: 4 }}>

                                {/* Avatar */}
                                <Avatar alt="user" src="/image/default-user.jpg" />

                                {/* Textos */}
                                <Box sx={{ ml: 2 }}>
                                    <Typography variant="h5">
                                        <strong>SilvioJM</strong>
                                    </Typography>

                                    <Typography variant="body2" sx={{ pt: 1 }}>
                                        <strong>Propietario: </strong> Silvio Junior Morales Domínguez
                                    </Typography>
                                </Box>

                            </Box>
                        </Box>
                    </Item>
                    
                </Grid>
               
                <Grid size={{ xs: 12, lg: 6 }}>
                    <Item>
                        <Box display="flex" alignItems="center" sx={{ ml: 3, pb: 1, pt: 1 }}>
                            <WorkIcon sx={{ mr: 1 }} />

                            <Typography variant="body2">
                                <strong>Rol :</strong> Administrador
                            </Typography>
                        </Box>

                        <Box display="flex" alignItems="center" sx={{ ml: 3, pb: 1, pt: 1 }}>
                            <VillaIcon sx={{ mr: 1 }} />

                            <Typography variant="body2">
                                <strong>Ubicado en:</strong> División de Personal y Cuadros
                            </Typography>
                        </Box>
                    </Item>
                </Grid>
                <Grid size={{ xs: 12, lg: 12 }}>
                    <Item>
                        <Box
                            display="flex"
                            alignItems="center"
                            sx={{ bgcolor: "background.default" }}
                        >
                            {/* Bloque izquierdo */}
                            <Box display="flex" alignItems="center" sx={{ ml: 3, pb: 1, pt: 1 }}>
                                <CalendarTodayIcon sx={{ mr: 1 }} />

                                <Typography variant="body2">
                                    <strong>La cuenta expira el:</strong> 03/12/2028
                                </Typography>
                            </Box>
                            {/* Bloque derecho*/}
                            <Box display="flex" alignItems="center" sx={{ ml: 3, pb: 1, pt: 1 }}>
                                <LockClockIcon sx={{ mr: 1 }} />

                                <Typography variant="body2">
                                    <strong>Tiempo de uso restante:</strong> 2 años y 5 meses de uso restantes.
                                </Typography>
                            </Box>

                        </Box>
                    </Item>
                </Grid>

            </Grid>
        </Box>
  );
}

export default CardDescUser;




