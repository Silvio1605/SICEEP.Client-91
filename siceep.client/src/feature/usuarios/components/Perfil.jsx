import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid'

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

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
                        <Grid size={4}>
                            <Item>Perfil</Item>
                        </Grid>
                        <Grid size={8}>
                            <Item>Permisos</Item>
                        </Grid>
                    </Grid>
                </Box>
            </Dialog>
        </React.Fragment>
    );
}

