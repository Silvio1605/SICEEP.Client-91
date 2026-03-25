import { Box, Typography } from "@mui/material";
import { styled } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { TextField } from "@mui/material";
import VillaIcon from '@mui/icons-material/Villa';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: (theme.vars ?? theme).palette.text.secondary,
    ...theme.applyStyles('dark', {
        backgroundColor: '#1A2027',
    }),
}));

function CardDescUser() {
    
    return (
      // Información del Usuario
        <Box sx={{ flexGrow: 1 , p: 1, m:1 }}>
            <Grid container spacing={2}>
                <Grid size={{ xs: 12, lg: 6 }}>
                    <Box sx={{ p: 2, bgcolor: "background.default" }}>
                        <Box display="flex" alignItems="left" sx={{ p: 1, m: 0, bgcolor: "background.default" }}>
                            <Stack direction="row" spacing={2}>
                                <Avatar alt="user" src="./../public/image/default-user.jpg" />
                            </Stack>
                            <Typography variant="h6" sx={{ mb: 1, p: 1 }}>
                                <strong>SilvioJM</strong> (Carnet:2602102030)
                            </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ ml: 5, p: 0 }}>
                            <strong>Cuenta asignada a:</strong> Silvio Junior Morales Domínguez
                        </Typography>
                    </Box>
                    
                    
                </Grid>
                <Grid size={{ xs: 12, lg: 6 }}>
                    <Box sx={{ p: 2, bgcolor: "background.default" }}>
                        
                        <TextField
                            fullWidth
                            disabled
                            label="La cuenta expira el"
                            type="date"
                            size="small"
                            defaultValue="2028-02-10"
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        <Typography variant="body2" sx={{ mb: 1, p: 1 }}>
                            <VillaIcon sx={{ mt:1, mr: 1 }} />
                            <strong>Ubicado en:</strong> División de Personal y Cuadros
                        </Typography>
                    </Box>
                </Grid>

            </Grid>
        </Box>
  );
}

export default CardDescUser;




