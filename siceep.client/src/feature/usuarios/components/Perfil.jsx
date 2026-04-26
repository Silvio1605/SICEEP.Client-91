import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid'
// componente para mostrar el perfil del usuario seleccionado en la tabla de usuarios
import Permisos from './../../permisos/pages/Permisos';
import CardUsuario from './CardUsuario';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function Perfil({ open, onClose }) {
    
    return (
        <React.Fragment>
            <Dialog
                fullScreen
                open={open}
                onClose={onClose}
                TransitionComponent={Transition}
                disableRestoreFocus
            >
                <AppBar sx={{ position: 'relative' }}>
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={onClose}
                            aria-label="close"
                        >
                            <CloseIcon />
                        </IconButton>
                        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                            Perfil de Usuario
                        </Typography>
                        <Button autoFocus color="inherit" onClick={onClose}>
                            Cerrar
                        </Button>
                    </Toolbar>
                </AppBar>
                <Box sx={{ flexGrow: 1, p: 2 }}>
                    <Grid container spacing={2}>
                        <Grid size={{ xs:12, sm: 12, md: 4 }}>
                            <CardUsuario />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 12, md: 8 }}>
                            <Permisos />
                        </Grid>
                    </Grid>
                </Box>
            </Dialog>
        </React.Fragment>
    );
}

